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
  var searchParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    fetch(`/locations`)
      .then(response => response.json())
      .then(payload => {
        console.log("fetch completed");
        /* TODO: finish this once backend is complete*/
        setChartState(state => ({ ...state, redraw: true }));
      });
  }, []);


  return (
    <div>
      <h1>{searchParams.get("name")}: Location History</h1>
      <p>Showing location data for date: {new Date().toLocaleDateString()}</p>
      <div id="graph" className="col-8">
        <LineChart {...chartState} />
      </div>
    </div>
  );
}

const LineChart = ({ x, y, redraw }) => {
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