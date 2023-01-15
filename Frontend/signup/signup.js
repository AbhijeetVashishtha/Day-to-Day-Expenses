async function signup(event){
    try{
        event.preventDefault();
        const name = event.target.name.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        const signUpDetails = {
            name,
            email,
            password
        }
        console.log(signUpDetails);
        const response = await axios.post("http://52.90.174.162:4000/user/signup", signUpDetails)
        if(response.status === 200){
            window.location.href = "../login/login.html";
        }
        else{

            throw new Error('Failed to Login');
        }
    }
    catch(err){
        document.body.innerHTML += `<div style = "color: red;">${err}</div>`
    }
}