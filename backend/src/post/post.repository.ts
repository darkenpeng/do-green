import { model } from 'mongoose';
import { CategorySchema } from '../category/category.schema';
import invariant from '../utils/invariant';
import { PostSchema } from './post.schema';
import { CommentSchema } from '../comment/comment.schema';
import { UserSchema } from '../user/user.schema';
import { NotFoundError } from '../errors/NotFoundError';

const PostModel = model<PostT>('posts', PostSchema);
const CategoryModel = model<categoryT>('categories', CategorySchema);
const CommentModel = model('comments', CommentSchema);
const UserModel = model<UserT>('users', UserSchema);

export class PostRepository implements IPostRepository {
  async subtractLike(currentAuthId: string, postId: string) {
    await PostModel.findByIdAndUpdate(
      postId,
      { $pull: { likeUserList: currentAuthId }, $inc: { likesNum: -1 } }
    );
  }

  async addLike(currentAuthId: string, postId: string) {
    await PostModel.findByIdAndUpdate(
      postId,
      { $push: { likeUserList: currentAuthId }, $inc: { likesNum: 1 } }
    );
  }

  async isLikedByPostId(currentAuthId: string, postId: string): Promise<{} | null> {
    const post = await PostModel.exists({ _id: postId });
    invariant(post !== null, new NotFoundError('해당하는 포스트가 존재하지 않습니다.'));

    const isLiked = await PostModel.exists({ _id: postId, likeUserList: currentAuthId });
    return isLiked;
  }

  async paginationPost(categoryId: string, page: number, perPage: number, authId?: string) {
    const category = await CategoryModel.findById(categoryId, undefined, {
      populate: {
        path: 'posts',
        options: {
          // eslint-disable-next-line quote-props
          // sort: { 'createdAt': -1 },
          skip: (page - 1) * perPage,
          limit: perPage
        }
      }
    });
    invariant(category !== null, new NotFoundError('해당하는 카테고리가 존재하지 않습니다.'));

    const total = await PostModel.count({ category: categoryId });
    const totalPage = Math.ceil(total / perPage);

    const result = category.posts.map(post => {
      const likeUserList = post.likeUserList.map(v => String(v));
      return {
        _id: post._id,
        imageList: post.imageList,
        content: post.content,
        likeUserList,
        likesNum: post.likesNum,
        isLiked: authId ? likeUserList.includes(authId) : false,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        authId: post.authId
      };
    });
    return {
      page, perPage, result, totalPage
    };
  }

  async deletePostCommentId(commentId: string, currentAuthId: string) {
    const comment = await CommentModel.findById(commentId);
    invariant(comment !== null, new NotFoundError('해당하는 댓글이 존재하지 않습니다.'));
    await PostModel.findOneAndUpdate(comment.refPost, { $pull: { comments: commentId } });
  }

  async isWrittenByCurrentUser(postId: string, currentAuthId: string): Promise<boolean> {
    const targetComment = await PostModel.findById(postId); // null

    invariant(targetComment !== null, new NotFoundError(`${postId} Post가 존재하지 않습니다.`));
    return targetComment.authId.toString() === currentAuthId;
  }

  async findAllCommentAtPost(postId: string) {
    const post = await PostModel.findById(postId)
      .populate({
        path: 'comments'
      });

    invariant(post !== null, new NotFoundError('해당하는 포스트가 존재하지 않습니다.'));
    invariant(post.comments !== undefined, new NotFoundError('해당하는 댓글이 존재하지 않습니다.'));

    const authIdList = post.comments.map(comment => comment.authId);

    const userList = await UserModel.find({ auth: authIdList }, undefined, {
      select: 'auth username imgUrl'
    });

    const userMap = new Map<string, Pick<UserT, 'username' | 'imgUrl'> & { _id: string }>();
    userList.forEach(user => {
      const authId = String(user.auth);
      userMap.set(authId, {
        _id: String(user._id),
        username: user.username,
        imgUrl: user.imgUrl
      });
    });
    return post.comments.map((comment, i) => ({
      _id: comment._id,
      refPost: comment.refPost,
      userId: userMap.get(String(authIdList[i])),
      comment: comment.comment,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt
    }));
  }

  async addcommentList(postId: string, commentId: string) {
    await PostModel.findByIdAndUpdate(postId, { $push: { comments: commentId } });
  }

  async findAll() {
    const posts = await PostModel.find({}, undefined, {
      populate: {
        path: 'category',
        select: 'categoryName',
        transform: doc => doc.categoryName
      }
    });
    invariant(posts.every(post => typeof post.category === 'string'), '카테고리가 존재하지 않습니다.');

    return posts;
  }

  async isExistPost(postId: string) {
    const post = await PostModel.exists({ _id: postId });
    return post !== null;
  }

  async findPost(postId: string, authId: string | undefined) {
    const post = await PostModel.findById(postId);
    invariant(post !== null, new NotFoundError('해당하는 Post가 존재하지 않습니다.'));
    const likeUserList = post.likeUserList.map(v => String(v));
    return {
      _id: post._id,
      category: post.category,
      imageList: post.imageList,
      content: post.content,
      likeUserList,
      likesNum: post.likesNum,
      isLiked: authId ? likeUserList.includes(authId) : false,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      authId: post.authId
    };
  }

  async createOne(newPost: createPostDto, categoryId: createCategoryDto, authId: string) {
    const newPostId = await PostModel.create({
      authId,
      category: categoryId,
      content: newPost.content,
      imageList: newPost.imageList
    });
    await CategoryModel.findByIdAndUpdate(categoryId, { $push: { posts: newPostId.id } });
  }

  async deleteOne(postId: string) {
    const post = await PostModel.findById(postId);
    invariant(post !== null, new NotFoundError('해당하는 Post가 존재하지 않습니다.'));

    await CategoryModel.findByIdAndUpdate(post.category, { $pull: { posts: postId } });
    await CommentModel.deleteMany({ _id: post.comments });
    await PostModel.findByIdAndDelete(postId);
  }

  async updateOne(postId: string, toUpdatePost: updatePostDto) {
    const category = await CategoryModel.exists({ categoryName: toUpdatePost.category });
    invariant(category !== null, new NotFoundError('해당하는 카테고리가 존재하지 않습니다.'));

    // 포스트 정보 변경
    await PostModel.updateMany(
      { _id: postId },
      {
        category: category._id,
        content: toUpdatePost.content,
        imageList: toUpdatePost.imageList
      }
    );
  }
}
