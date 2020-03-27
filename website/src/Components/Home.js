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
                {locationData.map((name, index) => (
                    <div className="row" key={index}>
                        <h3 className="d-inline col-md-5">{name}: Current Level: </h3>
                        <h3 className="d-inline col-md-4">8/8</h3>
                    </div>))
                }
            </div>
        </div>
    );

}

export default Home;