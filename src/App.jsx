import ChargeWithoutPriceConcern from "./components/ChargeWithoutPriceConcern.jsx";
import Discharge from "./components/Discharge.jsx";
import EconomicCharge from "./components/EconomicCharge.jsx";
import Info from "./components/Info.jsx";

function App() {

  return (
      <>
          < Info/><p></p>
          < ChargeWithoutPriceConcern/><p></p>
          < EconomicCharge/><p></p>
          < Discharge/>
          {/*@app.route('/')*/}
          {/*@app.route('/info', methods=['GET'])*/}
          {/*@app.route('/baseload', methods=['GET'])*/}
          {/*@app.route('/priceperhour', methods=['GET'])*/}
          {/*@app.route('/charge', methods=['POST', 'GET'])*/}
          {/*@app.route('/discharge', methods=['POST', 'GET'])*/}
      </>
  )
}

export default App
