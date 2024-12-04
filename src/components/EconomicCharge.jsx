import {API_BASE_URL} from "../config.js";
import { useState, useEffect } from 'react';

function EconomicCharge() {
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

    function chargeWhenCheap() {

        const x = 3.6;
        let eligibleHours = [];

        for (let i = 0; i < baseload.length; i++) {
            if (baseload[i] < x) {
                eligibleHours.push({ hour: i, price: price[i] });
            }
        }

        eligibleHours.sort((a, b) => a.price - b.price);
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
            .then(data => setSimTime(data.sim_time_hour)); // Uppdaterar den simulerade tiden
    }, 900); // Uppdaterar varje minut

    return () => clearInterval(intervalId); // Rensar intervallet vid unmount
}, []);

    useEffect(() => {
        if (simTime !== null) {
            // Hämta nuvarande batterikapacitet
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
            <button className="economicChargeBtn" onClick={chargeWhenCheap}>Economic charge</button>
        </>
    );
}
export default EconomicCharge;
