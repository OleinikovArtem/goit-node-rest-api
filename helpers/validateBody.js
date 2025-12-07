import HttpError from "./HttpError.js";

const validateBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0]?.message || error.message;
      next(HttpError(400, errorMessage));
    }
    next();
  };

  return func;
};

export default validateBody;
