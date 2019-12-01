const Joi = require("@hapi/joi");
const { getError } = require("../utils/ErrorUtil");

module.exports.validateUser = (req, res, next) => {
  const { username } = req.body;
  const schema = Joi.object({
    username: Joi.string()
      .alphanum()
      .required()
  });
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(getError(400, error.details[0].message));
  }
  next();
};
