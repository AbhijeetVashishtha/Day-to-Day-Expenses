const token = localStorage.getItem('token');

const download = document.getElementById('download');

const listurl = document.getElementById('ListOfUrl');

let listno = 0;

window.addEventListener("DOMContentLoaded", async(event) => {
    event.preventDefault();
    try{
        let response = await axios.get("http://52.90.174.162:4000/expense/getAllUrl", {headers: {"Authorization": token}});
        if(response.status === 200){
            console.log(response);
            showUrls(response.data);
        }
    }
    catch(err) {
        console.log(err);
    }
});

function showUrls(data) {
    listurl.innerHTML = '';
    data.urls.forEach(url => {
        let child = `<li>
        <a href = "${url.fileUrl}">${listno + 1}. ${url.fileName.split('/')[1]}</a>
        </li>`

        listurl.innerHTML += child;

        listno++;
    });
}


document.getElementById('ListOfUrl').addEventListener('click', async(event) => {
    event.preventDefault();
    try{
        const response = await axios.get('http://52.90.174.162:4000/expense/download', {headers: {"Authorization": token}})
        if(response.status === 200){
            var a = document.createElement('a');
            a.href = response.data.fileUrl;
            a.download = "myexpense.csv";
            a.click();
        }
        else{
            throw new Error(response.data.message);
        }
    }
    catch(err){
        console.log(err);
    }
})