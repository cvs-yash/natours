
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' });
const app = require('./app')


console.log('NODE_ENV from env:', process.env.NODE_ENV);
//console.log('DB = ', process.env.DATABASE);

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
     process.env.DATABASE_PASSWORD
    );


mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.log('DB ERROR:', err));







//console.log(process.env); 


const port =  process.env.PORT ||  3000;
app.listen(port,()=>{
console.log(`App running on the port ${port}...`)
})