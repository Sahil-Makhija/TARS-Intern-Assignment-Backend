import { Hono } from "hono";

import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import { Note } from "../db";

type Variables = JwtVariables;

export const notes = new Hono<{ Variables: Variables }>();

notes.use("/*", jwt({ secret: process.env.JWT_SECRET! }));

notes.get("/", async (c) => {
  const userId = c.get("jwtPayload").id;
  const notes = await Note.find({ userId });
  if (!notes) {
    return c.json({ status: false, error: "No notes found for this user!" });
  }
  return c.json({ status: true, notes });
});

notes.post("/create", async (c) => {
  const { userId } = c.get("jwtPayload");
  const { title, content, images, audioTranscription } = await c.req.json();
  const note = await Note.create({
    userId,
    title,
    content,
    images,
    audioTranscription,
  });
  return c.json({ note });
});

notes.delete("/delete", async (c) => {
  const { id: userId } = c.get("jwtPayload");
  const { noteId } = await c.req.json();
  const note = await Note.findOneAndDelete({ _id: noteId, userId });
  if (!note) {
    return c.json({
      status: false,
      error: "Note not found or you're not authorized to delete this note!",
    });
  }
  return c.json({ status: true, message: "Note deleted successfully!" });
});

notes.get("/:noteId", async (c) => {
  const { id: userId } = c.get("jwtPayload");
  const { noteId } = c.req.param();
  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) {
    return c.json({
      status: false,
      error: "Note not found or you're not authorized to delete this note!",
    });
  }
  return c.json({ note });
});

notes.get("/:noteId/favourite", async (c) => {
  const { id: userId } = c.get("jwtPayload");
  const { noteId } = c.req.param();
  const note = await Note.findOne({ _id: noteId, userId });
  if (note) {
    note.isFavorite = !note.isFavorite;
    await note.save();
  }
  if (!note) {
    return c.json({
      status: false,
      error: "Note not found or you're not authorized to delete this note!",
    });
  }
  return c.json({ note });
});
