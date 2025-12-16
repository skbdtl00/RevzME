import express from "express";
import { config } from "../config.js";

const router = express.Router();

export const buildTransactionRouter = (service) => {
  const settings = {
    truMoneyReceiverPhone: config.truMoneyReceiverPhone,
    planariaApiKey: config.planariaApiKey ? "configured" : "",
    receiverName: config.receiverName,
    receiverNameMatchMode: config.receiverNameMatchMode,
    receiverBankNumber: config.receiverBankNumber,
    receiverBankType: config.receiverBankType,
    receiverBankName: config.receiverBankName,
    receiverBankDisplayName: config.receiverBankDisplayName,
  };

  const apiKeyGuard = (req, res, next) => {
    const provided = req.header("x-api-key") || req.header("authorization");
    if (!provided || provided.replace("Bearer ", "") !== config.apiKey) {
      return res.status(401).json({ success: false, message: "API key required" });
    }
    next();
  };

  router.use("/v1", apiKeyGuard);

  router.get("/health", (_req, res) => {
    res.json({ status: "ok", name: "Revz.ME Payment Gateway" });
  });

  router.get("/v1/settings", (_req, res) => {
    res.json({ success: true, data: settings });
  });

  router.put("/v1/settings", (req, res) => {
    const updates = req.body || {};
    if (updates.receiverBankType && updates.receiverBankType.length > 64) {
      return res.status(400).json({ success: false, message: "receiverBankType must be 64 chars or less" });
    }
    Object.assign(settings, updates);
    res.json({ success: true, data: settings });
  });

  router.post("/v1/transactions/create", async (req, res) => {
    const { method, amount, callback } = req.body || {};
    const result = await service.createTransaction({ method, amount, callback });
    if (result.error) return res.status(400).json({ success: false, message: result.error });
    res.json(result);
  });

  router.get("/v1/transactions/:id", async (req, res) => {
    const trx = await service.getTransaction(req.params.id);
    if (!trx) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: trx });
  });

  router.get("/v1/transactions/:id/isPaid", async (req, res) => {
    const paid = await service.isPaid(req.params.id);
    if (paid === null) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, paid });
  });

  router.post("/v1/transactions/:id/verify-slip", async (req, res) => {
    const { qrcode_text } = req.body || {};
    const result = await service.verifySlipTransaction(req.params.id, qrcode_text);
    if (result?.error) return res.status(400).json({ success: false, message: result.error, details: result.details });
    res.json({ success: true, ...result });
  });

  router.post("/v1/transactions/:id/redeem", async (req, res) => {
    const { voucher_link, phone_number } = req.body || {};
    const result = await service.redeemTruemoneyTransaction(req.params.id, voucher_link, phone_number);
    if (result?.error) return res.status(400).json({ success: false, message: result.error, details: result.details });
    res.json({ success: true, ...result });
  });

  router.post("/v1/transactions/:id/cancel", async (req, res) => {
    const cancelled = await service.markCancelled(req.params.id, req.body?.reason);
    if (!cancelled) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: cancelled });
  });

  return router;
};

export default router;
