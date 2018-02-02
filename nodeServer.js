//A simple node server with a catch all that lets you refresh from any page
//Just run node nodeServer.js


var deployConfig = require('./deployConfig')

const express = require('express')

const app = express();

app.use(function logRequest (req, res, next) {
  console.log(`${req.method}: ${req.originalUrl}`);
  next()
});

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/metadatamanager')


app.use(deployConfig.baseUrl, express.static(__dirname + '/metadatamanager'));

app.get('*', (req, res, next) => {
  console.log('catchAll');
  res.render('index.html');
})

app.listen(9005);
console.log('Server listening on 9005')