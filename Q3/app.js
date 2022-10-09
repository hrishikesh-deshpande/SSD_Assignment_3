var newsDiv = document.getElementById("news");

fetch("./futurism.json")
  .then((response) => response.json())
  .then((response) => response.rss.channel.item)
  .then((items) => {
    items.forEach((item) => {
      var newsCard = document.createElement("div");
      newsCard.classList.add("newsCard");
      var h5 = document.createElement("h5");
      var a = document.createElement("a");
      a.href = item.link[0];
      a.innerHTML = item.title.__cdata;
      a.target = "_blank";
      h5.appendChild(a);
      newsCard.appendChild(h5);
      newsCard.innerHTML += item.description.__cdata;

      var div = document.createElement("div");
      var h6 = document.createElement("h6");

      var date = new Date(item.pubDate);
      h6.innerHTML =
        item.creator.__cdata +
        "&ensp; &#x2022; &ensp;" +
        moment(date).fromNow();

      div.appendChild(h6);

      newsCard.appendChild(div);
      // newsCard.setAttribute("onclick", "location.href='" + item.link[0] + "';");

      newsDiv.appendChild(newsCard);
      console.log(item.title.__cdata);
    });
  });

// items.forEach((item) => console.log(item));
