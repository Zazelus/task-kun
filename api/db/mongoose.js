// mongoose.js handles connection logic to the MongoDB database

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TaskManager', { useNewUrlParser: true }).then(() => {
    console.log("Connection to MongoDB successful: ");
}).catch((e) => {

});