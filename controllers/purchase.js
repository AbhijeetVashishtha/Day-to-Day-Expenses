const Order = require('../models/orders');
const Razorpay = require('razorpay');
const userController = require('./user');

require('dotenv').config()


exports.purchasePremium = async(req,res,next) => {
    try{
        var rzp = new Razorpay({
            key_id: 'rzp_test_tlGKe3zEaHlVoA',
            key_secret: 'nC8tC0vNWwNowCbS5oyYH1ja'
        });
        const amount = 2500;

        rzp.orders.create({amount, currency: 'INR'}, (err, order) => {
            if(err){
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({orderid: order.id, status: 'PENDING'}).then(() => {
                res.status(200).json({order, key_id: rzp.key_id});
            })
            .catch(err => {
                throw new Error(err);
            })
        })
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message: 'Something went wrong', error: err});
    }
};

exports.updateTransactionStatus = async (req,res,next) => {
    try{
        const userId = req.user.id;
        const {payment_id, order_id} = req.body;
        const order = await Order.findOne({where: {orderid: order_id}});
        const promise1 = order.update({paymentid: payment_id, status: 'SUCCESSFUL'});
        const promise2 = req.user.update({ispremiumuser: true});

        Promise.all([promise1, promise2]).then(()=> {
            return res.status(201).json({success: true, message: "Transaction Successful", token: userController.generateAccessToken(userId,undefined , true) });
        }).catch((error) => {
            console.log(error);
            throw new Error(error);
        })
    }
    catch(err){
        console.log(err);
        res.status(403).json({error: err, message: 'something went wrong'});
    }
}