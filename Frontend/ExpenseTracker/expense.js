function addExpense(event) {
    event.preventDefault();

    const expenseDetails = {
        expenseamount: event.target.expenseamount.value,
        description: event.target.description.value,
        category: event.target.category.value
    };
    console.log(expenseDetails);
    const token  = localStorage.getItem('token')
    axios.post('http://localhost:4000/expense/addexpense', expenseDetails, {headers: {"Authorization": token}})
    .then((response) => {
        showExpenseOnScreen(response.data.expense);
    })
    .catch(err => {
        showError(err);
    })
}

function showPremiumUserMessage(){
    document.getElementById('rzp-button').style.visibility = 'hidden';
    document.getElementById('message').innerHTML = "You are a Premium user.";
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token);
    console.log(decodeToken);
    const ispremiumuser = decodeToken.ispremiumuser;
    if(ispremiumuser){
        showPremiumUserMessage();
        showLeaderBoard();
    }
    axios.get('http://localhost:4000/expense/getexpenses', {headers: {"Authorization": token}})
    .then((response) => {
        response.data.expenses.forEach(expense => {
            showExpenseOnScreen(expense);
        });
    })
    .catch(err => {
        showError(err);
    })
})

document.getElementById('rzp-button').onclick = async function(e) {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:4000/purchase/premiummembership', {headers: {"Authorization": token}});
    console.log(response);
    var options = {
        'key': response.data.key_id,
        'order_id': response.data.order.id,
        'handler': async function(response){
            const res = await axios.post('http://localhost:4000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, {headers: {"Authorization": token}})
            alert('you are a premium user now');
            document.getElementById('rzp-button').style.visibility = 'hidden';
            document.getElementById('message').innerHTML = "You are a Premium user.";
            localStorage.setItem('token', res.data.token);
            showLeaderBoard();
        }
    }
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment failed', function(response){
        console.log(response);
        alert('Something went wrong');
    });
}

function showError(err){
    document.body.innerHTML += `<div style="color:red;">${err}</div>`
}

function showLeaderBoard() {
    const inputElement = document.createElement('input');
    inputElement.type = "button";
    inputElement.value = "Show LeaderBoard";
    inputElement.onclick = async() => {
        const token = localStorage.getItem('token');
        const userLeaderBoardArray = await axios.get('http://localhost:4000/premium/showLeaderBoard', {headers: {"Authorization": token} });
        console.log(userLeaderBoardArray);
        var leaderBoardElem = document.getElementById('LeaderBoard');
        leaderBoardElem.innerHTML += `<h1>Leader Board</h1>`;
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderBoardElem.innerHTML += `<li>Name- ${userDetails.name} Total Expense- ${userDetails.total_cost || 0}</li>`;
        });
    }
    document.getElementById('message').appendChild(inputElement);
}

function showExpenseOnScreen(expense) {
    const parentElement = document.getElementById('ListOfExpenses');
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `<li id=${expenseElemId}>${expense.expenseamount} - ${expense.description} - ${expense.category}
                            <button onclick='deleteExpense(${expense.id})'>Delete Expense</button>
                            </li>`
}

function deleteExpense(expenseId){
    const token  = localStorage.getItem('token')
    axios.delete(`http://localhost:4000/expense/deleteexpense/${expenseId}`, {headers: {"Authorization": token}})
    .then(() => {
        removeExpenseFromScreen(expenseId);
    })
    .catch(err => {
        showError(err);
    })
};

function removeExpenseFromScreen(expenseId){
    const expenseElemId = `expense-${expenseId}`;
    document.getElementById(expenseElemId).remove();
}