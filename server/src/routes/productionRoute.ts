import express from "express";
import {countryProduction} from "../controllers/productionController";
import { tokenStatus } from "../middleware/authManager";

const productionRoute = express.Router();

//our only route, passing a country name through params and passing a middleware before reaching our controller
productionRoute.get("/:country", tokenStatus, countryProduction);

export default productionRoute;