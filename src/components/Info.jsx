import {API_BASE_URL} from "../config.js";

function Info(){

    function getInfo(){
            fetch(`${API_BASE_URL}/info`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(data => {
                    console.log('Success:', data);
                })
                .catch(error => console.error('Error updating character:', error));
    }

    return(
        <>
        <button className="infoBtn" onClick={getInfo}>Get info</button>
        </>
    )
}

export default Info