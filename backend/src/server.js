import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});