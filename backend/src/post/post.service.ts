import { PostRepository } from './post.repository';
import { CategoryRepository } from '../category/category.repository';
import invariant from '../utils/invariant';
import { NotFoundError } from '../errors/NotFoundError';
import { ForbiddenError } from '../errors/ForbiddenError';

const postRepository = new PostRepository();
const cateogryRepository = new CategoryRepository();

export class PostService implements IPostService {
  // eslint-disable-next-line consistent-return
  async addlikeUserId(currentAuthId: string, postId: string): Promise<boolean | undefined> {
    // 이미 좋아요 했는지 검증
    const isLiked = await postRepository.isLikedByPostId(currentAuthId, postId);

    // 좋아요를 누르지 않았다면 ->좋아요 증가
    if (isLiked === null) {
      await postRepository.addLike(currentAuthId, postId);
      return true;

    // 좋아요를 눌렀다면 -> 좋아요 감소
    } if (isLiked !== null) {
      await postRepository.subtractLike(currentAuthId, postId);
      return false;
    }
  }

  async paginationPost(categoryId: string, page: number, perPage: number, authId?: string) {
    const pagingPosts = await postRepository.paginationPost(categoryId, page, perPage, authId);
    return pagingPosts;
  }

  async createPost(createPostInfo: createPostDto, authId: string) {
    // 카테고리 존재 검증
    const categoryId = await cateogryRepository.findCategory(createPostInfo.category);
    invariant(categoryId !== null, new NotFoundError(`${createPostInfo.category} 카테고리가 존재하지 않습니다.`));

    await postRepository.createOne(createPostInfo, categoryId._id, authId);
  }

  async deletePost(postId: string, currentAuthId: string) {
    invariant(
      await postRepository.isWrittenByCurrentUser(postId, currentAuthId),
      new ForbiddenError(`${postId}의 저자만 삭제할 수 있습니다.`)
    );
    await postRepository.deleteOne(postId);
  }

  // async isWrittenByCurrentUser(postId: string, currentAuthId: string) {
  //   await postRepository.isWrittenByCurrentUser(postId, currentAuthId);
  // }

  async updatePost(updatedContents: updatePostDto, postId: string, currentAuthId: string) {
    const { category, content, imageList } = updatedContents;
    invariant(
      await postRepository.isWrittenByCurrentUser(postId, currentAuthId),
      new ForbiddenError(`${postId}의 저자만 수정할 수 있습니다.`)
    );

    const toUpdatePost = {
      ...(category && { category }),
      ...(content && { content }),
      ...(imageList && { imageList })
    };
    await postRepository.updateOne(postId, toUpdatePost);
  }

  // ADMIN
  async findAllPost() {
    const totalPostInfo = await postRepository.findAll();
    return totalPostInfo;
  }

  async findOnePost(id: string, authId: string | undefined) {
    const postInfo = await postRepository.findPost(id, authId);
    return postInfo;
  }
}
