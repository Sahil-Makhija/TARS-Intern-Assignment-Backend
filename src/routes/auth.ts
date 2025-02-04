import { Hono } from "hono";
import { User } from "../db";
import { jwt } from "hono/jwt";

export const auth = new Hono();

auth.post("/sign-in", async (c) => {
  const { email, password } = await c.req.json();
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return c.json({ message: "Invalid email or password" }, 401);
  }

  try {
    const token = user.generateAuthToken();
    return c.json({ token });
  } catch (err: any) {
    return c.json({ message: err.message }, 400);
  }
});

auth.post("/sign-up", async (c) => {
  const { username, email, password } = await c.req.json();
  if (await User.findOne({ $or: [{ username }, { email }] })) {
    return c.json({ message: "User already exists" }, 400);
  }
  const user = await User.create({ username, email, password });

  try {
    const token = user.generateAuthToken();
    return c.json({ token });
  } catch (err: any) {
    return c.json({ message: err.message }, 400);
  }
});

auth.post("/verify", jwt({ secret: process.env.JWT_SECRET! }), async (c) => {
  const jwt = c.get("jwtPayload");

  if (jwt && jwt.id) {
    return c.json({ status: "verified" });
  }
  return c.json({ status: "unverified" });
});
