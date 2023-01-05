import { Schema } from 'mongoose';

const CommentSchema = new Schema<CommentT>(
  {
    refPost: {
      type: Schema.Types.ObjectId,
      ref: 'posts'
    },
    authId: {
      type: Schema.Types.ObjectId,
      ref: 'auths'
    },
    comment: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export { CommentSchema };
