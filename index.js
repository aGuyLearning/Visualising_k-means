const express = require('express');
const d3 = require('d3');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 5000;

// Set static folger
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log('Server Listening on Port ' + PORT))