import React from 'react';

const LocationHistory = () => {
    var searchParams = new URLSearchParams(window.location.search);
    return (
        <div>
            <h1>{searchParams.get("name")}: Location History</h1>
            <p>Location History information goes here</p>
        </div>
    );
}

export default LocationHistory;