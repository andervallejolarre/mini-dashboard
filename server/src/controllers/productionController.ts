import { Request, Response } from "express";
import { sendError } from '../utils/response';

import type {FaostatResponse, ProductionPoint} from "../types/faostatTypes"

const areaCode = {
    brazil: 21,
    colombia: 44,
    peru: 170,
    ecuador: 58,
    bolivia: 19,
    venezuela: 236,
}

export const countryProduction = async (req: Request, res: Response): Promise<void> => {
    try {
        const country = areaCode[req.params.country as keyof typeof areaCode];

        if (!country) {
            sendError(res, 400, `Unsupported country: ${req.params.country}`);
            return;
        }

        const faostatToken = res.locals.faostatToken as string;

        const response = await fetch(`https://faostatservices.fao.org/api/v1/en/data/QCL?area=${country}&element=2510&item=656&year=2025%2C2024%2C2023%2C2022%2C2021%2C2020%2C2019%2C2018%2C2017%2C2016%2C2015`,
            { headers: { Authorization: `Bearer ${faostatToken}` } }
        );

        if (!response.ok) {
            const errorBody = await response.text();
            sendError(res, response.status, `FAOSTAT API ERROR: ${errorBody}`);
            return;
        }

        const faostatResponse: FaostatResponse = await response.json();

        const production: ProductionPoint[] = faostatResponse.data.map((entry) => ({
            year: entry.Year,
            value: entry.Value,
        }));

        res.json(production);

    } catch (err) {
        sendError(res, 500, 'Something went wrong');
    }
}