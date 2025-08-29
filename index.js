const express = require('express');
const port= 4000;
const mongoose = require('mongoose');

const url='mongodb+srv://SagorAhmed:987654321@cluster0.1kwqnex.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0';
        





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