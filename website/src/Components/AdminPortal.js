import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { patchData, postData, deleteData } from "./Utils";

const AdminPortal = () => {
  const [locationData, setLocationData] = useState([]);

  useEffect(() => {
    fetch("/locations").then(response => response.json()).then(payload => {
      setLocationData(payload.data);
    });
  }, []);
  let rendered_list = locationData.map((metadata, index) => {
    let location_params = new URLSearchParams([["name", metadata.name], ["id", metadata.id]]);
    let url = "/location?" + location_params.toString();
    let update_cur = () => {
      let value = document.getElementById(`current_occupancy_${metadata.id}`).value;
      if (!value) {
        return;
      }
      patchData('/locations/cur/' + metadata.id, { value: value }).then(
        (response) => {
          console.log(response);
          window.location.reload();
        }
      );
    };
    let update_max = () => {
      let value = document.getElementById(`max_occupancy_${metadata.id}`).value;
      if (!value) {
        return;
      }
      patchData('/locations/max/' + metadata.id, { value: value }).then(
        (response) => {
          console.log(response);
          window.location.reload();
        }
      );
    };
    return (
      <div className="row" key={index}>
        <div className="d-inline col-2">{metadata.name}: </div>
        <div className="d-inline col-1">{metadata.current || "-"}/{metadata.maximum} </div>
        <div className="d-inline col-2">
          <div className="input-group mb-2">
            <input
              type="number"
              id={`current_occupancy_${metadata.id}`}
              className="form-control"
              aria-label="Current Occupancy" />
            <div className="input-group-append">
              <button
                onClick={update_cur}
                className="btn btn-outline-secondary"
                type="button">
                Update
              </button>
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
  const new_location = () => {
    let name = document.getElementById("new_location").value;
    postData('/locations', { name: name }).then(() => window.location.reload());
  };
  const delete_location = () => {
    let content = document.getElementById("delete-bar").value;
    let id = parseInt(content.split('-')[0]);
    console.log(id);
    deleteData('/locations/' + id).then(() => window.location.reload());
  };
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
        <div>
          <h2>New Location</h2>
          <div className="">
            <div className="col-6">
              <label htmlFor="new_location">Location Name</label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  id="new_location"
                  className="form-control"
                  aria-label="Maximum Occupancy" />
              </div>
            </div>
          </div>
          <button className="btn btn-primary mb-3" onClick={new_location}> Submit </button>
        </div>
        <div>
          <h2>Delete Location</h2>
          <div className="">
            <div className="col-6">
              <select
                className="selectpicker form-control mb-3"
                id="delete-bar">
                {locationData.map((ele, index) => <option key={index}>{ele.id + " - " + ele.name}</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-danger mb-3" onClick={delete_location}> Delete </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPortal;