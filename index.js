const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// MiddleWare

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0viwxwm.mongodb.net/?retryWrites=true&w=majority`;


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

        // Get the database and collection on which to run the operation
        const coffeCollection = client.db('coffeeDB').collection('coffee');

        app.get('/coffees', async (req, res) => {
            const cursor = coffeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;
            const result = await coffeCollection.insertOne(newCoffee);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Cofee making server is running')
})

app.listen(port, () => {
    console.log(`Coffee house is running on port: ${port}`);
})

