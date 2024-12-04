import {API_BASE_URL} from "../config.js";
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function EconomicCharge({ selectedOption }) {
    const [baseload, setBaseload] = useState(null);
    const [price, setPrice] = useState(null);
    const [bestHours, setBestHours] = useState([]);
    const [simTime, setSimTime] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/baseload`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then(data => setBaseload(data));
    }, []);

    useEffect(() => {
        fetch(`${API_BASE_URL}/priceperhour`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then(data => setPrice(data));
    }, [])

    useEffect(() => {
        if (baseload && price) {
            const usedCapacity = 3.6;
            let eligibleHours = [];

            for (let i = 0; i < baseload.length; i++) {
                if (baseload[i] < usedCapacity) {
                    eligibleHours.push({hour: i, price: price[i]});
                }
            }

            eligibleHours.sort((a, b) => a.price - b.price);
            setBestHours(eligibleHours.slice(0, 4));
            console.log("eligible hours: " + JSON.stringify(eligibleHours, null, 2));
            console.log("best hours: " + JSON.stringify(bestHours, null, 2));
        }
    }, [baseload, price]);

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

        if (selectedOption === 'ecoCharging') {
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
        }
    }, [simTime, bestHours, selectedOption]);

        return (
            <></>
        );
    }

EconomicCharge.propTypes = {
    selectedOption: PropTypes.string.isRequired,
};

export default EconomicCharge;
