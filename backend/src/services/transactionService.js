import { randomUUID } from "crypto";
import { config } from "../config.js";
import { createChecksum, buildPaymentUrl } from "../utils/token.js";
import { verifySlip } from "./slipService.js";
import { extractVoucherHash, redeemTrueMoneyVoucher } from "./truemoneyService.js";

const METHOD_SLIP = 0;
const METHOD_TRUEMONEY = 1;

const MINIMUMS = {
  [METHOD_SLIP]: 5,
  [METHOD_TRUEMONEY]: 10,
};

/**
 * Core transaction workflow handler for creation, verification, and redemption.
 * @param {TransactionStore} store persistent storage (PostgreSQL or in-memory)
 */
export class TransactionService {
  constructor(store) {
    this.store = store;
  }

  async createTransaction(payload) {
    const { method, amount, callback } = payload;
    if (![METHOD_SLIP, METHOD_TRUEMONEY].includes(method)) {
      return { error: "method must be 0 (slip verify) or 1 (Truemoney wallet)" };
    }

    if (Number(amount) < MINIMUMS[method]) {
      return { error: `Minimum amount for method ${method} is ${MINIMUMS[method]} THB` };
    }

    const id = randomUUID();
    const expiresAt = new Date(Date.now() + config.transactionExpiryMinutes * 60 * 1000);
    const tokenChecksum = createChecksum({ id, method, amount, expiresAt: expiresAt.toISOString() });
    const paymentUrl = buildPaymentUrl(id, tokenChecksum);

    const record = await this.store.create({
      id,
      method,
      amount: Number(amount),
      status: "pending",
      callback,
      tokenChecksum,
      paymentUrl,
      expiresAt,
      metadata: { createdBy: "api" },
    });

    return {
      success: true,
      message: "Transaction created",
      data: {
        id: record.id,
        paymentUrl,
        tokenChecksum,
        expiresAt,
        status: record.status,
        amount: record.amount,
        method,
      },
    };
  }

  async getTransaction(id) {
    const trx = await this.store.get(id);
    if (!trx) return null;
    if (trx.status === "pending" && new Date(trx.expiresAt).getTime() < Date.now()) {
      await this.store.update(id, { status: "expired" });
      return { ...trx, status: "expired" };
    }
    return trx;
  }

  async isPaid(id) {
    const trx = await this.getTransaction(id);
    if (!trx) return null;
    return trx.status === "paid";
  }

  async verifySlipTransaction(id, qrcodeText) {
    const trx = await this.getTransaction(id);
    if (!trx) return { error: "Transaction not found" };
    if (trx.method !== METHOD_SLIP) return { error: "Transaction is not slip verify method" };
    if (trx.status !== "pending") return { error: `Cannot verify transaction in status ${trx.status}` };

    const verification = await verifySlip(qrcodeText);
    if (!verification.success) {
      return { error: verification.message || "Slip validation failed" };
    }

    await this.store.update(id, {
      status: "paid",
      metadata: { ...trx.metadata, slip: verification },
    });

    return { success: true, message: "Slip verified and transaction marked as paid", verification };
  }

  async redeemTruemoneyTransaction(id, voucherLink, phoneNumber) {
    const trx = await this.getTransaction(id);
    if (!trx) return { error: "Transaction not found" };
    if (trx.method !== METHOD_TRUEMONEY) return { error: "Transaction is not TrueMoney method" };
    if (trx.status !== "pending") return { error: `Cannot redeem transaction in status ${trx.status}` };

    const voucherHash = extractVoucherHash(voucherLink);
    if (!voucherHash) return { error: "voucher_link is invalid" };

    const result = await redeemTrueMoneyVoucher(voucherHash, phoneNumber);
    if (!result.success) {
      return { error: result.message || "Voucher redemption failed", details: result };
    }

    await this.store.update(id, { status: "paid", metadata: { ...trx.metadata, voucher: result } });
    return { success: true, message: result.message, amount: result.amount };
  }

  async markCancelled(id, reason) {
    const trx = await this.getTransaction(id);
    if (!trx) return null;
    await this.store.update(id, { status: "cancelled", metadata: { ...trx.metadata, reason } });
    return { ...trx, status: "cancelled", metadata: { ...trx.metadata, reason } };
  }
}
