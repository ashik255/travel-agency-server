const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');

const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 7000;
// const pass = process.env.DB_PASS;
// console.log(pass);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o13hs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('Travel-Agency')
        const dataCollection = database.collection('data');
        const DataCollection = database.collection('HotelData');
        const UserCollection = database.collection('users');
        console.log('database connect');

        //Post APi
        app.post('/users',async(req,res)=>{
            const newUser = req.body;
            const result = await UserCollection.insertOne(newUser);
            console.log('hitting the post',req.body)
            console.log("hit",result)
            res.json(result);
        })
        ///
        app.get('/users', async (req, res) => {
            // console.log(req.query);
            const curser = UserCollection.find({});
            const data = await curser.toArray();
            res.send(data);
        })

        // Get Api
        app.get('/data', async (req, res) => {
            // console.log(req.query);
            const curser = dataCollection.find({});
            const data = await curser.toArray();
            res.send(data);
        })
        app.get('/HotelData', async (req, res) => {
            // console.log(req.query);
            const curser = DataCollection.find({});
            const data = await curser.toArray();
            res.send(data);
        })
        //Delete Api
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: id};
            console.log('okay',query)
            const result = await UserCollection.deleteOne(query);
            res.json(result.deletedCount>0);
            console.log(result)

        })
    }
    finally {
        //    await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
