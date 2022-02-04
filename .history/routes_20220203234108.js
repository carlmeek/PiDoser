const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('default',{params:params});
});
router.get('/settings', (req, res) => {
  res.render('settings',{params:params});
});

module.exports = router;