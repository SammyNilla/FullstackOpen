import React from 'react';

const Person = ({person, handleClick}) => {
  const {name, number, id} = person;
  return (
    <div>
      {name} {number}
      <button onClick={() => handleClick(id)}>delete</button>
    </div>
  )
};

export default Person;