const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9mm1y.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })



async function run() {
    try {

        const taskCollection = client.db('todoList').collection('task');

        app.post('/addTask', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        });

        app.get('/task', async (req, res) => {
            const email = req.query.email;

            const query = { email: email };
            const task = await taskCollection.find(query).toArray();
            res.send(task);
        });

        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;

            const task = { _id: ObjectId(id) };

            const products = await taskCollection.findOne(task);
            res.send(products);
        });


        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result)
        });

        app.put('/task/status/:id', async (req, res) => {
            const id = req.params.id;

            const filter = { _id: ObjectId(id) };
            const review = req.body;
            const option = { upsert: true };
            const taskUpdate = {
                $set: {
                    comment: review.comment,
                    status: 'complete'
                }
            }
            const result = await taskCollection.updateOne(filter, taskUpdate, option);
            res.send(result);
        });

        app.put('/task/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const review = req.body;
            const option = { upsert: true };
            const taskUpdate = {
                $set: {
                    note: review.note,
                    image: review.image,
                    taskDate: review.taskDate,
                    status: review.status,
                    email: review.email,
                }
            }
            const result = await taskCollection.updateOne(filter, taskUpdate, option)
            res.send(result);
        });

        app.get('/taskComplete', async (req, res) => {
            const email = req.query.email;

            const query = { email: email };
            const task = await taskCollection.find(query).toArray();
            const filteredTask = [];
            for (let i = 0; i < task.length; i++) {
                const element = task[i];
                if (element.status === 'complete') {
                    filteredTask.push(element);
                }

            }

            res.send(filteredTask);
        });



    }
    finally {

    }
}
run().catch(console.log());













app.get('/', async (req, res) => {
    res.send('todo-list server is running')
})
app.listen(port, () => console.log(`bike pickers running On: ${port}`))