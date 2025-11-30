import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import User from "../models/User.js";
import HttpError from "../helpers/HttpError.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const register = async (email, password) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "identicon" });
  
  const user = await User.create({
    email,
    password: hashedPassword,
    subscription: "starter",
    avatarURL,
  });

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

export default {
  register,
  login,
  logout,
  getCurrent,
  updateSubscription,
  updateAvatar,
};

