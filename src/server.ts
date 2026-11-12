import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient } from 'mongodb';

dotenv.config();
const app = express()
app.use(cors());
app.use(express.json())
const port = process.env.PORT

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined!")
}

const client = new MongoClient(uri);


export async function connectToMongoDB() {
  try {
    await client.connect();

    const db = client.db("mediqueue_ts");
    const tutorCollection = db.collection("tutors");

    app.post("/tutors", async (req, res) => {
      const tutorData = req.body;
      const result = await tutorCollection.insertOne(tutorData);
      res.json(result);
    })

    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

connectToMongoDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 