import { jest } from "@jest/globals";
import type {FaostatTestRecord} from "../types/testTypes.ts"

//some helpers to avoid repetition
export const getFreshApp = async () => {
  jest.resetModules();
  return (await import("../../src/app")).default;
};

export const successfulLogin = (
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

export const productionData = (
  records: FaostatTestRecord[] = [
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