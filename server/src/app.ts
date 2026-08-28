import express from "express";
import cors from "cors"
import productionRoute from "./routes/productionRoute";
import tradeRoute from "./routes/tradeRoute";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/production", productionRoute);
app.use("/api/trade", tradeRoute);

export default app;