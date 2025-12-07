import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import * as authControllers from "../controllers/authControllers.js";
import authService from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";

jest.mock("../services/authServices.js");

describe("Login Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return status code 200 on successful login", async () => {
    const mockResult = {
      token: "mock-jwt-token",
      user: {
        email: "test@example.com",
        subscription: "starter",
      },
    };

    authService.login.mockResolvedValue(mockResult);

    await authControllers.login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResult);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return token in response", async () => {
    const mockResult = {
      token: "mock-jwt-token",
      user: {
        email: "test@example.com",
        subscription: "starter",
      },
    };

    authService.login.mockResolvedValue(mockResult);

    await authControllers.login(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        token: expect.any(String),
      })
    );
  });

  it("should return user object with email and subscription fields of type String", async () => {
    const mockResult = {
      token: "mock-jwt-token",
      user: {
        email: "test@example.com",
        subscription: "starter",
      },
    };

    authService.login.mockResolvedValue(mockResult);

    await authControllers.login(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({
          email: expect.any(String),
          subscription: expect.any(String),
        }),
      })
    );
    expect(typeof mockResult.user.email).toBe("string");
    expect(typeof mockResult.user.subscription).toBe("string");
  });

  it("should call next with error on service failure", async () => {
    const error = HttpError(401, "Email or password is wrong");
    authService.login.mockRejectedValue(error);

    await authControllers.login(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

