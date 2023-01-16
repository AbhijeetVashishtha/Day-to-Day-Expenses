function forgotpassword(event) {
        event.preventDefault();
        const userDetails = {
            email: event.target.email.value
        }
        console.log(userDetails);
        axios.post('https://52.90.174.162:4000/password/forgotpassword', userDetails)
        .then((response) => {
            if(response.status === 202){
                document.body.innerHTML += `<div style = "color:red;">Mail Successfully Sent</div>`;
            }
            else{
                throw new Error("SomeThing Went wrong!!!");
            }
        })
        .catch(err => {
            document.body.innerHTML += `<div style="color:red;">${err}</div>`
        })

}