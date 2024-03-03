const cors = require("cors");
const express = require("express");
const app = express();
const initRoutes = require("./src/routes/routes.js");
const port = 8080;
const bodyParser = require('body-parser');

global.__basedir = __dirname;

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => {
    res.json({'message': 'ok'});
  })

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use('/uploads', express.static('./uploads'));

initRoutes(app);

app.listen(port, "localhost", () => {
  console.log(`Running at localhost:${port}`);
});