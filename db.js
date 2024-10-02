const mongoose = require('mongoose');
const mongodbURI = "mongodb://localhost:27017/inotebook"

// old code------
// const connectToMongo=()=> {

//   mongoose.connect(mongodbURI,()=>{
//     console.log("Connected to MongoDB");

//   })

// }


// New code (using promises):
const connectToMongo=()=>{
mongoose.connect(mongodbURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error(err);
  });

}

module.exports = connectToMongo;