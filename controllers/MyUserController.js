const User = require("../models/UserModel");

const { getError } = require("../utils/ErrorUtil");

module.exports.createUser = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      return res.status(400).send(getError(400, "Username already taken"));
    } else {
      const user = new User({ username });
      user.save((err, data) => {
        if (err) {
          return res.status(400).send(getError(400, error.details[0].message));
        } else {
          return res.send({ username, _id: data._id });
        }
      });
    }
  } catch (err) {
    return res.send({ error: err });
  }
};
