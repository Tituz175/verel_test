document.addEventListener("DOMContentLoaded", init);
let data;
let foreCast;
let place = "53.1,-0.13";
let chart;
function init() {
  getForecast();

  document.getElementById("place").addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
      place = e.target.value;

      getForecast();
    }
  });

  document.getElementById("getPlace").addEventListener("click", (e) => {
    let data = getLocation();
    console.log(data);
  });
}

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        place = `${latitude},${longitude}`;
        getForecast();
      },
      function (error) {
        console.error("Error getting location:", error.message);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};

const getForecast = async () => {
  const url =
    "https://weatherapi-com.p.rapidapi.com/forecast.json?q=" +
    place +
    "&days=5";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "52191eb530msh24733abc83a6b8fp1a6819jsnbf304ab89404",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    foreCast = result;

    console.log(result);

    createDashboard(foreCast);
    createChart();
  } catch (error) {
    console.error(error);
  }
};

// last_updated

const createDashboard = (data) => {
  document.getElementById(
    "title"
  ).innerHTML = `${data.location.name} Weather Dashboard`;
  document.getElementById(
    "loc"
  ).innerHTML = `<b>Location:</b> ${data.location.name}, ${data.location.region}`;
  document.getElementById(
    "temp"
  ).innerHTML = `<b>Current Temperature:</b> ${data.current.temp_c} C`;
  document.getElementById("wind").innerHTML = data.current.wind_mph + " MPHS";
  document.getElementById("date").innerHTML = `<b>Last update:</b> ${String(
    data.current.last_updated
  )}`;
  //   document.getElementById("date").innerHTML = data.current.
};

const createChart = () => {
  if (chart) {
    chart.destroy();
  }

  const hourly = foreCast.forecast.forecastday[0].hour;

  const config = {
    type: "line",
    data: {
      datasets: [
        {
          label: "Temperature",
          data: hourly,
          backgroundColor: "red",
          fill: false,
          parsing: {
            xAxisKey: "time",
            yAxisKey: "temp_c",
          },
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {},
      scales: {
        x: {
          ticks: {
            callback: function (value, index, value) {
              const time = new Date(hourly[index].time);
              return time.toLocaleTimeString();
            },
          },
        },
      },
    },
  };

  chart = new Chart(document.getElementById("chart"), config);
};
