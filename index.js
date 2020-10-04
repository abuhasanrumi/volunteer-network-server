const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 5000

const ObjectId = require('mongodb').ObjectId;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zubrj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db('volunteerNetwork').collection("eventCards");
  const registrationCollection = client.db('volunteerNetwork').collection("registration");
  const showRegistrationCollection = client.db('volunteerNetwork').collection("registration");
    // app.post('/events', (req, res) => {
    //   const events = req.body;
    //   eventCollection.insertMany(events)
    //   .then(result => {
    //     res.send(result.insertedCount)
    //   })
    // })

    app.post('/events', (req, res) => {
      const newEvent = req.body;
      
      eventCollection.insertOne(newEvent)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    })

    app.get('/events', (req, res) => {
      eventCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
    })

    app.post('/registeredUsers', (req, res) => {
      const newRegister = req.body;
      registrationCollection.insertOne(newRegister)
      .then(result => {
        console.log(result)
      })
    })

    app.get('/registeredUsers', (req, res) => {
      registrationCollection.find({email: req.query.email})
      .toArray((err, documents) => {
        res.send(documents)
      })
    })

    app.get('/showRegisteredUsers', (req, res) => {
      showRegistrationCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
    })

    app.delete('/delete/:id', (req, res) => {
      registrationCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
        res.send({
          user: 'deleted'
        })
      })
    })



  });


app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})