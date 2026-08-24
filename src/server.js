require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 4000;

connectDB(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 API escuchando en http://localhost:${PORT}`));
});
