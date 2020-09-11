const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];

const url =
  `mongodb+srv://fullstack:${password}@cluster0.sylek.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length > 3) {
  // add person to database
  // usually i think we would sanitize these command line arguments
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  });

  person.save().then(res => {
    console.log(`added ${res.name} number ${res.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  // print phonebook recipients
  Person.find({}).then(res => {
    console.log('phonebook:');
    res.forEach(p => {
      console.log(p.name, p.number);
    })
    mongoose.connection.close();
  })
}