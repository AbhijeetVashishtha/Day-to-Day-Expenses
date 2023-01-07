function addExpense(event) {
    event.preventDefault();

    const expenseDetails = {
        expenseamount: event.target.expenseamount.value,
        description: event.target.description.value,
        category: event.target.category.value
    };
    console.log(expenseDetails);
    axios.post('http://localhost:4000/expense/addexpense', expenseDetails)
    .then((response) => {
        showExpenseOnScreen(response.data.expense);
    })
    .catch(err => {
        showError(err);
    })
}

window.addEventListener('DOMContentLoaded', () => {
    axios.get('http://localhost:4000/expense/getexpenses')
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
    axios.delete(`http://localhost:4000/expense/deleteexpense/${expenseId}`)
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