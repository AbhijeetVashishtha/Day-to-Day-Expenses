const User = require('../models/users');

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

        if(isstringinvalid(name) || isstringinvalid(email || isstringinvalid(password))){
            return res.status(400).json({err: 'Parameters are missing'});
        }

        await User.create({ name, email, password});
        res.status(201).json({message: "user created successfully"});
    }
    catch(err) {
        res.status(500).json(err); 
    }
};