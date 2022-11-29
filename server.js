var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/static');
app.use(express.static(__dirname + "/static"))

app.get('/', function (req, res) {
    res.render('home.ejs')
});

app.listen(8080);
console.log('Server connected');