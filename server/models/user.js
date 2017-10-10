const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    UserSchema = new Schema({
    first_name: { type: String, required: [true, "Please enter a first name!"], minlength: [2, "First name must be at least 2 characters long!"] },
    last_name: { type: String, required: [true, "Please enter a last name!"], minlength: [2, "Last name must be at least 2 characters long!"] },
    email: { type: String, required: [true, "Please enter an email!"], index: { unique: true } },
    password: { type: String, required: [true, "Please enter a password!"], minlength: [8, "Password must be atleast 8 characters"] },
    birthday: { type: Date, required: [true, "Please enter a birthday!"] }
})

UserSchema.pre('save', function (next) {
    let self = this
    console.log(self)
    console.log(this)
    bcrypt.genSalt(10, (err, salt) => {
        console.log(salt)
        if(err) return next(err)
        bcrypt.hash(self.password, salt, (err, hash) => {
            console.log(hash)
            if(err){
                return next(err)
            }
            self.password = hash
            next()
        })
    })
    
})

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
const User = mongoose.model('User', UserSchema)
module.exports = User