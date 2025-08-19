const mongoose= require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: { 
    type: String, 
    required: true },

  email: 
  { type: String,
     required: true, 
     unique: true 
    },
  password: { 
    type: String,
     required: true,
     minlength: 8
  },

  role: { 
    type: String,
    required: true,
    enum: ['elder', 'caregiver', 'family_member', 'admin']
  },

   roleDetails: {
      elder: {
        dateOfBirth:{
        type: Date
        },    
        phone:{
        type: String
        },
        medicalConditions:{
        type:[String]
        },
        emergencyContactIds: {
        type: [ Schema.Types.ObjectId],
        ref: "user"
        },
        medications: {
            type: [String]
      },
    },
      caregiver: {
        certifications: {
            type: [String]
      },
        assignedElders:{
        type: [ Schema.Types.ObjectId],
        ref: "user"
        },
        phone: {
        type: String
        },
        availability:[{
            day:{
                type: String},
            startTime:{
                type: String 
            },
            endTime:{
                type: String 
            },
            
        }],
      
       matchCriteriaId:{
          type:  Schema.Types.ObjectId,
           ref: "MatchCriteria"
        },
      },
      family_member: {
        relationshipToElder:{
          type: String 
         } ,
        linkedElderIds: {
        type: [ Schema.Types.ObjectId],
        ref: "user"
        },
        phone: {
          type: String 
         } ,
        },
        admin: {
        permissions: {
          type:[String]
        },
       managedUsers:  {
        type: [ Schema.Types.ObjectId],
        ref: "user"
        },
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
  },
    passwordChangedAt: {
    type: Date,
    default: Date.now
  },
  },
},
  {timestamps: true}
);
//password hashed
userSchema.pre("save", async function(next){
    try{

        if(!this.isModified("password"))
        {
            return next();
        }
        this.password = await bcrypt.hash(this.password, 12);
        this.passwordConfirm = undefined;
    
}catch(err)
{
    console.log(err)
}
}
);

userSchema.methods.checkPassword = async function (
    candidatePassword,//entered by the user
     userPassword// hashed in the database
){
    return await bcrypt.compare(candidatePassword, userPassword);
    // compare returns true if both passwords are same
    // or false when they are not

};

userSchema.method.passwordChangedAftertokenIssued = function(JWTtimestamp){
   if(this.passwordChangedAt)//if changed then btfoot bl condition
    {
        const passwordChangedTime = parseInt(// change it to interger
this.passwordChangedAt.getTime()/1000, 10); 
return passwordChangedTime > JWTtimestamp;
}
return false;
};
module.exports = mongoose.model("User", userSchema);
