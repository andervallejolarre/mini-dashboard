import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import request from 'supertest';

//some helpers to avoid repetition
const getFreshApp = async () => {
    jest.resetModules();
    return (await import("../src/app")).default;
};

const successfulLogin = (
    token = "test-token",
    expiresIn = 3600
) =>
    new Response(
        JSON.stringify({
            AuthenticationResult: {
                AccessToken: token,
                ExpiresIn: expiresIn,
            },
        }),
        { status: 200 }
    );

const productionData = (
    records = [
        { Year: 2025, Value: 123 },
        { Year: 2024, Value: 100 },
    ]
) =>
    new Response(
        JSON.stringify({
            metadata: {},
            data: records,
        }),
        { status: 200 }
    );

afterEach(() => {
    jest.restoreAllMocks();
});

//login success (continues to countryProd)
describe('GET /api/production/:country', () => {
    it('logs In successfully and passes the token to the production route', async () => {
        const app = await getFreshApp();
        const fetchMock = jest.spyOn(global, "fetch");

        fetchMock
            .mockResolvedValueOnce(successfulLogin())
            .mockResolvedValueOnce(productionData());

        const response = await request(app).get("/api/production/peru");

        expect(response.status).toBe(200);

        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock).toHaveBeenLastCalledWith(
            expect.stringContaining("area=170"),
            {
                headers: { Authorization: "Bearer test-token" },
            }
        );
    });

    //two requests. second never get's to the logIn function
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

        expect(fetchMock).toHaveBeenCalledTimes(3);
        expect(fetchMock).toHaveBeenLastCalledWith(
            expect.stringContaining("area=58"),
            expect.anything()
        );
    });

    //token refresh
    it('refresh token when less than a 1 minute left to expire', async () => {
        const app = await getFreshApp();
        const fetchMock = jest.spyOn(global, "fetch");

        fetchMock
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

        expect(fetchMock).toHaveBeenCalledTimes(4);
        expect(fetchMock).toHaveBeenLastCalledWith(
            expect.stringContaining("area=58"),
            {
                headers: { Authorization: "Bearer new-token" },
            }
        );
    });
});

//WRONG env variables

describe("when FAOSTAT credentials are unavailable", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = {
            ...originalEnv,
            FAOSTAT_USER: "",
            FAOSTAT_PASSWORD: "",
        };
    });

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

//massive failure

describe('GET /api/production/:country', () => {
    it('massive API system failure', async () => {
        const app = await getFreshApp();

        jest.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network unavailable"));

        const response = await request(app).get("/api/production/peru");

        expect(response.status).toBe(502);
        expect(response.body).toEqual({
            ok: false,
            payload: "Network unavailable",
        });
    });
});