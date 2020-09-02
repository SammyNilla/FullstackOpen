import React from 'react';

const CountryDisplayButton = ({name, handleClick}) => {
  const updateSearchQuery = () => {
    handleClick(name.toLowerCase());
  }
  return (
    <button onClick={updateSearchQuery}>show</button>
  )
};

const CountryList = (props) => {
  const {countries} = props;
  return (
    <div>
      {countries.map(country =>
        <div key={country.name}>
          {country.name}
          <CountryDisplayButton name={country.name} handleClick={props.handleClick} />
        </div>
      )}
    </div>
  )
};

export default CountryList;