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

  const endTime = startTime + (1000 * 3600 * 30);

  Plotly.newPlot(element, [{
    x: times,
    y: amount,
    mode: "markers",
    type: "scatter"
  }, {
    x: [currentTime, currentTime],
    y: [-1, 32],
    mode: "lines",
    line: {
      color: "rgb(0,0,0)",
      width: 1,
      dash: "dash"
    }
  }], {
    title: { text: "En kasse i en KA$$" },
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

  })

}

async function main(id) {
  const data = await getData(id);

  const startTime = Date.parse(data.start_time);

  const durations = data.durations;

  const accumulatedDurations = accumulateDurations(durations, startTime);

  const times = convertToTime(accumulatedDurations);

  const amount = [...Array(durations.length + 1).keys()].slice(1);

  kassPlot(times, amount, startTime, "tester");

}

main(1849)
