const mongoose = require("mongoose");

async function DbConnect() {
  const DB_URL = process.env.DB_URL;

  try {
    
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Connection successful
    console.log('DB connected...');
  } catch (error) {
    // Error handling if connection fails
    console.error('Connection error:', error);
  }

  // Handling the 'error' event on the mongoose connection
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, 'connection error:'));
}

module.exports = DbConnect;
