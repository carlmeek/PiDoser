const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('default');
});
router.get('/', (req, res) => {
  res.render('default');
});

module.exports = router;