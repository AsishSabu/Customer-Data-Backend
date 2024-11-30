const express=require("express");
const mongoose=require("mongoose");
const route = require("./routes/routes");
const cors = require('cors');
require('dotenv').config();

const app=express()
const PORT=process.env.PORT

const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));

app.use("/",route)

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected");
  } catch (error) {
    console.error("Couldn't connect");
    process.exit(1);
  }
};

connectDb().then(()=>{
  app.listen(PORT,()=>{
    console.log(`server listening on http://localhost:${PORT}`);
  })
})
