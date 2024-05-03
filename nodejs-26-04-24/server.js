const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

app.post("/upload", upload.array("myfile"), (req, res) => {
    if (req.files && req.files.length > 0) {
        const uploadedFiles = req.files.map(file => ({ filename: file.originalname, size: file.size }));
        res.json({ success: true, files: uploadedFiles });
    } else {
        res.status(400).json({ success: false, message: "No files uploaded" });
    }
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
