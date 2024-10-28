import express from "express";
import mysql from "mysql2";
import cors from "cors";
import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "hello",
  database: "test",
});

app.get("/", (req, res) => {
  res.send("I am live");
});
app.get("/books", (req, res) => {
  const q = "SELECT * FROM test.books";
  db.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

app.post("/books", (req, res) => {
  const { title, desc, cover } = req.body;
  const q = "INSERT INTO books (`title`,`desc`,`cover`) VALUES (?)";
  const values = [title, desc, cover];
  db.query(q, [values], (err, data) => {
    if (err) return res.status(400).json(err);

    return res.json("Book created successfully");
  });
});
app.delete("/books/:id", (req, res) => {
  const id = req.params.id;
  const q = "DELETE FROM books WHERE id = (?)";
  db.query(q, [id], (err, data) => {
    if (err) return res.status(400).json(err);
    return res.json("Book deleted successfully");
  });
});
app.patch("/books/:id", (req, res) => {
  const id = req.params.id;
  const { title, desc, cover } = req.body;
  const values = [title, desc, cover];
  const q =
    "UPDATE books SET `title` = ?, `desc` = ?, `cover` = ? WHERE id = ?";
  db.query(q, [...values, id], (err, data) => {
    if (err) return res.status(400).json(err);

    return res.json("Book updated successfully");
  });
});

app.listen(5000, () => {
  console.log("Connected to backend on port 5000");
});
