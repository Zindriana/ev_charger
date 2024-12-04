import ChargeWithoutPriceConcern from "./components/ChargeWithoutPriceConcern.jsx";
import Discharge from "./components/Discharge.jsx";
import Info from "./components/Info.jsx";
import RadioButtonComponent from "./components/RadioButtonsComponent.jsx";
import React, { useState } from 'react';
import EconomicCharge from "./components/EconomicCharge.jsx";

function App() {
    const [selectedOption, setSelectedOption] = useState('');

  return (
      <>
          < Info/><p></p>
          <RadioButtonComponent
              selectedOption={selectedOption}
              onChange={setSelectedOption}
          />
          < EconomicCharge selectedOption={selectedOption} />
          < ChargeWithoutPriceConcern selectedOption={selectedOption} />
          < Discharge/>

      </>
  )
}

export default App
