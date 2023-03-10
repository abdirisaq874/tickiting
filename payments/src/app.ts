import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFound, CurrentUser } from "@mandeezticketing/common/build";
import { createChargeRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(CurrentUser);

app.use(createChargeRouter);

app.all("*", async (req, res) => {
  throw new NotFound();
});

app.use(errorHandler);

export { app };
