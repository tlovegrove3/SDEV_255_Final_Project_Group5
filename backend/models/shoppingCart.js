const { mongoose } = require("../config/database");

const shoppingCartSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    unique: true
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

shoppingCartSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const ShoppingCart = mongoose.model("ShoppingCart", shoppingCartSchema);

module.exports = ShoppingCart;