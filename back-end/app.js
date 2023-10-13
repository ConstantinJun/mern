const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const moongose = require("mongoose");

const HttpError = require("./models/http-error");

const placesRoutes = require("./routes/place-routes");
const usersRoutes = require("./routes/user-routes");
const { default: mongoose } = require("mongoose");

const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/users", usersRoutes);
app.use("/api/places", placesRoutes);

app.use((req, res, next) => {
  throw new HttpError("Could not find this route.", 404);
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

moongose
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lph99n2.mongodb.net/${process.env.DB_NAME}?`)
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
