import { Schema } from 'mongoose';

const CategorySchema = new Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
    maxlength: 15
  },
  mascotName: {
    type: String,
    required: true,
    unique: true,
    maxlength: 10
  },
  mascotImage: {
    type: String,
    default: 'https://user-images.githubusercontent.com/91370858/208048148-47028f2f-d283-4ab1-a43e-3c073543161e.png'
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'posts'
  }]
});

export { CategorySchema };
