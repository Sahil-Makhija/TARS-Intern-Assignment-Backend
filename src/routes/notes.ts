import { Hono } from "hono";

import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import { Note } from "../db";

type Variables = JwtVariables;

export const notes = new Hono<{ Variables: Variables }>();

notes.use("/", jwt({ secret: process.env.JWT_SECRET! }));

notes.get("/", async (c) => {
  const userId = c.get("jwtPayload").id;
  const notes = await Note.find({ userId });
  if (!notes) {
    return c.json({ error: "No notes found" });
  }
  return c.json({ notes });
});

notes.post("/create", async (c) => {
  const userId = c.get("jwtPayload").id;
  const { title, content, images } = await c.req.json();
  const note = await Note.create({ userId, title, content, images });
  return c.json({ note });
});
