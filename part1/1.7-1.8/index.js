import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad;
  // temporary ternary operators to deal with NaN during this particular example (which gets fixed in later examples)
  const average = total ? (good - bad) / total : 0;
  const positive = total ? (good / total) * 100 : 0;

  return (
    <>
      <h1>statistics</h1>
      <div>good {good}</div>
      <div>neutral {neutral}</div>
      <div>bad {bad}</div>
      <div>all {total}</div>
      <div>average {average}</div>
      <div>positive {positive} %</div>
    </>
  )
}

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
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
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)