document.getElementById("search").onclick = function () {
  var textValue = document.getElementById("search-terms").value;
  var containerValue = document.getElementById("container").value;
  var colorValue = document.getElementById("color").value;
  if (containerValue == "" && colorValue == "")
  {
    axios.get(`/api/containers/search?keywords=${textValue}`)
        .then(showResults);
  }
  else {
    let rootQuery = `/api/containers/detailSearch?`;
    let containerQuery = "";
    let colorQuery = "";

    if (textValue) {
      rootQuery += `name[val]=${textValue}`;
    }
    if (containerValue) {
      if (textValue) {
        containerQuery = "&";
      }
      containerQuery += `container[op]=lt&container[val]=${containerValue}`;
    }
    if (colorValue) {
      if (containerValue || textValue) {
        colorQuery = "&";
      }
      colorQuery += `color[p[]=eq&color[val]=${colorValue}`;
    }
    const query = `${rootQuery}${containerQuery}${colorQuery}`;
    axios.get(query).then(showResults);
  }
}
function showResults({ data }) {
  document.querySelector("h2").className = "hidden";

  const containerList = document.getElementById("container-list");
  if (containerList) {
    containerList.remove();
  }

  if (data.length === 0) {
    document.querySelector("h2.hidden").className = "";
  }

  const template = document.querySelector("#list-result");
  const clone = template.content.cloneNode(true);

  const ul = clone.querySelector("ul");
  data.forEach((d) => {
    const li = clone.querySelector("li").cloneNode(true);
    const id = li.querySelector("#dockerIt");
    id.textContent = d.id;
    id.onclick = (e) => {
      document.getElementById("dockerIt").value = e.currentTarget.textContent;
    };
    li.querySelector("#container-name").textContent = d.name;
    li.querySelector("#container-container").textContent = d.container;

    ul.appendChild(li);
  });

  results.appendChild(clone);
}
