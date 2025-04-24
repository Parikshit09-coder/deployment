const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
});

UserSchema.pre('save', async function (next) {
  const user = this;


  if (!user.isModified('password') && !user.isNew) return next();

  try {
    // Ensure password is a valid string
    if (typeof user.password !== 'string') {
      throw new Error('Password must be a string');
    }


    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;

    next(); // Proceed to save
  } catch (err) {
    next(err); 
  }
});

UserSchema.methods.isValidPassword = async function (password){
        return await bcrypt.compare(password,this.password);
}

module.exports = mongoose.model('User',UserSchema);

