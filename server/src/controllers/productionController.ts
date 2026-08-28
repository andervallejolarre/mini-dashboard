import dotenv from "dotenv"
import { Request, Response } from "express";

const areaCode={
    brazil:21,
    colombia:44,
    peru:170,
    ecuador:58,
    bolivia:19,
    venezuela:236,
}

export const countryProduction = async (req: Request, res: Response):Promise<void> => {
    try{
        const country=areaCode[req.params.country as keyof typeof areaCode];

        if (!country) throw new Error (`No such country`);

        const faostatToken = res.locals.faostatToken as string;

        const response= await fetch(`https://faostatservices.fao.org/api/v1/en/data/QCL?area=${country}&element=2510&item=656&year=2024%2C2023%2C2022%2C2021%2C2020%2C2019%2C2018%2C2017%2C2016%2C2015`,
            {headers:{Authorization:`Bearer ${faostatToken}` }}
        );

        if (!response.ok)throw new Error(`FAOSTAT API error: ${response.status}`);

        const data = await response.json();

        res.json(data)

    }catch(err){
        res.status(500).json({ error: 'Something went wrong'})
    }
}