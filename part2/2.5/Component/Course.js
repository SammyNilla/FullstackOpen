import React from 'react'

const Header = ({course}) => <h1>{course}</h1>
const Part = ({name, exercises}) => <p>{name} {exercises}</p>
const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part => 
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      )}
    </div>
  )
}
const Total = ({parts}) => {
  const sum = parts.reduce((s, p) => s + p.exercises, 0);
  return (
    <h3>total of {sum} exercises</h3>
  )
};

const Course = ({course}) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
};

export default Course;