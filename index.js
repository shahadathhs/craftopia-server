const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.CDB_USER}:${process.env.CDB_PASS}@cluster0.ahaugjj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Get the database and collection on which to run the operation
const userCraftCollection = client.db("userCraftDB").collection("userCraft");


//userCraft related api
app.get('/userCraft', async(req, res) => { 
  const cursor = userCraftCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})

app.get('/userCraft/:id', async(req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id)}
  const result = await userCraftCollection.findOne(query);
  res.send(result)
})

app.post('/userCraft', async(req, res) =>{
  // Create a document to insert
  const newCraft = req.body;
  //console.log(newCraft);
  // Insert the defined document into the "userAddCraft" collection
  const result = await userCraftCollection.insertOne(newCraft);
  // send inserted data to database
  res.send(result);
})

app.put('/userCraft/:id', async(req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id)}
  const options = { upsert: true };
  const craft = req.body;
  const updatedCraft = {
    $set: {
      customization: craft.customization,
      description: craft.description, 
      itemName: craft.itemName,
      photo: craft.photo,
      prize: craft.prize,
      processingTime: craft.processingTime,
      rating: craft.rating,
      stockStatus: craft.stockStatus,
      subCategory: craft.subCategory
    }
  };
  const result = await userCraftCollection.updateOne(filter, updatedCraft, options);
  res.send(result);
  console.log("craft updated", updatedCraft)
})

app.delete('/userCraft/:id', async(req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id)}
  const result = await userCraftCollection.deleteOne(query);
  res.send(result);
})

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Craftopia Server- Home Page!')
})

app.listen(port, () => {
  console.log(`CRAFTOPIA is listening on port ${port}`)
})