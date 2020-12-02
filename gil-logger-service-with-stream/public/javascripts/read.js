document.getElementById("load").onclick = function(){
  const value = document.getElementById("dockerId").value;
  if(value === "") {
    axios.get('/api/containers').then(addList);
  }
  else {
    axios.get(`/api/containers/${value}`)
        .then(addSingle)
        .catch((err) => {if(err.response.status === 404) {
          notFound();
        }})
  }
};

function addList({ data }) {
  resetContentArea();

  const template = document.querySelector("#list-result");
  const clone = template.content.cloneNode(true);

  const ul = clone.querySelector("ul");
  data.forEach((d) => {
    const li = clone.querySelector("li").cloneNode(true);
    const id = li.querySelector("#dockerId");
    id.textContent = d.dockerId;
    id.onclick = (e) => {
      document.getElementById("dockerId").value = e.currentTarget.textContent;
    };
    li.querySelector("#container-name").textContent = d.name;

    ul.appendChild(li);
  });

  results.appendChild(clone);
}

function addSingle({ data }) {
  resetContentArea();
  const template = document.querySelector("#result");

  const clone = template.content.cloneNode(true);
  clone.querySelector("#title").textContent = data.name;
  clone.querySelector("#description").textContent = data.logger;

  results.appendChild(clone);
}

function notFound() {
  resetContentArea();

  const h2 = document.querySelector("h2.hidden");
  h2.className = "";
}

function resetContentArea() {
  document.querySelector("h2").className = "hidden";
  const currentContainer = document.getElementById("container-result");
  if (currentContainer) {
    currentContainer.remove();
  }
  const containerList = document.getElementById("container-list");
  if (containerList) {
    containerList.remove();
  }
}
