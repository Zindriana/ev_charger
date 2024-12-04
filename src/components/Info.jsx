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

        // Hämta information vid första renderingen
        getInfo();

        // Sätt ett intervall för att hämta information regelbundet
        const intervalId = setInterval(getInfo, 2000);

        // Rensa intervallet när komponenten avmonteras
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