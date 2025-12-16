import dotenv from "dotenv";

dotenv.config();

const numberOr = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const config = {
  apiKey: process.env.API_KEY || "dev-api-key",
  port: numberOr(process.env.PORT, 4000),
  databaseUrl: process.env.DATABASE_URL,
  paymentBaseUrl: process.env.PAYMENT_BASE_URL || "http://localhost:3000/payment",
  tokenSecret: process.env.TOKEN_SECRET || "revzme-token-secret",
  truMoneyReceiverPhone: process.env.TRUEMONEY_RECEIVER_PHONE || "",
  planariaApiKey: process.env.PLANARIA_API_KEY || "",
  receiverName: process.env.RECEIVER_NAME || "",
  receiverNameMatchMode: (process.env.RECEIVER_NAME_MATCH_MODE || "exact").toLowerCase(),
  receiverBankNumber: process.env.RECEIVER_BANK_NUMBER || "",
  receiverBankType: process.env.RECEIVER_BANK_TYPE || "",
  receiverBankName: process.env.RECEIVER_BANK_NAME || "",
  receiverBankDisplayName: process.env.RECEIVER_BANK_DISPLAY_NAME || "",
  transactionExpiryMinutes: numberOr(process.env.TRANSACTION_EXPIRY_MINUTES, 10),
};
