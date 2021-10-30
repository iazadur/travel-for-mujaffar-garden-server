const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json());

// DB_USER=gardenDB
// DB_PASS=p3Zi7fvfXtJMXtwc

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ddn3a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();

        const database = client.db("Garden");
        const ServicesCollection = database.collection("Services");
        const reviewsCollection = database.collection("reviews");
        const whyUsCollection = database.collection("whyUs");
        const OrderCollection = database.collection("Order");


        // Read service into service collection
        app.get('/services', async (req,res) => {
            const cursor = ServicesCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        })

        // Read booknow API 
        app.get('/bookNow/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await ServicesCollection.findOne(query);
            res.json(service);
        })


        // Insert Order into OrderCollection
        app.post('/addOrder', async (req, res) => {
            const newOrder = req.body;
            const result = await OrderCollection.insertOne(newOrder);
            res.json(result);
        });

        // Read My Order into Ordercollection
        app.get('/myOrders/:email', async (req,res) => {
            const email = req.params.email;
            const query = { email: email };
            const myOrders = await OrderCollection.find(query).toArray();
            res.json(myOrders);
        })
        // Read All Order into Ordercollection
        app.get('/orders', async (req,res) => {
            const cursor = OrderCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders);
        })

        // Read My Order into Ordercollection by order _Id
        app.get('/updateOrders/:id', async (req,res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const orderItems = await OrderCollection.findOne(query)
            res.send(orderItems);
        })

         // Read My Order into Ordercollection by order _Id
        app.put('/updateOrder/:id', async (req, res) => {
            const id = req.params.id;
            const orderUpdate = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    address: orderUpdate.address,
                    email: orderUpdate.email,
                    name: orderUpdate.name,
                    phone: orderUpdate.phone,
                    status: orderUpdate.status,
                    fromDate: orderUpdate.fromDate,
                    toDate: orderUpdate.toDate,
                },
            };
            const result = await OrderCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            console.log('updating', result)
            res.json(result)
        })

        // Delete Order into Ordercollection
        app.delete("/orders/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await OrderCollection.deleteOne({
              _id: ObjectId(req.params.id),
            });
            res.send(result);
          });

        // Insert Service into serviceCollection
        app.post('/addService', async (req, res) => {
            const newService = req.body;
            const result = await ServicesCollection.insertOne(newService);
            res.json(result);
        });


        // Insert Service into WhyUsCollection
        app.post('/addwhyUs', async (req, res) => {
            const newWhyUs = req.body;
            console.log(newWhyUs);
            const result = await whyUsCollection.insertOne(newWhyUs);
            res.json(result);
        });

        // UPDATE API 
       

    }

    finally {
        //   await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send({ 'hellow world': "hello" })
})
app.listen(port, () => {
    console.log('listening with localhost:', port);
})