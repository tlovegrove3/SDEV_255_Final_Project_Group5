const mongoose = require("mongoose");
const uri =
  "mongodb+srv://tlovegrove3:rt8oXzdaVQDKC26s@sdev255-final.atk7y5y.mongodb.net/?retryWrites=true&w=majority&appName=SDEV255-Final";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;
