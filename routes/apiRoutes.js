const router=require('express').Router();
const {register,verifyOTP}=require('../controllers/authentication');

router.route('/register').post(register);
router.route('/verifyOTP').post(verifyOTP);

module.exports=router;