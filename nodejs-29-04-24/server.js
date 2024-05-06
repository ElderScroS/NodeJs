const express = require("express");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    fs.readFile(path.join(__dirname, "data.txt"), "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            res.sendStatus(500);
        } else {
            res.cookie("fileData", data, { httpOnly: true });
            res.sendFile(path.join(__dirname, "index.html"));
            console.log(data);   
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
