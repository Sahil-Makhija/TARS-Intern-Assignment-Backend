import { Hono } from "hono";

import type { JwtVariables } from "hono/jwt";
import { cors } from "hono/cors";

import { connectDB } from "./db";
import { auth, notes } from "./routes";

type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>();

// Database connection
connectDB();

app.use("/*", cors({ origin: "*" }));
app.get("/api/v1", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/v1/auth", auth);
app.route("/api/v1/notes", notes);

export default app;
