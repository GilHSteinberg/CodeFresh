document.getElementById("submit").onclick = function (event){
  event.preventDefault();
  const formData = new FormData(document.querySelector("form"));

  const newData = {
    label : formData.get("name"),
  };
  console.log("fish");
  console.log(newData);

  axios
      .patch(`/api/containers`, newData)
      .then(processResults);
}

function processResults({ data }) {
  document.querySelector("form").reset();
  window.alert(`label updated to ${data.label}!`);
}
