import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => res.send("Hello World from the server"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
