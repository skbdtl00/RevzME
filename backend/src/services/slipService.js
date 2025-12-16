import axios from "axios";
import { config } from "../config.js";

const PLANARIA_URL = "https://www.planariashop.com/api/checkslip.php";

const matchName = (value, expected, mode = "exact") => {
  if (!expected) return true;
  if (!value) return false;
  if (mode === "contains") return value.toLowerCase().includes(expected.toLowerCase());
  return value.trim().toLowerCase() === expected.trim().toLowerCase();
};

export const verifySlip = async (qrcodeText) => {
  if (!qrcodeText) {
    return { success: false, message: "qrcode_text is required" };
  }

  if (!config.planariaApiKey) {
    return {
      success: true,
      message: "Planaria key not configured; skipping remote validation",
      amount: null,
      receiver: { name: config.receiverName },
    };
  }

  try {
    const body = new URLSearchParams({
      keyapi: config.planariaApiKey,
      qrcode_text: qrcodeText,
    });

    const response = await axios.post(PLANARIA_URL, body.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 10000,
    });

    const data = response.data;
    if (data.status !== "success") {
      const message =
        typeof data.message === "string"
          ? data.message
          : data.message?.message_th ||
            data.message?.massage_th ||
            data.message?.massage_en ||
            "Slip invalid";
      return { success: false, message };
    }

    const receiverName = data.receiver?.name || "";
    const receiverValid = matchName(receiverName, config.receiverName, config.receiverNameMatchMode);

    if (!receiverValid) {
      return { success: false, message: "Receiver name does not match requirements" };
    }

    return {
      success: true,
      message: data.message || "Slip verified",
      amount: data.amount,
      receiver: data.receiver,
      sender: data.sender,
      transactionId: data.transactionId,
      statusCheckSlip: data.status_check_slip,
    };
  } catch (error) {
    return { success: false, message: `Planaria request failed: ${error.message}` };
  }
};
