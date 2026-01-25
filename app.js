

const express = require('express');

const morgan = require('morgan');


const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

console.log(process.env.NODE_ENV)

//1)MIDDLEWARES
if(process.env.NODE_ENV === 'development'){

app.use(morgan('dev'))
}


app.use(express.json())

app.use((req,res,next)=>{
    console.log("Hello from the middlewaree...")
    next()
})

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next();
})




//2) ROUTE HANDLERS






//3)ROUTES
 app.use('/api/v1/tours',tourRouter)
 app.use('/api/v1/users',userRouter)
app.get('/',(req,res)=>{
    res.status(200).send("hello from the server side!");
})


//4) START THE SERVER

module.exports=app