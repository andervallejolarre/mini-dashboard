import { Request, Response } from "express";
import { sendError } from '../utils/response';

import type {FaostatResponse, ProductionPoint} from "../types/faostatTypes"

//FAOSTAT Country Codes used for API Requests
const areaCode = {
    brazil: 21,
    colombia: 44,
    peru: 170,
    ecuador: 58,
    bolivia: 19,
    venezuela: 236,
}

//function called by our front-end to fetch country production data
export const countryProduction = async (req: Request, res: Response): Promise<void> => {
    try {
        //country passed by our UI
        const country = areaCode[req.params.country as keyof typeof areaCode];

        if (!country) {
            sendError(res, 400, `Unsupported country: ${req.params.country}`);
            return;
        }

        const faostatToken = res.locals.faostatToken as string;

        //Hardcoded url. Can be modified in the future.
        const response = await fetch(`https://faostatservices.fao.org/api/v1/en/data/QCL?area=${country}&element=2510&item=656&year=2025%2C2024%2C2023%2C2022%2C2021%2C2020%2C2019%2C2018%2C2017%2C2016%2C2015%2C2014%2C2013%2C2012%2C2011%2C2010%2C2009%2C2008%2C2007%2C2006%2C2005%2C2004%2C2003%2C2002%2C2001%2C2000%2C1999%2C1999%2C1998%2C1997%2C1996%2C1995%2C1994%2C1993%2C1992%2C1991%2C1990%2C1989%2C1988%2C1987%2C1986%2C1985%2C1984%2C1983%2C1982%2C1981%2C1980`,
            { headers: { Authorization: `Bearer ${faostatToken}` } }
        );

        if (!response.ok) {
            const errorBody = await response.text();
            //senError helper for consistency
            sendError(res, response.status, `FAOSTAT API ERROR: ${errorBody}`);
            return;
        }

        const faostatResponse: FaostatResponse = await response.json();

        //Here we filter the data response to take just what we need
        const production: ProductionPoint[] = faostatResponse.data.map((entry) => ({
            year: entry.Year,
            value: entry.Value,
        }));

        res.json(production);

    } catch (err) {
        sendError(res, 500, 'Something went wrong');
    }
}