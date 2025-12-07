import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import User from "../models/User.js";
import HttpError from "../helpers/HttpError.js";
import emailService from "./emailService.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const register = async (email, password) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "identicon" });
  const verificationToken = nanoid();
  
  const user = await User.create({
    email,
    password: hashedPassword,
    subscription: "starter",
    avatarURL,
    verificationToken,
    verify: false,
  });

  try {
    await emailService.sendVerificationEmail(email, verificationToken);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }

  return {
    email: user.email,
    subscription: user.subscription,
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });
  await user.update({ token });

  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
};

const logout = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw HttpError(401, "Not authorized");
  }

  await user.update({ token: null });
};

const getCurrent = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw HttpError(401, "Not authorized");
  }

  return {
    email: user.email,
    subscription: user.subscription,
  };
};

const updateSubscription = async (userId, subscription) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw HttpError(401, "Not authorized");
  }

  await user.update({ subscription });
  return {
    email: user.email,
    subscription: user.subscription,
  };
};

const updateAvatar = async (userId, avatarPath) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw HttpError(401, "Not authorized");
  }

  await user.update({ avatarURL: avatarPath });
  return {
    avatarURL: avatarPath,
  };
};

const verifyEmail = async (verificationToken) => {
  const user = await User.findOne({ where: { verificationToken } });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await user.update({
    verificationToken: null,
    verify: true,
  });
};

const resendVerificationEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verificationToken = nanoid();
  await user.update({ verificationToken });

  try {
    await emailService.sendVerificationEmail(email, verificationToken);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw HttpError(500, "Error sending verification email");
  }
};

export default {
  register,
  login,
  logout,
  getCurrent,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendVerificationEmail,
};

