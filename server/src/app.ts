import express from "express";
import cors from "cors"
import productionRoute from "./routes/productionRoute";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/production", productionRoute);

export default app;