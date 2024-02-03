// Not in use but still here
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/login-sign-up').then(()=>{
   console.log("mongodb connected"); 
})
.catch(()=>{
    console.log('Connection failed!');
})



const loginSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

})


const collection = new mongoose.model("collection1",loginSchema);


module.exports = collection;

