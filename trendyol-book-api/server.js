const http = require('http');
const express = require('express');
let cors = require('cors');

const itemsRouter = require('./routes/books');

const app = express();
app.use(express.json());
app.use(cors({origin: 'http://localhost:8100'}));

app.use('/api', itemsRouter);
app.use('/', function(req, res) {
    res.send('Welcome');
});

const server = http.createServer(app);
const port = 8081;
server.listen(port);

console.debug('Server listening on port ' + port);

module.exports = app.listen(3000);

