import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminPortal = () => {
    const [locationData, setLocationData] = useState([]);

    useEffect(() => {
        fetch("/locations").then(response => response.json()).then(payload => {
            setLocationData(payload.data);
        });
    }, []);
    return (
        <div>
            <h1>Admin Portal</h1>
            <div>
                <div className="row">
                    <div className="col-md-4"></div>
                    <div className="col-md-2">Current Occupancy</div>
                    <div className="col-md-2">Maximum Occupancy</div>
                </div>
                {locationData.map((metadata, index) => {
                    let url = "/location?name=" + metadata.name;
                    return (
                        <div className="row" key={index}>
                            <div className="col-md-2">{metadata.name}: </div>
                            <div className="col-md-1">Current: </div>
                            <div className="col-md-1">69/{metadata.maximum} </div>
                            <div className="col-md-2">
                                <div className="input-group mb-3">
                                    <input
                                        type="number"
                                        className="form-control"
                                        aria-label="Current Occupancy" />
                                    <div className="input-group-append">
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button">Update</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="input-group mb-3">
                                    <input type="number" className="form-control" aria-label="Maximum Occupancy" />
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-secondary" type="button">Update</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <Link to={url} className="btn btn-outline-secondary" type="button">Past Analytics</Link>
                            </div>
                        </div>)
                })}
            </div>
        </div>
    );
}

export default AdminPortal;