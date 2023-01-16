async function login(event){
    try{
        event.preventDefault();
        const loginDetails = {
            email: event.target.email.value,
            password: event.target.password.value
        }
        console.log(loginDetails);
        const response = await axios.post("https://52.90.174.162:4000/user/login", loginDetails);
        alert(response.data.message);
        console.log(response.data);
        localStorage.setItem('token', response.data.token);
        window.location.href = "../ExpenseTracker/expense.html"
    }
    catch(err){
        console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style="color:red;">${err.message} <div>`;
    }
}