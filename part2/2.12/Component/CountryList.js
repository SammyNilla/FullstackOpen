import React from 'react';

const CountryList = ({countries}) => {
  return (
    <div>
      {countries.map(country =>
        <div key={country.name}>{country.name}</div>
      )}
    </div>
  )
};

export default CountryList;