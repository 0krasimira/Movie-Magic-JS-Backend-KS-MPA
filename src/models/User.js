const { Schema, model, MongooseError } = require("mongoose")

const bcrypt = require("bcrypt")
const {getErrorMessage} = require('../utils/errorUtils')


const userSchema = new Schema({
    email: {
        type: String, 
        required: true,
        lowerCase: true,
        unique: true,
        match: [/@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/, 'Invalid email address'],
        minLength: [10, 'Email should be at least 10 characters']
    },
    password: {
        type: String,
        match: [/^[a-zA-Z0-9]+$/, 'Password should be alphanumeric'],
        minLength: [6, 'Password should be at least 6 characters long'],
        required: true,
    }
})

userSchema.pre('save', async function() {

    const hash = await bcrypt.hash(this.password, 12)
    this.password = hash
   
    
})


userSchema.virtual('repeatPassword')
    .get(function() {
      return this._repeatPassword;
    })
    .set(function(value) {
        this._repeatPassword = value;
    });

userSchema.pre('validate', function(next) {
    if (this.password !== this._repeatPassword) {
        this.invalidate('passwordConfirmation', 'The passwords should be matching');
    }
    next();
});




const User = model("User", userSchema)

module.exports = User


