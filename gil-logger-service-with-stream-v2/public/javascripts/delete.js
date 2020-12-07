document.getElementById("delete").onclick = function(){
  const value = document.getElementById("dockerId").value;
  if(value === "") {
    window.alert("No item selected");
  }
  else {
    axios.delete(`/api/containers/${value}`)
        .then(processResult)
        .catch((err) => {if(err.response.status === 404) {
          notFound();
        }})
  }
};

function processResult() {
  window.alert("Container deleted!");
}

function notFound() {
  window.alert("Container not found, can't delete");
}
