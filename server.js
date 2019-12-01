const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const myExerciseController = require("./controllers/MyExerciseController");
const myUserController = require("./controllers/MyUserController");
const userMiddleware = require("./middlewares/userMiddleware");
const exerciseMiddleware = require("./middlewares/exerciseMiddleware");

dotenv.config({ path: __dirname + "/.env" });
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
});
mongoose.connection.on("error", function(err) {
  console.error("MongoDB error: %s", err);
});



app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// app.get("/", (req, res) => {
//   res.send({ data: { message: "Hello" } });
// });

app.post(
  "/api/exercise/new-user",
  userMiddleware.validateUser,
  myUserController.createUser
);
app.post(
  "/api/exercise/add",
  exerciseMiddleware.validateAddExerciseInput,
  myExerciseController.addExercise
);
app.get(
  "/api/exercise/log",
  exerciseMiddleware.getExerciseValidator,
  myExerciseController.getExercises
);

// Not found middleware
app.use((req, res, next) => {
  return next({ status: 404, message: "not found" });
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || "Internal Server Error";
  }
  res
    .status(errCode)
    .type("txt")
    .send(errMessage);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
