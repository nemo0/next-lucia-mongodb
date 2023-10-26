import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: {
    type: String,
  },
  email: {
    type: String,
  },
});

export const User = mongoose.models.User ?? mongoose.model("User", userSchema);

const keySchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  hashed_password: String,
});

export const Key = mongoose.models.Key ?? mongoose.model("Key", keySchema);

const sessionSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  active_expires: {
    type: Number,
    required: true,
  },
  idle_expires: {
    type: Number,
    required: true,
  },
});

export const Session =
  mongoose.models.Session ?? mongoose.model("Session", sessionSchema);
