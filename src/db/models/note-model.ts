import mongoose, { Document, Schema } from "mongoose";

export interface INote extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  content: string;
  audioTranscription?: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  images: string[]; // Array of image URLs (max 5)
}

const NoteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true },
    content: { type: String, required: true },
    audioTranscription: { type: String, default: "" }, // Stores transcribed text from audio
    isFavorite: { type: Boolean, default: false },
    images: {
      type: [String], // Array of image URLs
      validate: [
        (val: string[]) => val.length <= 5,
        "Maximum 5 images allowed",
      ],
    },
  },
  { timestamps: true }
);

// To support full-text search in title & content
NoteSchema.index({ title: "text", content: "text" });

export const Note = mongoose.model<INote>("Note", NoteSchema);
