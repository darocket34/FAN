// All necessary dependencies
const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const routes = require("./routes");

const { environment } = require("./config");
const isProduction = environment === "production";

const app = express();


// Middleware to log info for req/res
app.use(morgan("dev"));

// Middleware for parsing cookies and JSON req bodies
app.use(cookieParser());
app.use(express.json());

// Security Middleware
if (!isProduction) {
  // cors is only used in dev
  app.use(cors());
}

app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
    },
  })
);

  // Connect all routes to Express app
  app.use(routes);

module.exports = app;
