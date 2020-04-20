const { MongoClient } = require('mongodb');

const dbFunction = async (dbName) => {
  try {

  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });

  await client.connect();
  console.log('connected!');

  const db = client.db(dbName);

  await db.collection('one').insertOne({ name: 'Buck asdasdsdsd' });

  client.close();
  console.log('disconnected!');
  } catch (err) {
    console.log('err',err)
  }
  
}

dbFunction('exercise_one');
