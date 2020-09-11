import React from 'react';
import Person from './Person';

const Persons = ({persons, handleClick}) => {
  return (
    <div>
    {persons.map(p =>
      <Person key={p.name} person={p} handleClick={handleClick} />
    )}
    </div>
  )
};

export default Persons;