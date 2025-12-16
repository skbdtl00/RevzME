import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config.js";
import { TransactionStore } from "./db/transactionStore.js";
import { TransactionService } from "./services/transactionService.js";
import { buildTransactionRouter } from "./routes/transactions.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

const store = new TransactionStore();
const service = new TransactionService(store);

store.init().catch((err) => {
  console.error("Failed to initialize database, falling back to in-memory store", err);
});

app.use("/", buildTransactionRouter(service));

app.listen(config.port, () => {
  console.log(`Revz.ME Payment Gateway running on port ${config.port}`);
});
