const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const moment = require("moment");
const Exercise = require("../models/ExerciseModel");
const User = require("../models/UserModel");

const { getError } = require("../utils/ErrorUtil");

module.exports.addExercise = async (req, res) => {
  const { userId } = req.body;
  try {
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(400).send(getError(400, "unknown userId given"));
    } else {
      //adding new exercise because there exists user data with given userId
      const { description, duration, date } = req.body;
      const exercise = new Exercise({ userId, description, duration, date });
      const exerciseData = await exercise.save();
      if (!exerciseData) {
        return res.status(500).send(getError(500, "Something went wrong"));
      } else {
        return res.send({
          username: userData.username,
          description: exerciseData.description,
          duration: exerciseData.duration,
          _id: exerciseData._id,
          date: moment(exerciseData.date).format("ddd MMM DD YYYY")
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(getError(500, "Internal server error"));
  }
};
module.exports.getExercises = async (req, res) => {
  let { userId, from, to, limit } = req.query;
  limit = parseInt(limit);
  try {
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(400).send(getError(400, "unknown userId given"));
    } else {
      //showing exercise logs of this user because there exists user data with given userId
      const queryConditions = { userId };

      if (from) {
        queryConditions.date = { $gte: new Date(from) };
      }

      if (to) {
        if (queryConditions.date) {
          queryConditions.date["$lte"] = new Date(to);
        } else {
          queryConditions.date = { $lte: new Date(to) };
        }
      }

      const query = Exercise.find(queryConditions);
      if (limit) {
        query.limit(limit);
      }

      query.exec((err, exercises) => {
        if (err) {
          return res.status(500).send({ message: "Something went wrong" });
        } else {
          return res.send({
            _id: userData._id,
            username: userData.username,
            count: exercises.length,
            log: exercises.map(({ description, duration, date }) => ({
              description,
              duration,
              date: moment(date).format("ddd MMM DD YYYY")
            }))
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(getError(500, "Internal server error"));
  }
};
