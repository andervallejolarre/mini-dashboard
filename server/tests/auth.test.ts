import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import request from 'supertest';

//importing helpers to avoid repetition
import { getFreshApp, successfulLogin, productionData } from "./helpers/testHelpers"

afterEach(() => {
    jest.restoreAllMocks();
});

describe('GET /api/production/:country', () => {
    it('logs In successfully and passes the token to the production route', async () => {
        const app = await getFreshApp();
        //we mock the API Req/Res
        const fetchMock = jest.spyOn(global, "fetch");

        fetchMock
            //For the first Request, this is going to be the outcome
            .mockResolvedValueOnce(successfulLogin())
            //For the second Request, this is going to be the outcome
            .mockResolvedValueOnce(productionData());

        const response = await request(app).get("/api/production/peru");

        expect(response.status).toBe(200);
        //Here we compare the expected responses
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock).toHaveBeenLastCalledWith(
            expect.stringContaining("area=170"),
            {
                headers: { Authorization: "Bearer test-token" },
            }
            //We'll follow this patterns throughout the whole test
        );
    });

    it('two requests, first one logsIn second one does not need to', async () => {
        const app = await getFreshApp();
        const fetchMock = jest.spyOn(global, "fetch");

        fetchMock
            .mockResolvedValueOnce(successfulLogin())
            .mockResolvedValueOnce(productionData())
            .mockResolvedValueOnce(
                productionData([
                    { Year: 2025, Value: 321 },
                    { Year: 2024, Value: 111 },
                ])
            );

        await request(app).get("/api/production/peru");
        const response = await request(app).get("/api/production/ecuador");

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { year: 2025, value: 321 },
            { year: 2024, value: 111 },
        ]);
        //3 calls to our bacend because we already loggedIn.
        expect(fetchMock).toHaveBeenCalledTimes(3);
        expect(fetchMock).toHaveBeenLastCalledWith(
            expect.stringContaining("area=58"),
            expect.anything()
        );
    });

    it('refresh token when less than a 1 minute left to expire', async () => {
        const app = await getFreshApp();
        const fetchMock = jest.spyOn(global, "fetch");

        fetchMock
            //we are mockin tokenExpiresAt so it needs to logIn again for the second HTTP Request
            .mockResolvedValueOnce(successfulLogin("test-token", 10))
            .mockResolvedValueOnce(productionData())
            .mockResolvedValueOnce(successfulLogin("new-token"))
            .mockResolvedValueOnce(
                productionData([
                    { Year: 2025, Value: 321 },
                    { Year: 2024, Value: 111 },
                ])
            );

        await request(app).get("/api/production/peru");
        const response = await request(app).get("/api/production/ecuador");

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { year: 2025, value: 321 },
            { year: 2024, value: 111 },
        ]);

        //4 calls in this case. Token expires so we needed to logIn again
        expect(fetchMock).toHaveBeenCalledTimes(4);
        expect(fetchMock).toHaveBeenLastCalledWith(
            expect.stringContaining("area=58"),
            {
                headers: { Authorization: "Bearer new-token" },
            }
        );
    });
});

describe("when FAOSTAT credentials are unavailable", () => {
    const originalEnv = process.env;

//Here we need to mock some environmental variables so we add a beforeEach.

    beforeEach(() => {
        process.env = {
            ...originalEnv,
            FAOSTAT_USER: "",
            FAOSTAT_PASSWORD: "",
        };
    });

    //and also a afterEach to restore regular configuration
    afterEach(() => {
        process.env = originalEnv;
        jest.restoreAllMocks();
    });

    it("returns an authentication error", async () => {
        jest.spyOn(global, "fetch").mockResolvedValueOnce(
            new Response("Invalid credentials", { status: 401 })
        );

        const app = await getFreshApp();

        const response = await request(app).get("/api/production/brazil");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            ok: false,
            payload: expect.stringContaining("FAOSTAT login failed"),
        });
    });
});

describe('GET /api/production/:country', () => {
    it('massive API system failure', async () => {
        const app = await getFreshApp();
        //Here we change mockResolvedValueOnce for a RejectedValueOnce to test errors
        jest.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network unavailable"));

        const response = await request(app).get("/api/production/peru");

        expect(response.status).toBe(502);
        expect(response.body).toEqual({
            ok: false,
            payload: "Network unavailable",
        });
    });
});