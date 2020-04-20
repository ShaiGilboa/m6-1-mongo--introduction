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
    console.log('_id',_id)
    const db = await client.db('ex-2')

    // db.collection('two').findOne(_id, (err, result) => {
    //   console.log('result',result)
    //   result
    //     ? res.status(200).json({ status: 200, _id, result})
    //     : res.status(404).json({ status: 404, _id, result: 'not found'})
    // })

    const findOne = await db.collection('two').findOne({_id})
    console.log('findOne',findOne)
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
    // console.log('r',r)
    // assert.equal(1, r.insertedCount);
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
  // try {
  // const {dbname, collection} = req.params;
  // const client = new MongoClient('mongodb://localhost:27017', {
  //   useUnifiedTopology: true,
  // });

  // await client.connect();
  // console.log('connected!');

  // const db = await client.db(dbname);
  // // console.log('db',db)
  // // console.log('req.params',req.params)
  // // console.log('db.collection(collection)',db.collection(collection))
  // // console.log('db.collection("one")',db.collection("one"))
  // db.collection(collection)
  //   .find()
  //   .toArray((err, data) => {
  //     // if (err) {
  //     //   res.status(500).json({status: 500, err})
  //     // } else {
  //     //   res.status(200).json({status: 200, data})
  //     // }
  //     console.log('data',data)
  //   });

  // client.close();
  // console.log('disconnected!');
  // } catch (err) {
  //   console.log('err',err)
  // }
    const { dbname, collection } = req.params;

  // create a new client
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db(dbname);
  console.log('dbname',dbname)
  console.log('collection',collection)
  // db.collection(collection)
  //   .find()
  //   .toArray((err, result) => {
  //     result.length
  //       ? res.status(200).json({ status: 200, data: result })
  //       : res.status(404).json({ status: 404, data: 'Not Found' });
  //   });
  const finding = await db.collection(collection).find().toArray();
    // const findings2 = await finding;
    // console.log('finding',finding)
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
    // db.collection('greetings')
    //   .find()
    //   .toArray((err, result) => {
    //   result.length
    //     ? res.status(200).json({ status: 200, data: result })
    //     : res.status(404).json({ status: 404, data: 'Not Found' });
    // });
    // res.status(201).json({ status: 201, data: req.body });
    const finding = await db.collection('two').find().toArray();
    // const findings2 = await finding;
    // console.log('finding',finding)
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
    console.log('_id',{_id})
    const db = await client.db('ex-2');
    const assertR = await db.collection('two').deleteOne({_id})
    assert.equal(1, assertR.deletedCount)

    const finding = await db.collection('two').find().toArray();
    console.log('yes');
    console.log('finding',finding.length)
    finding.length
        ? res.status(204) // there is no return to a status===204 .json({ status: 200, data: ('new Length',finding.length) })
        : res.status(404).json({ status: 404, data: 'Not Found' })
    client.close();
    console.log('disconnected!');

  } catch (err) {
    res.status(500).json({status: 500, err})
  }
}

module.exports = {
  getCollection,
  createGreeting,
  batchImport,
  getGreeting,
  findMoreThenOne,
  deleteGreeting,
}