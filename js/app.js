let map = L.map('map').setView([53.430127, 14.564802], 18);
// L.tileLayer.provider('OpenStreetMap.DE').addTo(map);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");


let rasterMap = document.getElementById("rasterMap");
let rasterContext = rasterMap.getContext("2d");

document.getElementById("saveButton").addEventListener("click", function () {
  leafletImage(map, function (err, canvas) {
    rasterContext.drawImage(canvas, 0, 0, 300, 150);
  });
  initPuzzle();

});

document.getElementById("getLocation").addEventListener("click", () => {
  if (!navigator.geolocation) {
    console.log("Brak geolokalizacji.");
    return;
  }

  navigator.geolocation.getCurrentPosition(position => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    // Ustaw widok mapy na aktualną pozycję
    map.setView([lat, lon], 16); // druga liczba to zoom

    // Dodaj marker z pinem na mapę
    let locationMarker = L.marker([lat, lon]).addTo(map);

    locationMarker.bindPopup(
      `<br>Latitude: ${lat.toFixed(6)}<br>Longitude: ${lon.toFixed(6)}`
    ).openPopup();  }, err => {
    console.error("Błąd geolokalizacji:", err);
  });
});


// Od razu przy ładowaniu strony (raz)
if (Notification.permission !== "granted" && Notification.permission !== "denied") {
  Notification.requestPermission();
}

// Funkcja pokazująca powiadomienie
function showNotification(title, options) {
  if (Notification.permission === "granted") {
    new Notification(title, options);
  }
}
const initPuzzle = () => {
  let shuffled = document.getElementById("shuffledPuzzle");
  let shuffledContext = shuffled.getContext('2d');

  let result = document.getElementById("puzzleResult");
  let resultContext= result.getContext('2d');
  let draggedPiece = null;


  function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  function findPieceAtPosition(pieces, pos) {
    for (let i = pieces.length - 1; i >= 0; i--) {
      let p = pieces[i];
      if (
        pos.x > p.x && pos.x < p.x + p.width &&
        pos.y > p.y && pos.y < p.y + p.height
      ) {
        return { piece: p, index: i };
      }
    }
    return null;
  }

  const floatingCanvas = document.createElement("canvas");
  const floatingContext = floatingCanvas.getContext("2d");
  floatingCanvas.style.position = "fixed";
  floatingCanvas.style.pointerEvents = "none";
  floatingCanvas.style.zIndex = 1000;
  floatingCanvas.style.display = "none";
  document.body.appendChild(floatingCanvas);


  leafletImage(map, function (err, sourceImg) {
    let Width = sourceImg.width;
    let Height = sourceImg.height;
    shuffled.width = Width;
    shuffled.height = Height;
    shuffled.style.width = Width + "px";
    shuffled.style.height = Height + "px";

    result.width = Width;
    result.height = Height;
    result.style.width = Width + "px";
    result.style.height = Height + "px";

    let pieces = [];
    let piecesResult =[];
    let rows = 4;
    let cols = 4;
    let pieceWidth = Width / cols;
    let pieceHeight = Height / rows;


    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {

        piecesResult.push({
          x: col * pieceWidth,
          y: row * pieceHeight,
          width: pieceWidth,
          height: pieceHeight,
          srcX: col * pieceWidth,
          srcY: row * pieceHeight,
          empty: true,

        });


        pieces.push({
          x: col * pieceWidth,
          y: row * pieceHeight,
          width: pieceWidth,
          height: pieceHeight,
          srcX: col * pieceWidth,
          srcY: row * pieceHeight,
          empty: false,
        });
      }
    }
    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    shuffleArray(pieces);

// Krok 3: Przypisujemy nowe pozycje x,y według nowej kolejności
    pieces.forEach((piece, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      piece.x = col * pieceWidth;
      piece.y = row * pieceHeight;
    });

    let dragging = false;
    let draggedX = 0;
    let draggedY = 0;
    let offsetX = 0, offsetY = 0;


    function startDrag(canvas, piecesArray, event) {
      let pos = getMousePos(canvas, event);
      let found = findPieceAtPosition(piecesArray, pos);

      // Dla piecesResult dodatkowo sprawdzenie czy puzzel nie jest pusty
      if (found && (piecesArray === piecesResult ? !found.piece.empty : true)) {
        draggedPiece = found.piece;
        dragging = true;
        offsetX = pos.x - draggedPiece.x;
        offsetY = pos.y - draggedPiece.y;

        floatingCanvas.width = draggedPiece.width;
        floatingCanvas.height = draggedPiece.height;

        floatingContext.clearRect(0, 0, draggedPiece.width, draggedPiece.height);
        floatingContext.drawImage(
          sourceImg,
          draggedPiece.srcX, draggedPiece.srcY, draggedPiece.width, draggedPiece.height,
          0, 0, draggedPiece.width, draggedPiece.height
        );
        floatingContext.strokeRect(0, 0, draggedPiece.width, draggedPiece.height);

        floatingCanvas.style.display = "block";
        updateFloatingCanvasPosition(event.clientX, event.clientY);
      }
    }

    shuffled.addEventListener("mousedown", e => {
      startDrag(shuffled, pieces, e);
    });

    result.addEventListener("mousedown", e => {
      startDrag(result, piecesResult, e);
    });
    function updateFloatingCanvasPosition(clientX, clientY) {
      floatingCanvas.style.left = (clientX - offsetX) + "px";
      floatingCanvas.style.top = (clientY - offsetY) + "px";
    }

    window.addEventListener("mousemove", e => {
      if (!dragging || !draggedPiece) return;

      updateFloatingCanvasPosition(e.clientX, e.clientY);
      drawPieces(draggedPiece);
    });
    function checkPuzzleSolved(piecesResult) {
      for (let slot of piecesResult) {
        if (slot.empty) return false;
        if (slot.srcX !== slot.x || slot.srcY !== slot.y) return false;
      }
      showNotification("Puzzle", { body: "Puzzle solved" });
      return true;
    }


    window.addEventListener("mouseup", e => {
      if (!dragging || !draggedPiece) return;

      dragging = false;

      let posResult = getMousePos(result, e);

      let inResultCanvas = posResult.x >= 0 && posResult.x <= result.width &&
        posResult.y >= 0 && posResult.y <= result.height;

      if (inResultCanvas) {
        let targetSlot = piecesResult.find(s =>
          posResult.x > s.x && posResult.x < s.x + s.width &&
          posResult.y > s.y && posResult.y < s.y + s.height &&
          s.empty
        );

        if (targetSlot) {
          targetSlot.srcX = draggedPiece.srcX;
          targetSlot.srcY = draggedPiece.srcY;
          targetSlot.empty = false;

          draggedPiece.empty = true;
        }
      }

      floatingCanvas.style.display = "none";
      draggedPiece = null;
      drawPieces();
      checkPuzzleSolved(piecesResult);
    });
    const drawPieces = (draggedPiece=null) =>{
      shuffledContext.clearRect(0, 0, shuffled.width, shuffled.height);
      resultContext.clearRect(0, 0, result.width, result.height);

      pieces.forEach(p => {
        if (draggedPiece !== p && !p.empty) {
          shuffledContext.drawImage(
            sourceImg,
            p.srcX, p.srcY, p.width, p.height,
            p.x, p.y, p.width, p.height
          );
          shuffledContext.strokeRect(p.x, p.y, p.width, p.height);
        }
      });

      piecesResult.forEach(p => {
        if (!p.empty) {
          resultContext.drawImage(
            sourceImg,
            p.srcX, p.srcY, p.width, p.height,
            p.x, p.y, p.width, p.height
          );
        }
        resultContext.strokeRect(p.x, p.y, p.width, p.height);
      });
    }
    drawPieces();
  });

}



