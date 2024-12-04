import {API_BASE_URL} from "../config.js";
import {useEffect, useState} from "react";

function ChargeWithoutPriceConcern() {

    const [baseload, setBaseload] = useState(null);
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

    function chargeWithoutPrice() {

    }

return (
    <>
        <button className="justChargeBtn" onClick={chargeWithoutPrice}>Charge when able</button>
    </>
);
}

export default ChargeWithoutPriceConcern;