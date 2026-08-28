import express from "express";
import {countryProduction, logIn} from "../controllers/productionController";

const productionRoute = express.Router();

productionRoute.post("/login", logIn);
productionRoute.get("/:country", countryProduction);

export default productionRoute;