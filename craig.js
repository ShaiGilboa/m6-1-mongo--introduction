const { MongoClient } = require('mongodb');
const assert = require('assert');
const fs = require('file-system')

const getGreeting = async (req, res) => {
  const { _id } = req.params;
  try {
    const client = new MongoClient('mongodb://localhost:27017', {
      useUnifiedTopology: true,
    })
    await client.connect();
    // console.log('_id',_id)
    const db = await client.db('ex-2')
    // if _id.length is more then 2 then it is the name of the language, so we capitalize it and look for it
    const findOne = _id.length===2 
      ? await db.collection('two').findOne({_id})
      : await db.collection('two').findOne({"lang": _id.charAt(0).toUpperCase() + _id.slice(1)})
    // console.log('findOne',findOne)
    findOne 
      ? res.status(200).json({ status: 200, _id, result: findOne})
      : res.status(404).json({ status: 404, _id, result: 'not found'})
    client.close();
    console.log('disconnected!');

  } catch (err) {
    res.status(500).json({status: 500, err})
  }
}

const batchImport = async (req, res) => {
  const greetings = JSON.parse(fs.readFileSync('data/greetings.json'));
  try {
    const client = new MongoClient('mongodb://localhost:27017', {
      useUnifiedTopology: true,
    });

    await client.connect();
    console.log('connected!');

    const db = await client.db('ex-2');
    const r = await db.collection('two').insertMany(greetings);
    const finding = await db.collection('greetings').find().toArray();

    finding.length
        ? res.status(200).json({ status: 200, data: finding })
        : res.status(404).json({ status: 404, data: 'Not Found' })
    client.close();
    console.log('disconnected!');
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
}

const getCollection = async (req, res) => {

  const { dbname, collection } = req.params;

  // create a new client
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db(dbname);
  const finding = await db.collection(collection).find().toArray();

    finding.length
        ? res.status(200).json({ status: 200, data: finding })
        : res.status(404).json({ status: 404, data: 'Not Found' })
}

const createGreeting = async (req, res) => {
  try {
    const client = new MongoClient('mongodb://localhost:27017', {
      useUnifiedTopology: true,
    });

    await client.connect();
    console.log('connected!');

    const db = await client.db('ex-2');

    const r = await db.collection('two').insertOne(req.body);
    assert.equal(1, r.insertedCount);

    const finding = await db.collection('two').find().toArray();

    finding.length
        ? res.status(200).json({ status: 200, data: finding })
        : res.status(404).json({ status: 404, data: 'Not Found' })
    client.close();
    console.log('disconnected!');
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
}

const findMoreThenOne = async (req, res) => {
  const { start, limit } = req.query;

  try {
    const client = new MongoClient('mongodb://localhost:27017', {
      useUnifiedTopology: true,
    });

    await client.connect();
    console.log('connected!');
    const db = await client.db('ex-2');
    const findings = await db.collection('two').find().toArray();
    console.log('findings',findings.length)
    if(findings.length){
      let response = [];
      if (start && limit) {
        response = findings.slice(start, parseInt(start) + parseInt(limit <= 25 ? limit : 25));
      } else if (start) {
        response = findings.slice(start, parseInt(start) + 25);
      } else if (limit) {
        response = findings.slice(0, limit <= 25 ? limit : 25)
      } else {
        response = findings.slice(0,25)
      }
      // console.log('limit',limit.length)
      if(!response.length) response = 'out of range...'
      console.log('response',response.length)
      res.status(200).json({ status: 200, start: start || '0', limit: response.length, data: response})
      console.log('yes');
    } else {
      res.status(404).json({status: 404, data: 'Nothing was found'})
    }
    client.close();
    console.log('disconnected!');
  } catch (err) {
    res.status(500).json({status: 500, err})
  }
}

const deleteGreeting = async (req, res) => {
  const {_id} = req.params;
  try {
    const client = new MongoClient('mongodb://localhost:27017', {
      useUnifiedTopology: true,
    });
    await client.connect();
    console.log('connected!');
    const db = await client.db('ex-2');
    const assertR = await db.collection('two').deleteOne({_id})
    assert.equal(1, assertR.deletedCount)

    const finding = await db.collection('two').find().toArray();
    console.log('yes');
    console.log('finding',finding.length)
    finding.length
        ? res.status(204).json({ status: 200, data: ('new Length',finding.length) }) /* there is no return to a status===204 */
        : res.status(404).json({ status: 404, data: 'Not Found' })
    client.close();
    console.log('disconnected!');

  } catch (err) {
    res.status(500).json({status: 500, err})
  }
}

const updateGreeting = async (req,res) => {
  const { _id } = req.params;
  const checkingKeys = Object.keys(req.body)
  if(checkingKeys.length===1 && checkingKeys[0]==='hello'){
    const updateInfo = { $set: {...req.body} };
    console.log('updateInfo',updateInfo)
    try {
      const client = new MongoClient('mongodb://localhost:27017', {
        useUnifiedTopology: true,
      });
      await client.connect();

      const db = await client.db('ex-2');

      // if _id.length is more then 2 then it is the name of the language, so we capitalize it and look for it
      const r =  _id.length===2 
        ? await db.collection('two').updateOne({_id}, updateInfo)
        : await db.collection('two').updateOne({"lang": _id.charAt(0).toUpperCase() + _id.slice(1)}, updateInfo)
      console.log('yes');
      // findOne = {...updateOne, ...updateInfo}
      // console.log('findOne2',updateOne)
      assert.equal(1, r.matchedCount)
      assert.equal(1, r.modifiedCount)
      res.status(204).json({status:200, ...req.body})/* there is no return to a status===204 */
    } catch (err) {
      res.status(500).json({status: 500, err})
    }
  } else {
    console.log('no');
    res.status(400).json({status: 400, message: "body doesn\'t match the form :{'hello': <NEW_DATA>}"})
  }

}

module.exports = {
  getCollection,
  createGreeting,
  batchImport,
  getGreeting,
  findMoreThenOne,
  deleteGreeting,
  updateGreeting,
}