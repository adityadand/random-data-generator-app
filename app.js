const express = require('express');
const faker = require('faker');
const path = require('path');

const app = express();
const port = 3000;

// Use express.json() middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define a route to render the UI
app.get('/', (req, res) => {
  res.render('index');
});

// Define a route to handle form submission
app.post('/generate-data', (req, res) => {
  console.log('Received data:', req.body);

  let { count, fields, toggleType } = req.body;
  fields = fields.split(',');

  if (!count || !fields || !Array.isArray(fields)) {
    console.log('Invalid input:', req.body);
    return res.status(400).json({ error: 'Invalid input. Please provide count and fields array.' });
  }

  const generatedData = Array.from({ length: count }, () => {
    const dataObject = {};
    fields.forEach(field => {
      // Infer data type based on the field name
      let dataType;
      if (field.toLowerCase().includes('age')) {
        dataType = 'integer';
        dataObject[field] = faker.random.number({ min: 18, max: 99 });
      } else if (field.toLowerCase().includes('name')) {
        dataType = 'string';
        dataObject[field] = faker.name.findName();
      } else if (field.toLowerCase().includes('email')) {
        dataType = 'email';
        dataObject[field] = faker.internet.email();
      } else if (field.toLowerCase().includes('password')) {
        dataType = 'password';
        dataObject[field] = faker.internet.password();
      } else if (field.toLowerCase().includes('phone')) {
        dataType = 'phone';
        dataObject[field] = faker.phone.phoneNumber();
      } else if (field.toLowerCase().includes('birthday')) {
        dataType = 'birthday';
        dataObject[field] = faker.date.past().toISOString().split('T')[0];
      } else if (field.toLowerCase().includes('address')) {
        dataType = 'address';
        dataObject[field] = faker.address.streetAddress();
      } else if (field.toLowerCase().includes('country')) {
        dataType = 'country';
        dataObject[field] = faker.address.country();
      } else if (field.toLowerCase().includes('street')) {
        dataType = 'street';
        dataObject[field] = faker.address.streetName();
      } else if (field.toLowerCase().includes('zipcode')) {
        dataType = 'zipcode';
        dataObject[field] = faker.address.zipCode();
      } else if (field.toLowerCase().includes('gender') || field.toLowerCase().includes('sex')) {
        dataType = 'gender';
        dataObject[field] = faker.random.arrayElement(['Male', 'Female']);
      } else {
        // Default to a generic faker data type
        dataType = 'generic';
        dataObject[field] = faker.fake(`{{${field}}}`);
      }

      // Add the inferred data type to the result if toggleType is selected
      if (toggleType) {
        dataObject[`${field}_type`] = dataType;
      }
    });
    return dataObject;
  });

  res.render('result', { data: generatedData });
});

app.get('/types-info', (req, res) => {
  res.render('types-info');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
