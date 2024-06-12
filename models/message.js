const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    subject: { type: String, required: true },
    message: { type: String, required: true },
    timeStamp: { type: Date, default: Date.now },
    username: { type: Schema.ObjectId, ref: "User" }
})

MessageSchema.virtual("url").get(function() {
    return "/" + this._id;
})

MessageSchema.virtual("date_formatted").get(function () {
    return DateTime.fromJSDate(this.timeStamp).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Message", MessageSchema);