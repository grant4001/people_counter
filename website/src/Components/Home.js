import React, { useState, useEffect } from 'react';

//const MAX_LEVEL = 8;

const updateDelay = 10 * 1000;

const Home = () => {
  const [locationData, setLocationData] = useState([]);

  useEffect(() => {
    let isCancelled = false;
    const refreshLocations = () => {

      let searchParam = new URLSearchParams();
      searchParam.append("date", new Date().getTime());
      let url = `/locations?${searchParam}`;
      console.log("fetching " + url);
      fetch(url)
        .then(response => response.json())
        .then(payload => {
          if (!isCancelled) {
            setLocationData(payload.data);
          }
        });
    }
    refreshLocations();
    const interval = setInterval(refreshLocations, updateDelay);
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <div>
        {
          locationData.map((metadata, index) => {
            // let public_level = metadata.current / metadata.maximum * MAX_LEVEL;
            let public_level = metadata.current;
            public_level = Math.round(public_level);
            return (<span className="row" key={index}>
              <h3 className="col-4">{metadata.name}: </h3>
              <h3 className="col-4">Current Level: </h3>
              <h3 className="col-4">{public_level}/{metadata.maximum}</h3>
            </span>);
          })
        }
      </div>
    </div>
  );

}

export default Home;