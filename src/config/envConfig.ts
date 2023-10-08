import dotenv from "dotenv";

dotenv.config();

export const SERVER_PORT = process.env.SERVER_PORT ?? 5555;
export const MONGO_CONNECTION_STRING =
  process.env.MONGO_CONNECTION_STRING || "";
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? "";
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? "";