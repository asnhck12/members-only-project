const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Message = require("../models/message");
const User = require("../models/user");

//Display messages etc
exports.message_list = asyncHandler(async (req, res, next) => {
    try {
        const allMessages = await Message.find().sort({ timeStamp: -1 }).populate('username').exec();
        res.render("message_board", { user: req.user, message_list: allMessages, admin: req.admin });
    } catch (err) {
        next(err);
    }
});

//Get message submission form
exports.message_create_get = (req, res, next) => {
    res.render("message_board", { user: req.user, errors: [], message_list: [] });
};

//Post new message
exports.message_create_post = [
    body("subject", "Please enter a subject more than 3 letters").trim().isLength({ min: 3 }).escape(),
    body("message", "Please enter a messagemore than 3 letters").trim().isLength({ min: 3 }).escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const message = new Message({
            subject: req.body.subject,
            message: req.body.message,
            date_formatted: new Date(),
            username: req.user,
        });

        if (!errors.isEmpty()) {
            const allMessages = await Message.find().sort({ timeStamp: -1 }).populate('username').exec();
            res.render("message_board", {
                user: req.user,
                message_list: allMessages,
                errors: errors.array(),
                message: message,
            });
            return;
        } else {
            await message.save();
            res.redirect("/");
        }
    })
];


//delete message post
exports.message_delete_post = asyncHandler(async (req,res, next) => {
    await Message.findByIdAndDelete(req.params.id);
    res.redirect("/");
})
