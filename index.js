const express = require('express');
const port= 4000;
const mongoose = require('mongoose');
require('dotenv').config();
const url=process.env.MONGODB_URL||'mongodb://localhost:27017/e-commerce';
        





const app = express();

// default middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/', require('./src/schema'));

// here is the blogs 




app.get('/',(req,res)=>{
    res.send('welcome  server')

})






// database connection


const db= async ()=>{
   await mongoose.connect(url)
    .then(() => console.log(`Database connected successfully ${mongoose.connection.host}`))
    .catch(err => console.error('Database connection error:', err));

}

app.listen(port,async()=>{
    await db()
    console.log(`Server is running on port ${port}`);
})