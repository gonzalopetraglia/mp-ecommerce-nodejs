const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser')

const port = process.env.PORT || 3000

const app = express();
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
 
app.use('/assets', express.static(__dirname + '/assets'));

app.use(require('./routes'));

app.listen(port);
