

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
    req.requestTime = new Date().toISOString();
    next();
})




//2) ROUTE HANDLERS






//3)ROUTES
 app.use('/api/v1/tours',tourRouter)
 app.use('/api/v1/users',userRouter)
 app.all("*",(req,res,next)=>{
    res.status(404).json({
        status: 'Fail',
        message: `can't find ${req.originalUrl} on this server!`
    })
});



//4) START THE SERVER

module.exports=app