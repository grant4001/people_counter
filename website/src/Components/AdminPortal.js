import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminPortal = () => {
  const [locationData, setLocationData] = useState([]);

  useEffect(() => {
    fetch("/locations").then(response => response.json()).then(payload => {
      setLocationData(payload.data);
    });
  }, []);
  let rendered_list = locationData.map((metadata, index) => {
    let url = "/location?name=" + metadata.name;
    let update_max = () => {
      let value = document.getElementById(`max_occupancy_${metadata.id}`).value;
      if (!value) {
        return;
      }
      putData('/locations/max/' + index, { value: value }).then(
        (response) => {
          console.log(response);
          window.location.reload();
        }
      );
    };
    return (
      <div className="row" key={index}>
        <div className="d-inline col-2">{metadata.name}: </div>
        <div className="d-inline col-1">69/{metadata.maximum} </div>
        <div className="d-inline col-2">
          <div className="input-group mb-3">
            <input
              type="number"
              id={`current_occupancy_${metadata.id}`}
              className="form-control"
              aria-label="Current Occupancy" />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button">Update</button>
            </div>
          </div>
        </div>
        <div className="d-inline col-2">
          <div className="input-group mb-3">
            <input
              type="number"
              id={`max_occupancy_${metadata.id}`}
              className="form-control"
              aria-label="Maximum Occupancy" />
            <div className="input-group-append">
              <button
                onClick={update_max}
                className="btn btn-outline-secondary"
                type="button">
                Update
              </button>
            </div>
          </div>
        </div>
        <div className="col-2">
          <Link
            to={url}
            className="btn btn-outline-secondary"
            type="button">
            Past Analytics
          </Link>
        </div>
      </div>)
  });
  return (
    <div>
      <h1>Admin Portal</h1>
      <div>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-1">Occupancy </div>
          <div className="col-2">Current Occupancy</div>
          <div className="col-2">Maximum Occupancy</div>
        </div>
        {rendered_list}
      </div>
    </div>
  );
}

async function putData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return await response.text(); // parses JSON response into native JavaScript objects
}

export default AdminPortal;