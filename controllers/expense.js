const Expense = require('../models/expense');

exports.addExpense = async (req,res) => {
    try{
        const {expenseamount, description, category} = req.body;

        if(expenseamount == undefined || expenseamount.length === 0)
        {
            return res.status(400).json({success: false, message: 'Parameters Missing'});
        }

        const data = await Expense.create({expenseamount, description, category});
        res.status(201).json({expense:data, success: true});
    }
    catch(err){
        res.status(500).json({success: false, error: err});
    }
};


exports.getExpense = async (req,res) => {
    try{
        const data = await Expense.findAll();
        res.status(200).json({expenses: data, success:true});
    }
    catch(err) {
        res.status(500).json({success: false, error: err});
    }
};

exports.deleteExpense = async (req,res) => {
    const expenseid = req.params.expenseid;
   try{
        if(expenseid == undefined || expenseid.length === 0)
        {
            return res.status(404).json({message: "Expense not found", success: false});
        }
        const numberOfRows = await Expense.destroy({where: {id: expenseid}});
        if(numberOfRows === 0)
        {
            return res.status(400).json({success: false, message: "Expense Doesn't belong to the user"});
        }
        else{
            res.status(200).json({success: true, message: "Expense Deleted Successfully"});
        }
    }
    catch(err){
        return res.status(500).json({
            error: err,
            success: false,
            message: 'Failed to Delete'
        });
    }
};