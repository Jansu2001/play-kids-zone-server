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
const uri = `mongodb+srv://${process.env.SECRET_USER}:${process.env.SECRET_PASS}@cluster0.ceweuof.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();

        const toysCollection = client.db('playKidsZone').collection('toys')
        const addToysCollection = client.db('playKidsZone').collection('addToys')


        // Backend Services Routes
        // app.get('/toys', async (req, res) => {
        //     const cursor = toysCollection.find()
        //     const result = await cursor.toArray()
        //     res.send(result)
        // })

        // Get all Added Data from mongodb
        app.get('/addtoys', async (req, res) => {
            // console.log(req.query.email);
            let query = {}
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await addToysCollection.find(query).toArray()
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
            // const options = {
            //     projection: { title: 1, price: 1, img: 1, date: 1 },
            // };
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



        // Get My toys by email
        // app.get('/addtoys', async (req, res) => {
        //     console.log(req.query.email);
        //     let query = {}
        //     if (req.query?.email) {
        //         query = { email: req.query.email }
        //     }
        //     const result = await addToysCollection.find(query).toArray()
        //     res.send(result)
        // })








        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
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