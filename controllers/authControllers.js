import authService from "../services/authServices.js";

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

