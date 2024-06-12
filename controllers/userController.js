const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user")
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Display log in form
exports.login_get = asyncHandler((req, res, next) => {
    const errorMessage = req.query.error ? 'Wrong username or password' : null;
    res.render("login", { user: req.user, errorMessage });
  });
  
// Log in Post
exports.log_in_post = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login?error=true');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  })(req, res, next);
};

//Get new user form
exports.sign_up_get = asyncHandler(async(req,res,next) => {
    res.render("sign_up", { user:req.user, errors:null});
});

//Post new user form
exports.sign_up_post = [
    body("firstname", "First Name should be entered").trim().isLength({ min:2 }).escape(),
    body("surname", "Surname should  be entered").trim().isLength({ min:2 }).escape(),
    body("username", "Please enter a Username").trim().isLength({ min:2 }).escape(),
    body("password", "Please enter a Password").isLength({ min:8 }).escape(),
    body("confirm_password", "Please confirm your Password").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    }),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.render("sign_up", {
            user: req.body,
            errors: errors.array(),
        });
        return;
    } 
    try {
        const userExists = await User.findOne({ username: req.body.username }).collation({ locale: "en", strength: 2}).exec();
        if (userExists) {
            res.render("sign_up", {
                user: req.body,
                errors: [{ msg: "Username already exists" }],
            });
            return;
        }
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        const user = new User({
            firstname: req.body.firstname,
            surname: req.body.surname,
            username: req.body.username,
            password: hashedPassword,
            membership: false,
            admin: false,
        });

        await user.save();
        res.redirect("/login");
    } catch (err) {
        return next(err);
    }
})
];

//display users membership status
exports.membership_update_get = asyncHandler(async (req, res, next) => {
    res.render("member_confirmation", { user: req.user })
})

//update users membership status
exports.membership_update_post = [
    body('password', 'Please enter your password').trim().isLength({ min: 8}).escape(),
    asyncHandler(async (req,res,next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.render('member_confirmation', {
            errors: errors.array(),
        });
        return
    }

    const pass = process.env.MEMBERSHIP_PASS;

    if (req.body.password !== pass) {
        res.render('member_confirmation', {
            errors: [{ msg: 'Invalid password'}],
        });
        return;
    }

    const user = await User.findById(req.user);
    user.membership = true;
    await user.save();

    res.redirect('/');


})]

//display users admin status
exports.admin_update_get = asyncHandler(async (req, res, next) => {
    res.render("admin_confirmation", { user: req.user })
})

//update users admin status
exports.admin_update_post = [
    body('password', 'Please enter your password').trim().isLength({ min: 8}).escape(),
    asyncHandler(async (req,res,next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.render('admin_confirmation', {
            errors: errors.array(),
        });
        return
    }

    const pass = process.env.ADMIN_PASS;

    if (req.body.password !== pass) {
        res.render('admin_confirmation', {
            errors: [{ msg: 'Invalid password'}],
        });
        return;
    }

    const user = await User.findById(req.user);
    user.admin = true;
    await user.save();

    res.redirect('/');
})]

exports.log_out = asyncHandler(async (req,res,next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    })
})