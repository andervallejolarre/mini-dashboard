import express from "express";
import {countryTradePrice, logIn} from "../controllers/tradeController";

const tradeRoute = express.Router();

tradeRoute.get("/login", logIn);
tradeRoute.get("/:country", countryTradePrice);

export default tradeRoute;