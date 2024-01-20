const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const locationsRouter = require("./routes/locationsRouter");
const config = require("./database/config");
const mysql = require("mysql");

const app = express();
const port = 3001;
const connection = mysql.createConnection(config);
let server = undefined;

app.use(bodyParser.json());

app.use(cors());

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Test successful" });
});

// app.use("/api/locations", locationsRouter);

app.use("/api/locations", cors({ origin: "*" }), locationsRouter);

app.use("/", express.static("dist"));

connection.connect((err) => {
  // mysql connection
  if (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1);
  } else {
    console.log("MySQL connection successful.");

    server = app
      .listen(port, () => {
        console.log(`Server listening on port ${port}`);
      })
      .on("error", (err) => {
        console.error("Error starting server:", err);
        process.exit(1);
      });
    app.use(express.static("dist"));
  }
});

const gracefulShutdown = () => {
  console.log("Starting graceful shutdown...");

  // Close the server
  if (server) {
    console.log("Server was opened, closing it now...");

    server.close((serverError) => {
      if (serverError) {
        console.error("Error closing server:", serverError);
        process.exit(1);
      } else {
        console.log("Server closed successfully.");

        // Close the MySQL connection
        connection.end((dbError) => {
          if (dbError) {
            console.error("Error closing MySQL connection:", dbError);
            process.exit(1);
          } else {
            console.log("MySQL connection closed successfully.");
            process.exit(0);
          }
        });
      }
    });
  } else {
    console.log("No server to close.");
    process.exit(0);
  }
};

process.on("SIGTERM", gracefulShutdown); // Some other app requirest shutdown.
process.on("SIGINT", gracefulShutdown); // ctrl-c
