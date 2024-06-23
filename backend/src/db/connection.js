const mongoose = require('mongoose');
const dbURL = `mongodb+srv://paulesthappan:${process.env.MongoDBPassword}@datingapp.twydee6.mongodb.net/?retryWrites=true&w=majority&appName=DatingApp`;

mongoose.connect(dbURL).then(() => {
  console.log('Database Connected');
}).catch((error) => {
  console.log("Error occurred", error);
});
