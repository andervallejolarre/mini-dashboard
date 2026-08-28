import express from "express";
import {countryProduction} from "../controllers/productionController";
import { tokenStatus } from "../middleware/authManager";

const productionRoute = express.Router();

productionRoute.get("/:country", tokenStatus, countryProduction);

export default productionRoute;