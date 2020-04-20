'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { MongoClient } = require('mongodb');
const {
  getCollection,
  createGreeting,
  batchImport,
  getGreeting,
  findMoreThenOne,
  deleteGreeting,
  updateGreeting,
  } = require('./craig')

const PORT = process.env.PORT || 8000;



express()
  .use(morgan('tiny'))
  .use(express.static('public'))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .use('/', express.static(__dirname + '/'))

  // exercise 1
  .get('/ex-1/:dbname/:collection', getCollection)
  // exercise 2
  .post('/ex-2/greeting', createGreeting)
  .post('/ex-2/greetings/all', batchImport)
  .get('/ex-2/greeting/:_id',getGreeting)
  .get('/ex-2/greetings', findMoreThenOne)
  .delete('/ex-2/deleteGreeting/:_id', deleteGreeting)
  .put('/ex-2/updateGreeting/:_id',updateGreeting)
  // handle 404s
  .use((req, res) => res.status(404).type('txt').send('🤷‍♂️'))

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
