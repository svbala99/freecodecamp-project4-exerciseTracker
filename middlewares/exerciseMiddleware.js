const Joi = require("@hapi/joi");
const { getError } = require("../utils/ErrorUtil");

module.exports.validateAddExerciseInput = (req, res, next) => {
  const { userId } = req.body;
  const schema = Joi.object({
    userId: Joi.string().required(),
    description: Joi.string().required(),
    duration: Joi.number().required(),
    date: Joi.date().required()
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(getError(400, error.details[0].message));
  }
  next();
};

module.exports.getExerciseValidator = (req, res, next) => {
  let { userId, from, to, limit } = req.query;
  limit = parseInt(limit);
  const schema = Joi.object({
    userId: Joi.string().required(),
    from: Joi.date(),
    to: Joi.date(),
    limit: Joi.number()
  });
  const { error, value } = schema.validate(req.query);
  if (error) {
    return res.status(400).send(getError(400, error.details[0].message));
  }
  next();
};
