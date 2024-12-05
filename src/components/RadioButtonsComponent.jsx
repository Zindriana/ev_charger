import React from 'react';

function RadioButtonsComponent({ selectedOption, onChange }) {
    const handleOptionChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <div>
            <label>
                <input
                    type="radio"
                    value="noCharging"
                    checked={selectedOption === 'noCharging'}
                    onChange={handleOptionChange}
                />
                No charging
            </label>
            <label>
                <input
                    type="radio"
                    value="ecoCharging"
                    checked={selectedOption === 'ecoCharging'}
                    onChange={handleOptionChange}
                />
                Charge when low price
            </label>
            <label>
                <input
                    type="radio"
                    value="ableCharging"
                    checked={selectedOption === 'ableCharging'}
                    onChange={handleOptionChange}
                />
                Charge when high free capacity
            </label>
        </div>
    );
}

export default RadioButtonsComponent;