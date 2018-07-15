var router = require('express').Router();

router.get('/', function(req, res) {
  res.render('index');
});

router.post('/upload', function(req, res) {
  res.send('Audi Q7, BMW X5, Mercedes GL')
});

router.get('/download', function(req, res) {
  res.send("Download is incoming!");
  console.log(req.body);
  console.log("Requesting file...");
});

module.exports = router;
