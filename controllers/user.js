const User = require('../models/users');
const bcrypt = require('bcrypt');

function isstringinvalid(string){
    if(string == undefined || string.length === 0){
        return true;
    }
    else{
        return false;
    }
}
exports.signUp = async (req,res,next) => {
    try{
        const { name, email, password } = req.body;
        console.log('email', email);
        if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err: 'Parameters are missing'});
        }
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            console.log(err);
            await User.create({ name, email, password: hash });
            res.status(201).json({message: "user created successfully"});
        })
    }
    catch(err) {
        res.status(500).json(err); 
    }
};

exports.logIn = async (req,res,next) => {
    try{
        const {email,password} = req.body;
       if(isstringinvalid(email) || isstringinvalid(password))
       {
        return res.status(400).json({
            message: "Email or Password is missing",
            success: false
        })
       }
        console.log(password);
       const user = await User.findAll({where: { email }});
       if(user.length > 0){
        bcrypt.compare(password, user[0].password, (err,result) => {
            if(err)
            {
                throw new Error('Something went wrong');
            }
            if(result == true)
            {
                res.status(200).json({success: true, message: 'User logged in Successfully'})
            }
            else{
                return res.status(400).json({success: false, message: "Password is incorrect"});
            }
        })
       }
       else{
        return res.status(404).json({success: false, message: "User Doesn't Exist"});
       }
    }
    catch(err) {
        res.status(500).json({
            message: err,
            success: false
        });
    }
};