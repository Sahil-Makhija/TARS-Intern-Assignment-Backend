import mongoose, { Document, Schema, Model } from "mongoose";

import validator from "validator";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  createdAt: Date;
}

export interface IUserMethods {
  generateAuthToken: () => string;
  comparePassword: (password: string) => Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: { type: String, required: true, unique: true }, // Unique username
    password: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail],
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await hash(this.password, 10);
});

UserSchema.methods.generateAuthToken = function () {
  const token = sign({ id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: "7 days",
  });
  return token;
};

UserSchema.methods.comparePassword = async function (password: string) {
  return await compare(password, this.password);
};

export const User = mongoose.model("User", UserSchema);
