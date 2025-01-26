const dotenv = require("dotenv").config({ path: './config.env' });
const app = require('./app');

app.listen(process.env.PORT, (err) => {
    if (err) {
      console.error("Error starting server:", err);
    }
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });