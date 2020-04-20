const { MongoClient } = require('mongodb');

const dbFunction = async (dbName) => {
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });

  await client.connect();
  console.log('connected!');

  const db = client.db(dbName);


  client.close();
  console.log('disconnected!');
  
}

dbFunction('exercise_one');

const getCollection = async (req, res) => {
  res.status(200).json({status: 200, connection: 'successful!' });
}