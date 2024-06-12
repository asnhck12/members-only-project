const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    firstname: { type: String, required: true },
    surname: { type: String, required: true },
    password: { type: String, required: true },
    membership: { type: Boolean },
    admin: { type: Boolean },
})

module.exports = mongoose.model("User", UserSchema);