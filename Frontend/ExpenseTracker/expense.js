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

window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
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

function showError(err){
    document.body.innerHTML += `<div style="color:red;">${err}</div>`
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