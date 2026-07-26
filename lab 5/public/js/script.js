let authorLinks = document.querySelectorAll("a");

for (let link of authorLinks) {
    link.addEventListener("click", getAuthorInfo);
}

async function getAuthorInfo() {
    var myModal = new bootstrap.Modal(document.getElementById('authorModal'));
    myModal.show();
    let url = `/api/author/${this.id}`;
    let response = await fetch(url);
    let data = await response.json();
    //console.log(data);
    let authorInfo = document.querySelector("#authorInfo");
    authorInfo.innerHTML = `<h1> ${data[0].firstName}
    ${data[0].lastName} </h1>`;
    authorInfo.innerHTML += `<img src="${data[0].portrait}"
    width="200"><br>`;
}