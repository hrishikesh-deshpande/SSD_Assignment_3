var GAME_OVER = false;
var KILLS = 0;
var VULTURE = -1;
var TURN = "crow";

// const fs = require("fs");
// fs.writeFile("Output.txt", "fnkskfdbk", (err) => {
//   // In case of a error throw err.
//   if (err) throw err;
// });

function updateTurn() {
  document.getElementById("turnImage").src = TURN + ".png";
}
updateTurn();

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
  };
}

var board = document.getElementById("board");

var radiusScale = [1, (3 - Math.sqrt(5)) / 2];
var radius = Math.min(window.innerWidth, window.innerHeight) / 3;

var rotation = 0;
const increment = (2 * Math.PI) / 10;

var endpoints = [];

for (let i = 0; i < 10; i++) {
  var place = document.createElement("div");
  place.id = "place" + i;
  place.style.transform =
    "translateY(" +
    -radius * Math.cos(rotation) * radiusScale[i % 2] +
    "px) translateX(" +
    -radius * Math.sin(rotation) * radiusScale[i % 2] +
    "px)";
  rotation += increment;
  // place.innerHTML = i;
  // place.title = i;
  place.classList.add("place");
  //   place.ondrop = "drop(event)";
  //   place.ondragover = "allowDrop(event)";
  place.setAttribute("ondrop", "drop(event)");
  place.setAttribute("ondragover", "allowDrop(event)");

  board.appendChild(place);

  // if (i % 2 === 0) {
  //   const coords = getOffset(place);
  //   // console.log(coords.left, coords.top);
  //   endpoints.push({
  //     x: coords.left,
  //     y: coords.top,
  //   });
  // }
}

// console.log(endpoints);

function createLineElement(x, y, length, angle) {
  var line = document.createElement("div");
  var styles =
    "border: 1px solid #ffff00; " +
    "width: " +
    length +
    "px; " +
    "height: 0px; " +
    "-moz-transform: rotate(" +
    angle +
    "rad); " +
    "-webkit-transform: rotate(" +
    angle +
    "rad); " +
    "-o-transform: rotate(" +
    angle +
    "rad); " +
    "-ms-transform: rotate(" +
    angle +
    "rad); " +
    "position: absolute; " +
    "top: " +
    (y + 25) +
    "px; " +
    "left: " +
    (x + 25) +
    "px; ";
  line.setAttribute("style", styles);
  line.classList.add("line");
  return line;
}

function createLine(x1, y1, x2, y2) {
  var a = x1 - x2,
    b = y1 - y2,
    c = Math.sqrt(a * a + b * b);

  var sx = (x1 + x2) / 2,
    sy = (y1 + y2) / 2;

  var x = sx - c / 2,
    y = sy;

  var alpha = Math.PI - Math.atan2(-b, a);

  return createLineElement(x, y, c, alpha);
}

function drawStar() {
  endpoints = [];
  for (let i = 0; i < 10; i += 2) {
    const coords = getOffset(document.getElementById("place" + i));
    // console.log(coords.left, coords.top);
    endpoints.push({
      x: coords.left,
      y: coords.top,
    });
  }
  console.log("resizing");
  document.querySelectorAll(".line").forEach((e) => {
    e.remove();
  });
  for (let i = 0; i < 5; i++) {
    document.body.appendChild(
      createLine(
        endpoints[i].x,
        endpoints[i].y,
        endpoints[(i + 2) % 5].x,
        endpoints[(i + 2) % 5].y
      )
    );
  }
}
window.onresize = drawStar;
drawStar();

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("pieceName", ev.target.id);
  ev.dataTransfer.setData("source", ev.target.parentElement.id);
  // console.log(ev);
  console.log(
    ev.target.id + " was picked up from " + ev.target.parentElement.id
  );
}

function canGo(type, source, destination) {
  if (GAME_OVER || KILLS == 4) {
    if (window.confirm("Game Over!!... Click OK to Play Again...")) {
      window.location.reload();
    }
    return false;
  }
  if (TURN != type) return false;
  // console.log(type, source, destination);
  if (document.getElementById(destination).hasChildNodes()) return false;
  if (source == "pieces") return true;
  if (type == "crow") {
    if (document.getElementById("pieces").hasChildNodes()) return false;
    var place = parseInt(source.charAt(source.length - 1), 10);
    if (place % 2 == 0) {
      // console.log("even case");
      // console.log((place + 1) % 10, (place + 10 - 1) % 10);
      return (
        destination == "place" + ((place + 1) % 10) ||
        destination == "place" + ((place + 9) % 10)
      );
    } else {
      // console.log("odd case");
      return (
        destination == "place" + ((place + 1) % 10) ||
        destination == "place" + ((place + 9) % 10) ||
        destination == "place" + ((place + 2) % 10) ||
        destination == "place" + ((place + 8) % 10)
      );
    }
  } else if (type == "vulture") {
    var place = parseInt(source.charAt(source.length - 1), 10);
    if (place % 2 == 0) {
      if (
        (document
          .getElementById("place" + ((place + 1) % 10))
          .hasChildNodes() &&
          !document
            .getElementById("place" + ((place + 3) % 10))
            .hasChildNodes()) ||
        (document
          .getElementById("place" + ((place + 9) % 10))
          .hasChildNodes() &&
          !document
            .getElementById("place" + ((place + 7) % 10))
            .hasChildNodes())
      ) {
        if (
          destination == "place" + ((place + 3) % 10) &&
          document
            .getElementById("place" + ((place + 1) % 10))
            .hasChildNodes() &&
          !document.getElementById("place" + ((place + 3) % 10)).hasChildNodes()
        ) {
          KILLS++;
          var middle = document.getElementById("place" + ((place + 1) % 10));
          console.log(middle.firstChild.id + " was killed on " + middle.id);
          middle.removeChild(middle.firstChild);
          return true;
        }
        if (
          destination == "place" + ((place + 7) % 10) &&
          document
            .getElementById("place" + ((place + 9) % 10))
            .hasChildNodes() &&
          !document.getElementById("place" + ((place + 7) % 10)).hasChildNodes()
        ) {
          KILLS++;
          var middle = document.getElementById("place" + ((place + 9) % 10));
          console.log(middle.firstChild.id + " was killed on " + middle.id);
          middle.removeChild(middle.firstChild);
          return true;
        }
        return false;
      }
      // console.log("even case");
      // console.log((place + 1) % 10, (place + 10 - 1) % 10);
      return (
        destination == "place" + ((place + 1) % 10) ||
        destination == "place" + ((place + 9) % 10)
      );
    } else {
      // odd case
      if (
        (document
          .getElementById("place" + ((place + 2) % 10))
          .hasChildNodes() &&
          !document
            .getElementById("place" + ((place + 3) % 10))
            .hasChildNodes()) ||
        (document
          .getElementById("place" + ((place + 8) % 10))
          .hasChildNodes() &&
          !document
            .getElementById("place" + ((place + 7) % 10))
            .hasChildNodes())
      ) {
        if (
          destination == "place" + ((place + 3) % 10) &&
          document
            .getElementById("place" + ((place + 2) % 10))
            .hasChildNodes() &&
          !document.getElementById("place" + ((place + 3) % 10)).hasChildNodes()
        ) {
          KILLS++;
          var middle = document.getElementById("place" + ((place + 2) % 10));
          console.log(middle.firstChild.id + " was killed on " + middle.id);
          middle.removeChild(middle.firstChild);
          return true;
        }
        if (
          destination == "place" + ((place + 7) % 10) &&
          document
            .getElementById("place" + ((place + 8) % 10))
            .hasChildNodes() &&
          !document.getElementById("place" + ((place + 7) % 10)).hasChildNodes()
        ) {
          KILLS++;
          var middle = document.getElementById("place" + ((place + 8) % 10));
          console.log(middle.firstChild.id + " was killed on " + middle.id);
          middle.removeChild(middle.firstChild);
          return true;
        }
        return false;
      }
      return (
        destination == "place" + ((place + 1) % 10) ||
        destination == "place" + ((place + 9) % 10) ||
        destination == "place" + ((place + 2) % 10) ||
        destination == "place" + ((place + 8) % 10)
      );
    }
  }
}

function drop(ev) {
  ev.preventDefault();
  var pieceName = ev.dataTransfer.getData("pieceName");
  var pieceDiv = document.getElementById(pieceName);
  if (
    ev.target.classList.contains("place") &&
    canGo(
      pieceDiv.classList[0],
      ev.dataTransfer.getData("source"),
      ev.target.id
    )
  ) {
    ev.target.appendChild(pieceDiv);
    if (TURN == "vulture") {
      VULTURE = parseInt(ev.target.id.charAt(ev.target.id.length - 1), 10);
    }
    console.log(pieceName + " was dropped to " + ev.target.id);
    if (TURN == "vulture" && KILLS == 4) {
      console.log("VULTURE WINS");
      // window.alert("VULTURE WINS");
      if (window.confirm("VULTURE WINS!!... Click OK to Play Again...")) {
        window.location.reload();
      }
    } else if (TURN == "crow") {
      if (VULTURE % 2 == 0) {
        if (
          !document
            .getElementById("place" + ((VULTURE + 1) % 10))
            .hasChildNodes() ||
          !document
            .getElementById("place" + ((VULTURE + 9) % 10))
            .hasChildNodes() ||
          (document
            .getElementById("place" + ((VULTURE + 1) % 10))
            .hasChildNodes() &&
            !document
              .getElementById("place" + ((VULTURE + 3) % 10))
              .hasChildNodes()) ||
          (document
            .getElementById("place" + ((VULTURE + 9) % 10))
            .hasChildNodes() &&
            !document
              .getElementById("place" + ((VULTURE + 7) % 10))
              .hasChildNodes())
        ) {
          TURN = "vulture";
          updateTurn();
          return;
        }
      } else {
        // odd case
        if (
          !document
            .getElementById("place" + ((VULTURE + 1) % 10))
            .hasChildNodes() ||
          !document
            .getElementById("place" + ((VULTURE + 9) % 10))
            .hasChildNodes() ||
          !document
            .getElementById("place" + ((VULTURE + 2) % 10))
            .hasChildNodes() ||
          !document
            .getElementById("place" + ((VULTURE + 8) % 10))
            .hasChildNodes() ||
          (document
            .getElementById("place" + ((VULTURE + 2) % 10))
            .hasChildNodes() &&
            !document
              .getElementById("place" + ((VULTURE + 3) % 10))
              .hasChildNodes()) ||
          (document
            .getElementById("place" + ((VULTURE + 8) % 10))
            .hasChildNodes() &&
            !document
              .getElementById("place" + ((VULTURE + 7) % 10))
              .hasChildNodes())
        ) {
          TURN = "vulture";
          updateTurn();
          return;
        }
      }
      GAME_OVER = true;
      console.log("CROWS WIN");
      // window.alert("CROWS WIN");
      if (window.confirm("CROWS WIN!!... Click OK to Play Again...")) {
        window.location.reload();
      }
    } else if (TURN == "vulture") {
      TURN = "crow";
      updateTurn();
      return;
    }
  } else {
    console.log(pieceName + " returned");
  }
}
