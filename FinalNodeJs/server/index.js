const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const http = require("http");
const socketIO = require("socket.io");
const multer = require("multer");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const PORT = 3000;
const SECRET_KEY = "tron_secret_key_1997_10_19";

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));
app.use(express.static(__dirname + "/public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/upload-folder/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 200 * 1024 * 1024 },
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ file: req.file });
});

app.post("/voice-add", upload.single("audio"), (req, res) => {
  res.json({ file: req.file });
});

app.post("/upload-media", upload.array("photos"), (req, res) => {
  let mediaArray = [];
  console.log(req.files);
  req.files.forEach((item) => {
    if (item.mimetype.split("/")[0] === "video") {
      mediaArray.push({
        fileType: item.mimetype,
        fileName: item.originalname,
      });
    }
  });
  res.json(mediaArray);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mydb",
  password: "root",
  port: 5432,
});

app.get("/download", (req, res) => {
  let fileName = req.query.nameoffile;
  const file = `${__dirname}/public/upload-folder/${fileName}`;
  res.download(file);
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  pool.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
    [username, hashedPassword],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Registration failed" });
      }
      res.status(201).json({ userId: result.rows[0].id });
    }
  );
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;

  pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username],
    async (err, result) => {
      if (err || result.rows.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
        expiresIn: "1h",
      });
      res.json({ token });
    }
  );
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route" });
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return next(new Error("Authentication error"));
    }
    socket.user = user;
    next();
  });
});

io.on("connection", (socket) => {
  socket.on("join chat", (users) => {
    console.log("Joining chat:", users);
    let user1 = users.userfirst.toLowerCase();
    let user2 = users.usersecond.toLowerCase();

    pool.query(
      `CREATE TABLE IF NOT EXISTS ${user1}and${user2} (
            id SERIAL PRIMARY KEY,
            message TEXT NOT NULL,
            fromuser VARCHAR(100) NOT NULL,
            photos JSONB,
            nameoffile TEXT,
            voice TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );`,
      (err, res) => {
        if (err) {
          console.error("Error creating table:", err);
        } else {
          console.log("Table created or exists already");
        }
      }
    );
    console.log("User connected");
  });

  socket.on("read chat", (users) => {
    let user1 = users.userfirst.toLowerCase();
    let user2 = users.usersecond.toLowerCase();
    pool.query(`SELECT * FROM ${user1}and${user2}`, (err, response) => {
      if (err) {
        console.error("Error reading chat:", err);
        socket.emit("chat history", []);
      } else {
        socket.emit("chat history", response.rows);
      }
    });
  });

  socket.on("chat message", (msg) => {
    console.log("Received chat message:", msg);

    pool.query(
      `INSERT INTO ${msg.userfirst}and${msg.usersecond} (message, fromuser, photos, nameoffile,voice) VALUES ($1, $2, $3, $4,$5) RETURNING *`,
      [
        msg.message,
        msg.fromuser,
        JSON.stringify(msg.photos),
        msg.file ? msg.file.nameoffile : null,
        msg.voice ? msg.voice : null,
      ],
      (err, res) => {
        if (err) {
          console.error("Error inserting message:", err);
        } else {
          console.log("Message inserted:", res.rows[0]);
        }
      }
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
