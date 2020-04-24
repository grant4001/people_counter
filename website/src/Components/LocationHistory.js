import React from 'react';
import { Bar } from 'react-chartjs-2';



const LocationHistory = () => {
  var searchParams = new URLSearchParams(window.location.search);
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [{
      label: "Location Occupancy",
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: [0, 10, 5, 2, 20, 30, 45],
    }]
  };

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


  return (
    <div>
      <h1>{searchParams.get("name")}: Location History</h1>
      <p>Location History information goes here</p>
      <div id="graph" className="col-6">
        <Bar data={data} options={options} width={200} height={100} />
      </div>
    </div>
  );
}

export default LocationHistory;