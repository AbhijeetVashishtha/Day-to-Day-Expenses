const token = localStorage.getItem('token');
function addExpense(event) {
    event.preventDefault();

    const expenseDetails = {
        expenseamount: event.target.expenseamount.value,
        description: event.target.description.value,
        category: event.target.category.value
    };
    console.log(expenseDetails);
    const token  = localStorage.getItem('token')
    axios.post('https://52.90.174.162:4000/expense/addexpense', expenseDetails, {headers: {"Authorization": token}})
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


window.addEventListener('DOMContentLoaded', async(event) => {
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token);
    console.log(decodeToken);
    const ispremiumuser = decodeToken.ispremiumuser;
    if(ispremiumuser){
        showPremiumUserMessage();
        showLeaderBoard();
    }
    let Items_Per_Page = +document.getElementById('Items_Per_Page')
    let page = 1;
    await axios.post(`https://52.90.174.162:4000/user/getexpense/${page}`,{Items_Per_Page: Items_Per_Page}, {headers: {"Authorization": token}})
    .then((response) => {
        if(response.status === 200){
        const listOfUsers = document.getElementById('ListOfExpenses')

        listOfUsers.innerHTML = '';
        for(let i=0;i<response.data.data.length;i++)
            {
                showExpenseOnScreen(response.data.data[i]);
            }
            showPagination(response.data.info);
        }
    })
    .catch(err => {
        showError(err);
    })
})

function download() {
    axios.get('https://52.90.174.162:4000/expense/download', {headers: {"Authorization": token}})
    .then((response) => {
        if(response.status === 200){
            var a = document.createElement('a');
            a.href = response.data.fileUrl;
            a.download = "myexpense.csv";
            a.click();
        }
        else{
            throw new Error(response.data.message);
        }
    })
    .catch(err => {
        console.log(err);
        showError(err);
    })
}

document.getElementById('rzp-button').onclick = async function(e) {
    const token = localStorage.getItem('token');
    const response = await axios.get('https://52.90.174.162:4000/purchase/premiummembership', {headers: {"Authorization": token}});
    console.log(response);
    var options = {
        'key': response.data.key_id,
        'order_id': response.data.order.id,
        'handler': async function(response){
            const res = await axios.post('https://52.90.174.162:4000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, {headers: {"Authorization": token}})
            localStorage.setItem('user', true);
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
        const userLeaderBoardArray = await axios.get('https://52.90.174.162:4000/premium/showLeaderBoard', {headers: {"Authorization": token} });
        console.log(userLeaderBoardArray);
        var leaderBoardElem = document.getElementById('LeaderBoard');
        leaderBoardElem.innerHTML += `<h1>Leader Board</h1>`;
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderBoardElem.innerHTML += `<li>Name- ${userDetails.name} Total Expense- ${userDetails.total_cost || 0}</li>`;
        });
    }
    document.getElementById('message').appendChild(inputElement);
}

function reportGenerate(event) {
    let usertype = localStorage.getItem('user');
    console.log(usertype == 'true');
    if(usertype == "true"){
        window.location.href = '../reports/reports.html';
    }
    else{
        document.body.innerHTML += `<div style="color:red;">"You are not a Premium User"</div>`
    }
}

function showExpenseOnScreen(expense) {
    const parentElement = document.getElementById('ListOfExpenses');
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `<li id=${expenseElemId}>${expense.expenseamount} - ${expense.description} - ${expense.category}
                            <button onclick='deleteExpense(${expense.id})'>Delete Expense</button>
                            </li>`
}

function showPagination({currentPage,hasNextPage,hasPreviousPage,nextPage,previousPage,lastPage}){
    let page = 1;
    const pagination= document.getElementById('pagination')
    

    pagination.innerHTML ='';

    if(hasPreviousPage){
        const button1 = document.createElement('button');
        button1.innerHTML = previousPage ;
        button1.addEventListener('click' , ()=>getPageExpenses(page, previousPage))
        pagination.appendChild(button1)
    }

    const button2 = document.createElement('button');
    button2.innerHTML = currentPage ;
    button2.addEventListener('click' , ()=>getPageExpenses(page, currentPage))
    pagination.appendChild(button2)

    if(hasNextPage){
        const button3 = document.createElement('button');
        button3.innerHTML = nextPage ;
        button3.addEventListener('click' , ()=>getPageExpenses(page, nextPage))
        pagination.appendChild(button3)
    }

    if( currentPage!==lastPage && nextPage!==lastPage){
        const button3 = document.createElement('button');
        button3.innerHTML = lastPage ;
        button3.addEventListener('click' , ()=>getPageExpenses(page, lastPage))
        pagination.appendChild(button3)
    }

}


async function getPageExpenses(page, limitper){
    const listOfUsers = document.getElementById('ListOfExpenses');
    let Items_Per_Page = limitper;
    
    const token = localStorage.getItem('token');
    const response = await axios.post(`https://52.90.174.162:4000/user/getexpense/${page}`,{Items_Per_Page: Items_Per_Page}, {headers : {"Authorization": token}});
    if(response.status === 200){
        listOfUsers.innerHTML = '';

        for(let i = 0;i < response.data.data.length; i++){
            showExpenseOnScreen(response.data.data[i]);
        }
        showPagination(response.data.info);
    }
}

function perPage(event){
    let page = 1;
    event.preventDefault();
    localStorage.setItem('itemsperpage', +event.target.Items_Per_Page.value);
    Items_Per_Page = localStorage.getItem('itemsperpage');
    getPageExpenses(page, +event.target.Items_Per_Page.value);
}

function deleteExpense(expenseId){
    const token  = localStorage.getItem('token')
    axios.delete(`https://52.90.174.162:4000/expense/deleteexpense/${expenseId}`, {headers: {"Authorization": token}})
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