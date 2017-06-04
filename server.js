const path = require('path');
const express = require('express');
const app = express();
const PORT = 8080;
const HOST = process.env.HOST || 'localhost';

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/dist/index.html');
});

app.listen(PORT, HOST, error => (
    error
        ? console.error(error)
        : console.info(`Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`)
));
