import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(
    app.listen(process.env.PORT || 8000, () => {
      console.log(`App is listening at port: ${process.env.PORT}`);
    })
  )
  .catch((error) => {
    console.log(`MongoDB connection failed`);
  });
