const express = require('express');
const funcs = require('./funcs')
const router = express.Router();
var params

router.get('/', (req, res) => {
  res.render('default',{params:params,funcs:funcs});
});
router.get('/settings', (req, res) => {
  res.render('settings',{params:params,funcs:funcs});
});
router.get('/log', (req, res) => { res.render('log',{params:params,funcs:funcs});});

function initialise(passparams) {
    params=passparams
}

module.exports = {initialise,router};