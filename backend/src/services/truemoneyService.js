import axios from "axios";
import { config } from "../config.js";

/**
 * Extract the voucher hash from a full TrueMoney link or accept a raw hash.
 * @param {string} linkOrHash full URL such as https://gift.truemoney.com/campaign/?v=XYZ or raw hash
 * @returns {string|null} voucher hash if found, otherwise null
 */
export const extractVoucherHash = (linkOrHash) => {
  if (!linkOrHash) return null;
  if (/^[A-Za-z0-9]+$/.test(linkOrHash)) return linkOrHash;
  const regex = /gift\.truemoney\.com\/campaign\/\?v=([A-Za-z0-9]+)/;
  const match = linkOrHash.match(regex);
  return match ? match[1] : null;
};

export const redeemTrueMoneyVoucher = async (voucherHash, phoneNumber) => {
  if (!voucherHash) {
    return { success: false, message: "Voucher hash is required", amount: 0 };
  }

  const resolvedPhone = phoneNumber || config.truMoneyReceiverPhone;
  if (!resolvedPhone) {
    return { success: false, message: "Receiver phone number is not configured", amount: 0 };
  }

  const url = `https://gift.truemoney.com/campaign/vouchers/${voucherHash}/redeem`;
  const payload = { mobile: resolvedPhone, voucher_hash: voucherHash };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "RevzME-Gateway",
      },
      timeout: 10000,
    });

    return parseResponse(response.data);
  } catch (error) {
    if (error.response) {
      return parseResponse(error.response.data);
    }
    return { success: false, message: `TrueMoney request failed: ${error.message}`, amount: 0 };
  }
};

const parseResponse = (data) => {
  const code = data?.status?.code;
  if (!code) {
    return { success: false, message: "Invalid TrueMoney response", amount: 0 };
  }

  if (code === "SUCCESS") {
    const amount = Number(data?.data?.voucher?.redeemed_amount_baht) || 0;
    return {
      success: true,
      message: `Redeemed ${amount} THB`,
      amount,
      raw: data,
    };
  }

  return {
    success: false,
    message: getErrorMessage(code),
    amount: 0,
    errorCode: code,
  };
};

const getErrorMessage = (code) => {
  const messages = {
    MISSING_RECEIVER_PHONE_NUMBER: "กรุณากรอกเบอร์รับซองอั่งเปา",
    MISSING_GIFT_CODE_OR_URL: "กรุณากรอกลิงก์ซองอั่งเปาหรือเบอร์โทรศัพท์ให้ถูกต้อง",
    INVALID_RECEIVER_PHONE_NUMBER_FORMAT: "รูปแบบเบอร์ไม่ถูกต้อง",
    INVALID_GIFT_CODE_OR_URL_FORMAT: "รูปแบบลิงก์ซองอั่งเปาไม่ถูกต้อง",
    CANNOT_GET_OWN_VOUCHER: "ไม่สามารถรับซองอั่งเปาของตัวเองได้",
    VOUCHER_OUT_OF_STOCK: "ซองอั่งเปานี้ถูกรับไปหมดแล้ว",
    VOUCHER_EXPIRED: "ซองอั่งเปาหมดอายุแล้ว",
    UNEXPECTED_ERROR: "เกิดข้อผิดพลาดในการรับซองอั่งเปา",
  };
  return messages[code] || `เกิดข้อผิดพลาด: ${code}`;
};
