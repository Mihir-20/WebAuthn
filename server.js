import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';


const app = express();
app.use(cors());
app.use(express.json());

const users = [];

app.post("/register", (req, res) => {
  const { name, fingerprint } = req.body;

  users.push({ name, fingerprint });

  res.status(200).send("User registered successfully!");
});

app.post("/login", (req, res) => {
  const { credential } = req.body;

  const user = users.find((user) => user.fingerprint === credential.id);

  if (!user) {
    res.status(401).send("Fingerprint not recognized");
    return;
  }

  res.status(200).json({ name: user.name });
});

app.listen(5000, () => console.log("Server listening on port 5000!"));
