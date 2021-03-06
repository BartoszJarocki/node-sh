const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on('error', (err) => {
  console.error('Connection error!', err);
});
db.once('open', () => {
  console.log('Connected to database.');
});

module.exports = {
  mongoose
}