import {API_BASE_URL} from "../config.js";
import Info from "./Info.jsx";

function ChargeWithoutPriceConcern() {
    function chargeWithoutPrice() {
        setInterval(() => {
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
            const { base_current_load } = infoData;
            const shouldCharge = base_current_load < 3.6 && chargeData < 80;

            fetch(`${API_BASE_URL}/charge`, {
            method: 'post',
                headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ charging: shouldCharge ? 'on' : 'off' })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Charge status:', data);
        })
        .catch(error => console.error('Error updating charge status:', error));
})
.catch(error => console.error('Error fetching info or charge:', error));
}, 1000); // Kör detta varje sekund
}

return (
    <>
        <Info />
        <button className="justChargeBtn" onClick={chargeWithoutPrice}>Charge when able</button>
    </>
);
}

export default ChargeWithoutPriceConcern;