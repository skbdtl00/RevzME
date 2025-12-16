import crypto from "crypto";
import { config } from "../config.js";

export const createChecksum = (payload) => {
  const hmac = crypto.createHmac("sha256", config.tokenSecret);
  hmac.update(JSON.stringify(payload));
  return hmac.digest("hex");
};

export const buildPaymentUrl = (id, checksum) => {
  const base = config.paymentBaseUrl.replace(/\/+$/, "");
  return `${base}/${id}?token=${checksum}`;
};
