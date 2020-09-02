import React from 'react';

const CountryDetailed = ({country}) => {
  //console.log(country);
  const languages = country.languages;

  return (
    <div>
      <h2>{country.name}</h2>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h3>languages</h3>
      <ul>
        {languages.map((language, i) =>
          <li key={i}>{language.name}</li>
        )}
      </ul>
      <img src={country.flag} width={120} alt={`${country.name} flag`} />
    </div>
  )
};

export default CountryDetailed;