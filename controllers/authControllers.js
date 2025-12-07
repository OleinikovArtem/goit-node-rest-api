import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import authService from "../services/authServices.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.register(email, password);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const user = await authService.getCurrent(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { subscription } = req.body;
    const user = await authService.updateSubscription(req.user.id, subscription);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { path: tempPath, filename } = req.file;
    const userId = req.user.id;
    const uniqueFilename = `${userId}-${Date.now()}${path.extname(filename)}`;
    const publicPath = path.join(__dirname, "../public/avatars", uniqueFilename);

    // Move file from temp to public/avatars
    await fs.rename(tempPath, publicPath);

    // Create avatar URL
    const avatarURL = `/avatars/${uniqueFilename}`;

    // Update user avatar in database
    const result = await authService.updateAvatar(userId, avatarURL);

    res.status(200).json(result);
  } catch (error) {
    // Clean up temp file if something went wrong
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        // Ignore unlink errors
      }
    }
    next(error);
  }
};

