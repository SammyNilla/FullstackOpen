import React from 'react';

const PersonForm = (props) => {
  const {handleSubmit} = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>name: <input value={props.inputValueName} onChange={props.handleNameChange} /></div>
      <div>number: <input value={props.inputValueNumber} onChange={props.handleNumberChange} /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
};

export default PersonForm;