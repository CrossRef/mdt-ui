//A simple node server with a catch all that lets you refresh from any page


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
  res.render('index.html');
})

module.exports = (config, callback) => {
  app.listen(config.port, function () {
    console.log(`========== Server listening on localhost:${config.port}${deployConfig.baseUrl} ==========`)
    callback()
  });

  return app
}