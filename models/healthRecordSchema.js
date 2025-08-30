const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const healthRecordSchema = new Schema({
    
//   HealthRecordId: {
//     type: Schema.Types.ObjectId,
//     ref: "user"
// },
    elderId:  {
    type: Schema.Types.ObjectId,
    ref: "user"
},
    caregiverId:  {
    type: Schema.Types.ObjectId,
    ref: "user"
},
    date:{
        type: Date,
        default: Date.now
    },
    vitalSigns: {
      bloodPressure:{
        type: String
    },
      heartRate:{
        type: Number
      },
    },
    medicationTaken:[{
        type: String
}] ,
    notes: {
        type: String
    },
    createdAt: 
   {
    type: Date,
    default: Date.now
  },
    updatedAt: 
     {
    type: Date,
    default: Date.now
  },},
{timestamps:true}
 );
 module.exports=mongoose.model('HealthRecord', healthRecordSchema);