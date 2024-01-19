const yup = require("yup");
const db = require("../database/databaseConfig");

const locationSchema = yup.object({
  finnish: yup.string().required().min(1).max(20),
  english: yup.string().required().min(1).max(20),
});

const locationsController = {
  getAllLocations: async (req, res) => {
    try {
      const locations = await db.queryAsync("SELECT * FROM words");
      res.json(locations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getLocationById: async (req, res) => {
    const id = parseInt(req.params.myId);

    try {
      const locations = await db.queryAsync(
        "SELECT * FROM words WHERE id = ?",
        [id]
      );

      if (locations.length > 0) {
        res.json(locations[0]);
      } else {
        res.status(404).json({ message: "Word pair not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteLocationById: async (req, res) => {
    const id = parseInt(req.params.myId);

    try {
      const result = await db.queryAsync("DELETE FROM words WHERE id = ?", [
        id,
      ]);

      if (result.affectedRows > 0) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Word pair not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  addNewLocation: async (req, res) => {
    const { finnish, english } = req.body;

    try {
      // Validate the request body using Yup
      await locationSchema.validate({ finnish, english });

      const result = await db.queryAsync(
        "INSERT INTO words (finnish, english) VALUES (?, ?)",
        [finnish, english]
      );

      const newLocation = {
        id: result.insertId,
        finnish,
        english,
      };

      res.status(201).json(newLocation);
    } catch (error) {
      if (error.name === "ValidationError") {
        // Yup validation error
        res.status(400).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  },

  getRandomWord: async (req, res) => {
    try {
      const language = req.query.lang || "fi"; // Default to Finnish
      const query =
        "SELECT id, finnish, english FROM words ORDER BY RAND() LIMIT 1";
      const [randomWord] = await db.queryAsync(query);

      // Send back the word based on the requested language
      res.json({
        id: randomWord.id,
        word: language === "en" ? randomWord.english : randomWord.finnish,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getWordById: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const word = await db.queryAsync(
        "SELECT english FROM words WHERE id = ?",
        [id]
      );
      res.json(word[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  validateTranslation: async (req, res) => {
    const { id, translation } = req.body; // Assuming the translation is sent in the request body

    try {
      const query = "SELECT finnish, english FROM words WHERE id = ?";
      const [word] = await db.queryAsync(query, [id]);

      const isCorrect =
        word.finnish.toLowerCase() === translation.toLowerCase() ||
        word.english.toLowerCase() === translation.toLowerCase();

      res.json({ isCorrect });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

const gracefulShutdown = () => {
  console.log("Starting graceful shutdown...");

  // Close the server
  if (server) {
    console.log("Server was opened, closing server...");

    server.close((serverError) => {
      if (serverError) {
        console.error("Error closing server:", serverError);
      } else {
        console.log("Server closed successfully.");

        // Close the MySQL connection
        connection.end((dbError) => {
          if (dbError) {
            console.error("Error closing MySQL connection:", dbError);
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

module.exports = locationsController;
