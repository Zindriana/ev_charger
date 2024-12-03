import { API_BASE_URL } from "../config.js";

function Discharge() {
    fetch(`${API_BASE_URL}/discharge`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({'discharging': "on"})
    })
        .then(response => response.json())
        .then(data => {
            console.log('Charge status:', data);
        })
        .catch(error => console.error('Error updating charge status:', error)); // Flytta catch hit


    return (
        <>
            <button className="dischargeBtn" onClick={Discharge}>Restart server</button>
        </>
    )
}
export default Discharge;