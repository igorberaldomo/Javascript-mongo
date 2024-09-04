const { MongoClient } = require('mongodb');
var http = require('http');
const url = 'node /home/igor/Documents/Codigos/Stackx/Tarefas/Javascript+mongo/index.js'

async function addPeople() {
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
    content = await prepHtml(data["results"])
    await collection.drop()
  } finally {
    await client.close();
  }
  return content
}



async function prepHtml(docs) {
  content = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Randomuser API </title>
       <style>
        html {
            width: 100%;
        }
        body{
            background-color:linen;
            padding: 0px;
            margin: 0px;
        }
        #titulo{
        margin: auto;
        text-align: center;
        font-size: 36px;
        font-weight: bold;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        }
        #info{
            border-radius: 10px;
            margin: 30px auto;
            width: 800px;
            height: 120px;
            background-color: azure;
            box-shadow: 2px 2px 2px 0.5px rgba(0, 0, 0, 0.334);
        }
        #name, #email, #idade, #aniversário{
            margin: 5px;
        }
        #name{
            font-size: 24px;
            font-weight: bold;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        }
    </style>
      </head>
      <body>
          <div>
              <h1 id= 'titulo'>Randomisador de pessoas</h1>
              <div>
              ${docs.map((doc) => `<div id = 'info'>
                  <div>
                  <p id ='name'>${doc["name"]["first"]} ${doc["name"]["last"]}</p>
                  <p id ='email'>${doc["email"]}</p>
                  </div>
                  <div>
                  <p id ='idade'>${doc["dob"]["age"]} anos</p>
                  <p id ='aniversário'> nascido em ${doc["dob"]["date"].slice(0, 10)}</p>
                  <div>
              </div>
              `).join('')}
              </div>
          </div>
      </body>
      </html>
  `
  return content
}

function main() {

  http.createServer(async function (req, res) {
    content = addPeople()
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(await content);
  }).listen(8080)

}

main()