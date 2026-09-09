import dotenv from "dotenv"
import app from "./app"

dotenv.config()

//Mandatory variables
const requiredVariables = [
    "FAOSTAT_USER",
    "FAOSTAT_PASSWORD",
] as const;

//If we don't have this variables the app is not running
for (const variable of requiredVariables) {
    if (!process.env[variable]) {
        throw new Error(`Missing required environment variable: ${variable}`);
    }
}

const PORT = process.env.PORT || 4040


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

