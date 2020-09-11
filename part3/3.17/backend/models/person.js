const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const url = process.env.MONGODB_URI;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((err) => {
    console.log('error connecting to MongoDB:', err.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

/*if (process.argv.length > 3) {
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
}*/

module.exports = mongoose.model('Person', personSchema);