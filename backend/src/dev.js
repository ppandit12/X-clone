import app from './index.js';
import env from './config/env.config.js';
import { connectDB } from "./config/connect.config.js";

connectDB().then(() => {
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
});