const express = require('express');
const { networkInterfaces } = require('os');
const funcs = require('./funcs')
const router = express.Router();
var params
var network

router.get('/', (req, res)         => { res.render('default',{params:params,funcs:funcs});});
router.get('/settings', (req, res) => { res.render('settings',{params:params,funcs:funcs});});
router.get('/log', (req, res)      => { res.render('log',{params:params,funcs:funcs});});
router.get('/system', (req, res)   => { res.render('system',{params:params,funcs:funcs});});

//API
router.get('/update', (req, res)   => { update(req,res) });

function update(req,res) {
    res.write("Updating Software...")
    res.close()
    network.update()
}

function initialise(passparams,passnetwork) {
    params=passparams
    network=passnetwork
}

module.exports = {initialise,router};