import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { AppError } from '../utils/AppError';

let faostatToken: string | null = null;
let tokenExpiresAt = 0;

//Function in charge of loggin In to FAOSTAT API using env variables
const logIn = async (): Promise<string> => {

    const body = new URLSearchParams({
        username: process.env.FAOSTAT_USER ?? "",
        password: process.env.FAOSTAT_PASSWORD ?? "",
    });

    const response = await fetch("https://faostatservices.fao.org/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        //This is not a Req/Res function so we can't use senError. 
        //We use a class App Error declared in utils
        throw new AppError(response.status, `FAOSTAT login failed: ${errorBody}`);
    }

    const data = await response.json();
    const authenticationResult = data.AuthenticationResult;

    const accessToken = authenticationResult.AccessToken as string;
    faostatToken = accessToken;
    //We update token expiration
    tokenExpiresAt = Date.now() + authenticationResult.ExpiresIn * 1000;

    return accessToken;
};

//Middleware in charge of verifying token validation
export const tokenStatus = async (req: Request, res: Response, next: NextFunction ): Promise<void> => {
    try {
        //A quick calculation to see if token is almost expired
        const expiresSoon = Date.now() >= tokenExpiresAt - 60_000;
        //If it is we call login
        if (!faostatToken || expiresSoon) {
            faostatToken = await logIn();
        }

        res.locals.faostatToken = faostatToken;
        next();
    } catch (error) {
        //Here we handle class AppError so it can follow the same error format other error messages are following
        if (error instanceof AppError) {
            sendError(res, error.statusCode, error.message);
            return;
        }
        const message = error instanceof Error ? error.message : "Authentication failed";
        sendError(res, 502, message);
    }
};