const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();
const  cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;



//middelweare
app.use(cors());
app.use(express.json());

//mongo db connected

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9ncig.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

//async function run

async function run(){
    try{
        await client.connect()
        console.log('database connectied')
        const database = client.db('tourism_spot');
        const servicesCollection = database.collection('services');
        const usersCollection = database.collection('users');


      //post api user

        app.post('/users', async(req,res) =>{
          const newUser = req.body;
          const result = await usersCollection.insertOne(newUser)
          console.log('hitting the post',req.body);
          console.log('added user', result)
          res.json(result)
      })
      //post api services
        app.post('/services', async(req,res) =>{
          const newUsers = req.body;
          const result = await servicesCollection.insertOne(newUsers)
          console.log('hitting the post',req.body);
          console.log('added user', result)
          res.json(result)
      })

        //get api services
        
        app.get('/services', async(req, res) =>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray()
            res.send(services)
        });

        //get api users
        
        app.get('/users', async(req, res) =>{
            const cursor = usersCollection.find({});
            const users = await cursor.toArray()
            res.send(users)
        });

        //single api load
        app.get('/services/:id', async(req,res) =>{
          const id = req.params.id;
          console.log('getting spacice service', id);
          const query = {_id: ObjectId(id)};
          const service = await servicesCollection.findOne(query);
          res.json(service);
        });

        //delete api
        app.delete('/users/:id', async(req,res) =>{
          const id = req.params.id;
          const querys = {_id: ObjectId(id)};
          console.log('deleting user id', id);
          const remove = await usersCollection.deleteOne(querys);
          console.log('delete', remove);
          res.json(remove)
        })

    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})