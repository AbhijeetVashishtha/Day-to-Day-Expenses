const Expense = require('../models/expense');
const S3Services = require('../services/s3service');
const UserServices = require('../services/userservice');
const DownloadURL = require('../models/downloadurls');

const downloadExpense =async (req,res) => {
    try{
        const expenses = await UserServices.getExpenses(req);
    // console.log(expenses);
    const stringifiedExpense = JSON.stringify(expenses);
    const userId = req.user.id;
    const fileName = `Expense${userId}/${new Date()}.txt`;
    const fileUrl = await S3Services.uploadToS3(stringifiedExpense, fileName);
    console.log(fileUrl);
    const downloadUrlData = req.user.createDownloadurl({
        fileUrl: fileUrl,
        fileName
    })
    res.status(200).json({fileUrl, downloadUrlData, success: true});
    }
    catch(err){
        console.log(err);
        res.status(500).json({fileUrl: '', success: false});
    }
 };

const addExpense = async (req,res) => {
    try{
        const {expenseamount, description, category} = req.body;

        if(expenseamount == undefined || expenseamount.length === 0)
        {
            return res.status(400).json({success: false, message: 'Parameters Missing'});
        }
        const data = await Expense.create({expenseamount, category,  description, userId: req.user.id});
        res.status(200).json({expense:data, success: true});
    }
    catch(err){
        console.log(err)
        res.status(500).json({success: false, error: err});
    }
};


const getExpense = async (req,res) => {
    // try{
    //     const data = await Expense.findAll({where: {userId: req.user.id}});
    //     res.status(200).json({expenses: data, success:true});
    // }
    // catch(err) {
    //     console.log(err);
    //     res.status(500).json({success: false, error: err});
    // }

    let page = req.params.pageNo || 1;
    let Items_Per_page = 5;
    let totalItems;
    
    try{
        let count = await Expense.count({where: {userId: req.user.id}});
        totalItems = count;

        let data = await req.user.getExpenses({offset: (page-1)*Items_Per_page, limit: Items_Per_page});
        res.status(200).json({
            data,
            info:{
                currentPage: page,
                hasNextPage: totalItems>page*Items_Per_page,
                hasPreviousPage: page>1,
                nextPage: +page + 1,
                previousPage: +page - 1,
                lastPage: Math.ceil(totalItems/Items_Per_page)
            }
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: err})
    }
};

const deleteExpense = async (req,res) => {
    const expenseid = req.params.expenseid;
   try{
        if(expenseid == undefined || expenseid.length === 0)
        {
            return res.status(404).json({message: "Expense not found", success: false});
        }
        const numberOfRows = await Expense.destroy({where: {id: expenseid, userId: req.user.id}});
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

const downloadAllUrl = async (req,res) => {
    try{
        let urls = await req.user.getDownloadurls();
        if(!urls){
            console.log('No urls found!!!');
            res.status(404).json({message: "no urls found with this user", success: false});
        }
        res.status(200).json({urls, success: true});
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

module.exports = {
    addExpense,
    getExpense,
    deleteExpense,
    downloadExpense,
    downloadAllUrl
}