import express, { Request, Response, NextFunction, Errback } from "express";
import { SERVER_PORT } from "./config/envConfig";
import connectDb from "./config/dbConfig";
const app = express();

// declare a route with a response
app.get('/', (req, res) => {
  res.send("What's up doc ?!");
});

// Global Error Handling
app.use((err: Errback, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send("Uh oh! An unexpected error occured.");
});

app.listen(SERVER_PORT, async () => {
  connectDb();
  console.log(`Server listening on port ${SERVER_PORT}`);
});