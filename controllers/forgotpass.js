const sgMail = require('@sendgrid/mail');
// UUID is a great way of hide sequential database IDs. UUID is Universal Unique Identifier. UUIDs are unique 
// 128-bit values popularly used to uniquely identify entities on the internet
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const User = require('../models/users');
const Forgotpassword = require('../models/forgotpassword');


exports.forgotPassword = async (req,res,next) => {
    try{
        const {email}  = req.body;
        const user = await User.findOne({where: {email }});
        if(user) {
            const id = uuid.v4();
            user.createForgotpassword({id , active: true})
            .catch((err) => {
                console.log(err);
                throw new Error(err);
            })
            sgMail.setApiKey(process.env.SENGRID_API_KEY);
            const msg = {
                to: email,
                from: 'abhijeetvashishth13@gmail.com',
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href="http://localhost:4000/password/resetpassword/${id}">Reset password</a>`
            }

            sgMail.send(msg)
            .then((response) => {
                return res.status(response[0].statusCode).json({message: "Link to Reset password sent to your mail", success: true})
            })
            .catch((error) => {
                console.log(error);
                throw new Error(error);
            })
        }
        else
        {
            throw new Error('user doesnot exist');
        }
    }
    catch(err){
        console.error(err);
        return res.json({message: err, success: false});
    }
};

exports.resetPassword = (req,res,next) => {
    const id = req.params.id;
    Forgotpassword.findOne({where: {id}})
    .then((forgotPasswordrequest) => {
        if(forgotPasswordrequest){
            forgotPasswordrequest.update({active: false}),
            res.status(200).send(`<html>
            <script>
                function formsubmitted(e){
                    e.preventDefault();
                    console.log('called')
                }
            </script>
            <form action="/password/updatepassword/${id}" method="get">
                <label for="newpassword">Enter New password</label>
                <input name="newpassword" type="password" required></input>
                <button>reset password</button>
            </form>
        </html>`);
        res.end();
        }
    });
};

exports.updatePassword = (req,res,next) => {
    try{
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({err, success:false});
    }
}


  