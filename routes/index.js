const express = require('express');
const router = express.Router();

const user_controller = require("../controllers/userController")
const message_controller = require("../controllers/messageController")

/* GET home page. */
router.get('/login',user_controller.login_get);

router.post('/login',user_controller.log_in_post);

router.get('/',message_controller.message_list);

router.post('/',message_controller.message_create_post);

router.get("/member_confirmation", user_controller.membership_update_get);

router.post("/member_confirmation", user_controller.membership_update_post);

router.get("/admin_confirmation", user_controller.admin_update_get);

router.post("/admin_confirmation", user_controller.admin_update_post);

router.post("/delete/:id", message_controller.message_delete_post);

router.get('/signup',user_controller.sign_up_get);

router.post('/signup', user_controller.sign_up_post);

router.get('/log_out', user_controller.log_out);

module.exports = router;