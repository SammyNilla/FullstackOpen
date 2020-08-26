import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Statistic = ({text, value}) => (
  <div>{text} {value}</div>
)

const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad;

  if (total) {
    const average = (good - bad) / total;
    const positive = (good / total) * 100;

    return (
      <div>
        <Statistic text={'good'} value={good} />
        <Statistic text={'neutral'} value={neutral} />
        <Statistic text={'bad'} value={bad} />
        <Statistic text={'all'} value={total} />
        <Statistic text={'average'} value={average} />
        <Statistic text={'positive'} value={positive.toString().concat(' %')} />
      </div>
    )
  };

  return <p>No feedback given</p>
};

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
)

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good+1)} text={'good'} />
      <Button handleClick={() => setNeutral(neutral+1)} text={'neutral'} />
      <Button handleClick={() => setBad(bad+1)} text={'bad'} />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
};

ReactDOM.render(<App />, 
  document.getElementById('root')
)