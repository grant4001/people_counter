import React, { useState, useEffect } from 'react';

const Home = () => {
    const [locationData, setLocationData] = useState([]);

    useEffect(() => {
        setLocationData(getLocationData());
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

const getLocationData = () => {
    // TODO: make this http request instead of hardcode
    return ["location1", "location2", "location3"];
};

export default Home;