import {API_BASE_URL} from "../config.js";
import {useEffect, useState} from "react";

function ChargeWithoutPriceConcern() {

    const [baseload, setBaseload] = useState(null);
    const [simTime, setSimTime] = useState(null);
    const [bestHours, setBestHours] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/baseload`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then(data => setBaseload(data));
    }, []);

    function chargeWithoutPrice() {

        const usedCapacity = 3.6;
        let eligibleHours = [];

        for (let i = 0; i < baseload.length; i++) {
            if (baseload[i] < usedCapacity) {
                eligibleHours.push({ hour: i});
            }
        }

        eligibleHours.sort((a, b) => a.hour - b.hour);
        setBestHours(eligibleHours.slice(0, 4));
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetch(`${API_BASE_URL}/info`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json())
                .then(data => setSimTime(data.sim_time_hour));
        }, 900);

        return () => clearInterval(intervalId); // Rensar intervallet vid unmount
    }, []);

    useEffect(() => {
        if (simTime !== null) {
            fetch(`${API_BASE_URL}/charge`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(batteryCapacity => {
                    const isBestHour = bestHours.some(hour => hour.hour === simTime);

                    if (isBestHour && batteryCapacity < 80) { // Kontrollera om batterikapaciteten är under 80%
                        console.log("Charging at hour: " + simTime);
                        fetch(`${API_BASE_URL}/charge`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ charging: 'on' })
                        })
                            .then(response => response.json())
                            .then(data => console.log(data));
                    } else {
                        console.log("Not charging at hour: " + simTime);
                        fetch(`${API_BASE_URL}/charge`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ charging: 'off' })
                        })
                            .then(response => response.json())
                            .then(data => console.log(data));
                    }
                });
        }
    }, [simTime, bestHours]); // Triggar på ändringar i simTime och bestHours


return (
    <>
        <button className="justChargeBtn" onClick={chargeWithoutPrice}>Charge when able</button>
    </>
);
}

export default ChargeWithoutPriceConcern;