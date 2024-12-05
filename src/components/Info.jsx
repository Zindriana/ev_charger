import { useState, useEffect } from 'react';
import { API_BASE_URL } from "../config.js";

function Info() {
    const [info, setInfo] = useState(null);

    useEffect(() => {
        function getInfo() {
            const infoPromise = fetch(`${API_BASE_URL}/info`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json());

            //the info from the charge promise isn´t used anymore, either delete here or
            // use it in some way instead of the charge fetch in the other components
            const chargePromise = fetch(`${API_BASE_URL}/charge`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json());

            Promise.all([infoPromise, chargePromise])
                .then(([infoData, chargeData]) => {
                    setInfo({
                        ...infoData,
                        batteryCapacity: chargeData,
                    });
                })
                .catch(error => console.error('Error fetching info or charge:', error));
        }

        const intervalId = setInterval(getInfo, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            {info && (
                <div>
                    <p>Time: {info.sim_time_hour}:{info.sim_time_min}</p>
                    <p>Base Current Load: {info.base_current_load}</p>
                    <p>Battery Capacity: {info.batteryCapacity}%</p>
                </div>
            )}
        </>
    );
}

export default Info;