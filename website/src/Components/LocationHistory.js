import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const toTimeStr = num => new Date(num * 1000).toLocaleTimeString();

const defaultX = [...Array(7).keys()]
  .map(x => (10 * x + 1590294082));
const defaultY = [0, 10, 5, 2, 20, 30, 45];

const options = {
  responsive: true,
  maintainAspectRatio: true,
  title: {
    display: true,
    fontSize: 20,
    text: 'Occupancy History'
  },
  tooltips: {
    mode: 'index',
    intersect: false,
  },
  hover: {
    mode: 'nearest',
    intersect: true
  },
  scales: {
    xAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Time'
      }
    }],
    yAxes: [{
      display: true,
      ticks: {
        beginAtZero: true
      },
      scaleLabel: {
        display: true,
        labelString: 'Occupancy'
      }
    }]
  }
};

const LocationHistory = () => {
  const [chartState, setChartState] = useState({ x: defaultX, y: defaultY, redraw: false });
  let searchParams = new URLSearchParams(window.location.search);
  let name = searchParams.get("name");
  let id = searchParams.get("id");
  useEffect(() => {
    fetch(`/locations/${id}/history`)
      .then(response => response.json())
      .then(payload => {
        console.log("fetch completed");
        console.log(payload);
        if (payload.times && payload.occupancy) {
          let x = payload.times.map(Math.floor);
          let y = payload.occupancy;
          setChartState(state => ({ x: x, y: y, redraw: true }));
        } else {
          setChartState({ x: [], y: [] });
        }
      });
  }, [id]);


  return (
    <div>
      <h1>{name}: Location History</h1>
      <p>Showing location data for date: {new Date().toLocaleDateString()}</p>
      <div id="graph" className="col-8">
        <LineChart {...chartState} />
      </div>
    </div>
  );
}

const LineChart = ({ x, y, redraw }) => {
  if (x.length === 0 || y.length === 0) {
    return <div>No data could be found for this location!</div>;
  }
  const data = {
    labels: x.map(toTimeStr),
    datasets: [{
      label: "Location Occupancy",
      fill: false,
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: y,
    }]
  };

  return <Line data={data} options={options} width={200} height={100} redraw={redraw} />;
};

export default LocationHistory;