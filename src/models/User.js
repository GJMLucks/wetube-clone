import bcrypt from 'bcrypt';
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    avatarUrl: String,    
    email: { type: String, require: true, unique: true },
    socialOnly: { type: Boolean, default: false },
    username: { type: String, require: true, unique: true },
    password: { type: String, },
    name: { type: String, require: true },
    location: String,
});

userSchema.pre('save', async function() {
    this.password = await bcrypt.hash(this.password, 7);
    console.log('crupted password : ', this.password);
})

const User = mongoose.model('User', userSchema);

export default User;