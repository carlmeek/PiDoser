const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('It works!');
  res.render('default');
});

module.exports = router;