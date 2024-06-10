const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const app = express()
const port = 4000;
const userRouter = require('./routes/user.router')

app.use(cors({credentials:true, origin: ["http://localhost:3000"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(bodyParser.json()); 
app.use(userRouter);
dotenv.config();




mongoose.connect(process.env.DB_URI).then(() => {
    app.listen(port, () => {
      console.log(` Server listening at http://localhost:${port}`);
    });
    console.log("Connected to MongoDB and Server is running");
  })
  .catch((err) => {
    console.log(err);
  });

