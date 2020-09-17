const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const gravatar = require('gravatar');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('MongoDB Successfully Connected...');
  } catch (err) {
    console.error('ERROR while connecting to MongoDB : ' + err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
