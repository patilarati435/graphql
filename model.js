const mongoose = require('mongoose');
const dataSchema=new mongoose.Schema(
    {
        username:{
            type:String
        },
        email:{
            type:String
        },
        password:{
            type:String   
        }
    }
)
const DataSchema = mongoose.model('user', dataSchema);

module.exports = DataSchema;
