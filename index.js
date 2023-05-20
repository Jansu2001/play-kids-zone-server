const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;


// Midleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send(`Car Doctor is Running on Port: ${port}`)
})


// MONGODB START
var uri = `mongodb://${process.env.SECRET_USER}:${process.env.SECRET_PASS}@ac-hbq0lk7-shard-00-00.ceweuof.mongodb.net:27017,ac-hbq0lk7-shard-00-01.ceweuof.mongodb.net:27017,ac-hbq0lk7-shard-00-02.ceweuof.mongodb.net:27017/?ssl=true&replicaSet=atlas-3rqprv-shard-0&authSource=admin&retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${process.env.SECRET_USER}:${process.env.SECRET_PASS}@cluster0.ceweuof.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const toysCollection = client.db('playKidsZone').collection('toys')
        const addToysCollection = client.db('playKidsZone').collection('addToys')


        // Shop By Categories Tabs Backend Routes
        app.get('/toys/:text', async (req, res) => {
            if(req.params.text=="Avengers" || req.params.text=="Star wars" ||req.params.text=="transformers" ){
                const result =await addToysCollection.find({categoryName: req.params.text}).toArray()
               return res.send(result)
            }
        })


        // Creating index for search 
        // const indexkeys={toyname:1,subCategory:1}
        // const indexOptions={name:"toynamesubCategory"}
        // const result= await addToysCollection.createIndex(indexkeys,indexOptions);
        // res.send(result)


        // Search by Toys name Using Index Backend Route
        app.get('/searchtoys/:text', async (req,res)=>{
            const searchToys=req.params.text
            const result =await addToysCollection.find({
                toyname:searchToys
            }).toArray()
            res.send(result)
        })



        // Get all Added Data from mongodb
        app.get('/addtoys', async (req, res) => {
            // console.log(req.query.email);
            let query = {}
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await addToysCollection.find(query).limit(20).toArray()
            res.send(result)
        })


        // Add Toys Data to mongodb from frontend
        app.post('/addtoys', async (req, res) => {
            const addtoys = req.body;
            console.log(addtoys);
            const result = await addToysCollection.insertOne(addtoys)
            res.send(result)
        })


        // Get Data By Using ID
        app.get('/addtoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await addToysCollection.findOne(query)
            res.send(result)
        })

        // Update TOys By Using ID
        app.put('/addtoys/:id', async (req, res) => {
            const id = req.params.id
            const updatedToys = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateToys = {
                $set: {
                    price: updatedToys.price,
                    quantity: updatedToys.quantity,
                    description: updatedToys.description
                }
            };
            const result = await addToysCollection.updateOne(filter, updateToys, options)
            console.log(result);
            res.send(result)
        })


        // DELETE DATA
        app.delete('/addtoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await addToysCollection.deleteOne(query)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);








app.listen(port, () => {
    console.log(`Play Kids Zone Server is Running on Port: ${port}`);
})