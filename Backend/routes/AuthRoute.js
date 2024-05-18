const express = require("express");
const Authcontroller = require("../controllers/Authcontroller");

const router = express.Router();

router.post("/signup", Authcontroller.signup);
router.post("/signin", Authcontroller.signIn);

module.exports = router;
