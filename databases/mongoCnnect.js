const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/finelproject")
.then( () => {
    console.log("connected to mongo database!")
})
.catch( error => console.error(error));

exports.modules = mongoose;