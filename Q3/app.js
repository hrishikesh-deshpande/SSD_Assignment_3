var newsDiv = document.getElementById("news");

var myPromise = fetch("./futurism.json");

myPromise
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
        moment(date).fromNow() +
        "&ensp; &#x2022; &ensp;";

      var rm = document.createElement("a");
      rm.href = item.link[0];
      rm.innerHTML = "Read more...";
      rm.setAttribute("target", "_blank");

      h6.appendChild(rm);

      div.appendChild(h6);

      newsCard.appendChild(div);
      // newsCard.setAttribute("onclick", "location.href='" + item.link[0] + "';");

      newsDiv.appendChild(newsCard);
      // console.log(item.title.__cdata);
    });
  })
  .catch(function () {
    console.log("loading json file failed");
  });

// items.forEach((item) => console.log(item));
