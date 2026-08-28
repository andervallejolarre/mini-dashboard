import { Request, Response, NextFunction } from 'express';

let faostatToken: string | null = null;
let tokenExpiresAt = 0;

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
        throw new Error(`FAOSTAT login failed: ${response.status} ${errorBody}`);
    }

    const data = await response.json();
    const authenticationResult = data.AuthenticationResult;

    const accessToken = authenticationResult.AccessToken as string;
    faostatToken = accessToken;
    tokenExpiresAt = Date.now() + authenticationResult.ExpiresIn * 1000;

    return accessToken;
};

export const tokenStatus = async (req: Request, res: Response, next: NextFunction ): Promise<void> => {
    try {
        const expiresSoon = Date.now() >= tokenExpiresAt - 60_000;

        if (!faostatToken || expiresSoon) {
            faostatToken = await logIn();
        }

        res.locals.faostatToken = faostatToken;
        next();
    } catch (error) {
        const message = error instanceof Error ? error.message : "Authentication failed";
        res.status(502).json({ error: message });
    }
};