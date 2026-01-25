const mongoose = require('mongoose')
const dotenv = require('dotenv')



const app = require('./app')

dotenv.config({ path: './config.env' });


//console.log('DB = ', process.env.DATABASE);

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
     process.env.DATABASE_PASSWORD
    );


mongoose
  .connect(DB, { 
      useNewUrlParser: true, 
      useCreateIndex: true ,
      useFindAndModify: false
    })
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.log('DB ERROR:', err));







//console.log(process.env); 


const port =  process.env.PORT ||  3000;
app.listen(port,()=>{
console.log(`App running on the port ${port}...`)
})