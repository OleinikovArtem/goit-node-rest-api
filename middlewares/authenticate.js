import jwt from "jsonwebtoken";
import User from "../models/User.js";
import HttpError from "../helpers/HttpError.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw HttpError(401, "Not authorized");
    }

    const [bearer, token] = authHeader.split(" ", 2);
    if (bearer !== "Bearer" || !token) {
      throw HttpError(401, "Not authorized");
    }

    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(id);
      
      if (!user || user.token !== token) {
        throw HttpError(401, "Not authorized");
      }

      req.user = user;
      next();
    } catch (error) {
      throw HttpError(401, "Not authorized");
    }
  } catch (error) {
    next(error);
  }
};

export default authenticate;

