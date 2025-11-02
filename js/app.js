

class weatherApp{
  constructor(apiKey, resultBlock) {
    this.apiKey = apiKey;
    this.resultBlock = document.getElementById("resultBlock");
    this.currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=query&appid=${apiKey}&units=metric&lang=pl`;
    this.fiveDayWeather = `https://api.openweathermap.org/data/2.5/forecast?q=query&appid=${apiKey}&units=metric&lang=pl`;

    this.currentWeatherJSON = undefined;
    this.fiveDayWeartherJSON = undefined;
  }


  XMLReq(query){
    let url = this.currentWeather.replace("query",query);
    let req = new XMLHttpRequest();
    req.open("GET",url,true);
    req.addEventListener("load",()=>{
      this.currentWeatherJSON = JSON.parse(req.responseText);
      //console.log(req);
      this.drawCurrent();
    })
    req.send();
  };
  fetchReq(query){
    const url = this.fiveDayWeather.replace("query",query);
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.fiveDayWeartherJSON = data.list;
        this.drawFuture();
      })
  }
  drawCurrent(){
    {
      const date = new Date(this.currentWeatherJSON.dt * 1000).toLocaleString();
      const temp = this.currentWeatherJSON.main.temp;
      const feel = this.currentWeatherJSON.main.feels_like;
      const iconSrc = `http://openweathermap.org/img/w/${this.currentWeatherJSON.weather[0].icon}.png`;
      const desc = this.currentWeatherJSON.weather[0].description;
      this.newWindow(date, temp, feel, iconSrc, desc);
    }
  }
  drawFuture(){
    for(const entry of this.fiveDayWeartherJSON){
      const date = new Date(entry.dt * 1000).toLocaleString();
      const temp = entry.main.temp;
      const feel = entry.main.feels_like;
      const iconSrc = `http://openweathermap.org/img/w/${entry.weather[0].icon}.png`;
      const desc = entry.weather[0].description;
      this.newWindow(date, temp, feel, iconSrc, desc);
    }
  }
  async draw(query) {
    if(!query) return;
    this.resultBlock.innerHTML = "";
    this.XMLReq(query);
    this.fetchReq(query);
  }

  newWindow(_date, _temp, _feel, _iconSrc, _desc) {

    const block = document.createElement("div");
    block.className = "result";

    const date = document.createElement("div");
    date.className = "date";
    date.innerHTML = _date;
    block.appendChild(date);

    const icon = document.createElement("img");
    icon.className = "icon";
    icon.src = _iconSrc;
    block.appendChild(icon);

    const sidePanel = document.createElement("div");
    sidePanel.className = "side-panel";

    const temp = document.createElement("div");
    temp.className = "temp";
    temp.innerHTML = `${_temp} &deg;C`;
    sidePanel.appendChild(temp);

    const feel = document.createElement("div");
    feel.className = "feel";
    feel.innerHTML = `odczuwalna: ${_feel} &deg;C`;
    sidePanel.appendChild(feel);

    const desc = document.createElement("div");
    desc.className = "description";
    desc.innerHTML = _desc;
    sidePanel.appendChild(desc);

    block.appendChild(sidePanel);

    this.resultBlock.appendChild(block);
  }

  newRequest() {

    const req = new XMLHttpRequest();

  }

}
const app = new weatherApp("dfecb8c81d3b6e0bb884feedbe338a1a", "resultBlock");

document.getElementById("searchButton").addEventListener("click", () => {
  const query = document.querySelector("#search input").value;
  app.draw(query);

});





