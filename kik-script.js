async function getJSON() {
  const response = await fetch("https://enkasseienfestforening.dk/timetrial/json/");
  const json = await response.json();
  return json;
}

function extractFromJSON(json, id) {
  for (let obj of json) {
    if (obj.id === id) {
      return obj;
    }
  }
}

async function getData(id) {
  const json = await getJSON();
  const data = extractFromJSON(json, id);

  return data;
}

function accumulateDurations(durations, startTime) {
  let accumulatedDurations = Array();
  let accumulated = startTime;
  for (let duration of durations) {
    accumulated += duration * 1000
    accumulatedDurations.push(accumulated);
  }
  return accumulatedDurations;
}

function convertToTime(timeseries) {
  let times = [];
  for (time of timeseries) {
    times.push(new Date(time));
  }

  return times;
}

function kassPlot(times, amount, startTime, element_id) {
  let element = document.getElementById(element_id);

  const currentTime = new Date()

  const endTime = startTime + (1000 * 3600 * 26);

  Plotly.newPlot(element, [{
    x: times,
    y: amount,
    mode: "markers",
    type: "scatter",
    name: "Øl drukket",
  }, {
    x: [currentTime, currentTime],
    y: [-1, 32],
    mode: "lines",
    line: {
      color: "rgb(0,0,0)",
      width: 1,
      dash: "dash"
    },
    name: "Nu"
  }], {
    font: { color: "#fff" },
    paper_bgcolor: "#000",
    xaxis: {
      range: [startTime, endTime],
      title: {
        text: "Tidspunkt"
      }
    },
    yaxis: {
      range: [0, 31],
      title: {
        text: "Antal øl drukket"
      }
    },
    showlegend: false,
    margin: {
      l: 30,
      r: 0,
      t: 0,
    }

  },
    {
      responsive: true,
    })

}


function insertData(durations, startTime) {
  const sum = durations.reduce((a, b) => a + b, 0);
  const num = durations.length;
  const mean = sum / num;
  const min = Math.min(...durations);
  const max = Math.max(...durations);
  const totTime = Date.now() - startTime;
  const curTime = Date.now() - (startTime + sum * 1000)

  sumEl = document.getElementById("sum");
  numEl = document.getElementById("num");
  meanEl = document.getElementById("mean");
  minEl = document.getElementById("min");
  maxEl = document.getElementById("max");
  totEl = document.getElementById("total_time");
  curEl = document.getElementById("current_time");

  sumEl.textContent = humanizeDuration(sum * 1000, { "language": "da", "units": ["h", "m", "s"], "round": true });
  numEl.textContent = num;
  meanEl.textContent = humanizeDuration(mean * 1000, { "language": "da", "units": ["h", "m", "s"], "round": true });
  minEl.textContent = humanizeDuration(min * 1000, { "language": "da", "units": ["h", "m", "s"], "maxDecimalPoints": 2 });
  maxEl.textContent = humanizeDuration(max * 1000, { "language": "da", "units": ["h", "m", "s"], "maxDecimalPoints": 2 });
  totEl.textContent = humanizeDuration(new Date(totTime), { "language": "da", "units": ["h", "m"], "round": true });
  curEl.textContent = humanizeDuration(new Date(curTime), { "language": "da", "units": ["h", "m"], "round": true });
}

async function main(id) {

  const data = await getData(id);

  const startTime = Date.parse(data.start_time);

  const durations = data.durations;

  const accumulatedDurations = accumulateDurations(durations, startTime);

  const times = convertToTime(accumulatedDurations);

  const amount = [...Array(durations.length + 1).keys()].slice(1);

  kassPlot(times, amount, startTime, "figure");

  insertData(durations, startTime);

  const indicator = document.getElementById("indicator");

  indicator.classList.remove("loading")

  setTimeout(() => main(id), 600000);

}

main(2418)
