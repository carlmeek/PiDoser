const express = require('express');
const funcs = require('./funcs')
const router = express.Router();
var params

router.get('/', (req, res)         => { res.render('default',{params:params,funcs:funcs});});
router.get('/settings', (req, res) => { res.render('settings',{params:params,funcs:funcs});});
router.get('/log', (req, res)      => { res.render('log',{params:params,funcs:funcs});});
router.get('/system', (req, res)   => { res.render('system',{params:params,funcs:funcs});});
router.get('/reboot', (req, res)   => { reboot(req,res) });

function reboot(req,res) {
    res.write("Rebooting...")
    res.close()
}

function initialise(passparams) {
    params=passparams
}

module.exports = {initialise,router};