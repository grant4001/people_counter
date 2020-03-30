import React, { useState, useEffect } from 'react';

const Home = () => {
    const [locationData, setLocationData] = useState([]);

    useEffect(() => {
        fetch("/locations").then(response => response.json()).then(payload => {
            setLocationData(payload.data);
        });
    }, []);

    return (
        <div>
            <h1>Home</h1>
            <div>
                {locationData.map((metadata, index) => (
                    <span className="row" key={index}>
                        <h3 className="col-4">{metadata.name}: </h3>
                        <h3 className="col-4">Current Level: </h3>
                        <h3 className="col-4">8/8</h3>
                    </span>))
                }
            </div>
        </div>
    );

}

export default Home;