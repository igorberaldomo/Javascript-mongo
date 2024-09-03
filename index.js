const { MongoClient } = require('mongodb');

async function run() {
  var client
  try {
    dotenv = require('dotenv').config()
    MongoDBurl = process.env.MongoDBurl
    randomuserurl = 'https://randomuser.me/api/?results=5&inc=name,email,dob,id'
    const response = await fetch(randomuserurl)
    const data = await response.json()
    client = new MongoClient(MongoDBurl);
    await client.connect();
    const db = client.db("random");
    const collection = db.collection("people");
    await collection.insertMany(data["results"]);
  } finally {
    await client.close();
  }
}
run();