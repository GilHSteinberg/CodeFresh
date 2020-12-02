let currentContainer= null;

document.getElementById("load").onclick = function () {
  const dockerId = document.getElementById("dockerId").value;

  axios.get(`/api/containers/${dockerId}`).then(({ data }) => {
    currentContainer= data;
    loadContainer(data);
  });
};

document.getElementById("submit").onclick = function (event){
  event.preventDefault();
  const formData = new FormData(document.querySelector("form"));

  const newData = {
    name : formData.get("name"),
    dockerId : formData.get("dockerId"),
    dockerIp : formData.get("dockerIp"),
    dockerPort : formData.get("dockerPort"),
  };

  const updatedFields = _.omitBy(newData, function (v, k){
    return (k === "dockerId" || currentContainer[k] == v);
  });
  axios
      .patch(`/api/containers/${currentContainer.dockerId}`, updatedFields)
      .then(processResults);
}

function loadContainer(data) {
  document.getElementsByName("name")[0].value = data.name;
  document.getElementsByName("dockerId")[0].value = data.dockerId;
  document.getElementsByName("dockerIp")[0].value = data.dockerIp;
  document.getElementsByName("dockerPort")[0].value = data.dockerPort;
}

function processResults({ data }) {
  document.querySelector("form").reset();
  window.alert(`Container ${data.id} updated!`);
}
