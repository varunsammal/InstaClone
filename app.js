const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080; // 🔧 Corrected the casing of PORT
const mongoose = require('mongoose');

const path = require("path");

require('./models/model');
require('./models/post');


const cors = require('cors');
app.use(cors({ origin: 'https://instaclone-production-4111.up.railway.app' })); // Adjust with your frontend URL


app.use(express.json());

// app.use("/api", require("./routes/Auth"));
// app.use("/api", require("./routes/createPost"));
// app.use("/api", require("./routes/user"));

app.use(require("./routes/Auth"));
app.use(require("./routes/createPost"));
app.use(require("./routes/user"));

const { mongoURL } = require('./keys');
mongoose.connect(mongoURL);
mongoose.connection.on("connected", () => {
    console.log("successfully connected to mongodb");
});
mongoose.connection.on("error", () => {
    console.log("not connected to mongodb");
});

// 🔧 Corrected the frontend build folder path
app.use(express.static(path.join(__dirname, "./social-webapplication/build")));

app.get("*", (req, res) => {

    res.sendFile(
        path.join(__dirname, "./social-webapplication/build/index.html"),
        function (err) {
            res.status(500).send(err);
        }
    );
});


app.listen(PORT, () => {
    console.log("server started on port", PORT);
});
