import {API_BASE_URL} from "../config.js";
import {useEffect, useState} from "react";
import PropTypes from "prop-types";

function ChargeWithoutPriceConcern({ selectedOption }) {

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

    useEffect( () => {
        if (baseload) {
            const usedCapacity = 3.6;
            let eligibleHours = [];

            for (let i = 0; i < baseload.length; i++) {
                if (baseload[i] < usedCapacity) {
                    eligibleHours.push({hour: i, available_kW: baseload[i]});
                }
            }

            eligibleHours.sort((a, b) => a.available_kW - b.available_kW);
            setBestHours(eligibleHours.slice(0, 4));
            console.log("eligible hours: " + JSON.stringify(eligibleHours, null, 2));
            console.log("best hours: " + JSON.stringify(bestHours, null, 2));
        }
    }, [baseload]);

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

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (selectedOption === 'ableCharging')
            fetch(`${API_BASE_URL}/charge`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(batteryCapacity => {
                    const isBestHour = bestHours.some(hour => hour.hour === simTime);

                    if (isBestHour && batteryCapacity < 75) {
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

    }, [simTime, bestHours, selectedOption ]);

    ChargeWithoutPriceConcern.propTypes = {
        selectedOption: PropTypes.string.isRequired,
    };

return (
    <></>
);
}

export default ChargeWithoutPriceConcern;