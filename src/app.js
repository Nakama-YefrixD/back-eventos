const express = require("express")
const http = require('http');

const cors = require('cors');
const route = require('./Routes/index')
const bodyParser = require('body-parser');

const app = express()
app.use(cors());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json())
app.use(route)

app.get("/", (req, res) => {
    res.send("Hola Mundo desde el home")
})

const server = http.createServer(app);

server.listen(8003, () => {
    console.log('Express en Lineas en el puerto 8003')
})