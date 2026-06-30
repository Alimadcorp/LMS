const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'static')));

app.get("/api/login", (req, res) => {
    console.log(req.body);
});

app.listen(3000);