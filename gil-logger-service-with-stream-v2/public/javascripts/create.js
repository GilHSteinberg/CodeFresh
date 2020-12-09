document.getElementById("submit").onclick = function (event){
  event.preventDefault();

  const form = document.querySelector("form");

  const isValid = form.checkValidity();

  if(!isValid) {
    let err = {
      data: [{
        field: "name",
        message: "You must enter a name"
      }]
    }
    handleErrors(err);
    return;
  }

  const formData = new FormData(form);
  axios
      .post("/api/containers", {
        name : formData.get("name"),
        dockerId : formData.get("dockerId"),
        dockerIp : formData.get("dockerIp"),
        dockerPort : formData.get("dockerPort"),
        logger :  formData.get("dockerPort"),
        dockerLabel :  formData.get("dockerLabel"),
      })
      .then(processResults)
      .catch(handleErrors);
}
function processResults({ data }) {
  document.querySelector("form").reset();
  window.alert(`${data.name} added with id: ${data.dockerId}`);
}

function handleErrors({response}){
  const errorElements = document.getElementsByClassName("error");

  for (let i = 0; i < errorElements.length; ++i)
  {
    errorElements[i].textContent = "";
  }

  const errors = response.data;
  for( let i = 0 ; i < errors.length ; ++i)
  {
    const {field, message} = errors[i];
    const element = document.getElementsByName(field)[0].nextElementSibling;
    element.textContent = message;
  }
  window.alert("an error occured");
}

document.getElementById("loadEx").onclick = function (event){
  event.preventDefault();

    document.getElementsByName("name")[0].value = "con1";
    document.getElementsByName("dockerId")[0].value = "1ba77da95f59";
    document.getElementsByName("dockerIp")[0].value = "0.0.0.0";
    document.getElementsByName("dockerPort")[0].value = 8888;
    document.getElementsByName("dockerLabel")[0].value = "mylabel:con3";
  
}
