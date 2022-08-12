import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  name: {
    type: 'String',
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: 'Number',
    required: [true, 'A tour must have a rating'],
  },
  price: {
    type: 'Number',
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
