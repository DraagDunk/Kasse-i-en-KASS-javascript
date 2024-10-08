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

function kassPlot(times, amount, startTime, element_id, finished) {
  let element = document.getElementById(element_id);

  const currentTime = Date.now();

  let endTime = 0;

  if (finished) {
    endTime = Date.parse(times[times.length - 1]) + (3600 * 1000);
  } else {
    endTime = startTime + (1000 * 3600 * 24);
  }

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

function insertData(durations, startTime, finished) {
  const sum = durations.reduce((a, b) => a + b, 0);
  const num = durations.length;
  const mean = sum / num;
  const min = Math.min(...durations);
  const max = Math.max(...durations);
  const totTime = Date.now() - startTime;
  const curTime = Date.now() - (startTime + sum * 1000)
  const finTime = new Date(startTime + mean * 30 * 1000);

  sumEl = document.getElementById("sum");
  numEl = document.getElementById("num");
  meanEl = document.getElementById("mean");
  minEl = document.getElementById("min");
  maxEl = document.getElementById("max");
  totEl = document.getElementById("total_time");
  curEl = document.getElementById("current_time");
  finEl = document.getElementById("finish");

  sumEl.textContent = humanizeDuration(sum * 1000, { "language": "da", "units": ["h", "m", "s"], "round": true });
  numEl.textContent = num;
  meanEl.textContent = humanizeDuration(mean * 1000, { "language": "da", "units": ["h", "m", "s"], "round": true });
  minEl.textContent = humanizeDuration(min * 1000, { "language": "da", "units": ["h", "m", "s"], "maxDecimalPoints": 2 });
  maxEl.textContent = humanizeDuration(max * 1000, { "language": "da", "units": ["h", "m", "s"], "maxDecimalPoints": 2 });
  totEl.textContent = humanizeDuration(totTime, { "language": "da", "units": ["h", "m"], "round": true });
  curEl.textContent = humanizeDuration(curTime, { "language": "da", "units": ["h", "m"], "round": true });
  finEl.textContent = finTime.toLocaleString("da", { "timeStyle": "short", "dateStyle": "long" });

  if (finished) {
    body = document.querySelector("body");
    body.classList.add("finished");
  } else {
    body = document.querySelector("body");
    body.classList.remove("finished");
  }
  
}

function isFinished(result, startTime, durations) {
  if (result !== "" || Date.now() - startTime > 30 * 3600 * 1000 || durations.length >= 30) {
    return true;
  } else {
    return false;
  }
}

async function main() {

  const kass_select = document.getElementById("kass_select");

  const kass_id = parseInt(kass_select.value);

  console.log("Fetching data ...")

  const data = await getData(kass_id);

  const startTime = Date.parse(data.start_time);

  const durations = data.durations;

  const finished = isFinished(data.result, startTime, durations);

  const accumulatedDurations = accumulateDurations(durations, startTime);

  const times = convertToTime(accumulatedDurations);

  const amount = [...Array(durations.length + 1).keys()].slice(1);

  kassPlot(times, amount, startTime, "figure", finished);

  insertData(durations, startTime, finished);

  const indicator = document.getElementById("indicator");

  indicator.classList.remove("loading")

  if (!finished) {
    setTimeout(() => main(), 60000);
  }

}

document.addEventListener("DOMContentLoaded", () => {

  const kass_select = document.getElementById("kass_select");

  main();

  kass_select.addEventListener("change", () => {
    main();
  })
});

