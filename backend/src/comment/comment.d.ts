type CommentT = {
    _id: Types.ObjectId,
    refPost: Types.ObjectId,
    authId: Types.ObjectId,
    comment: string,
    createdAt: Date;
    updatedAt: Date;
}

type updateCommentDto = Partial<Pick<CommentT, 'comment'>>
interface ICommentRepository {
    createComment: (comment: CommentT['comment'], postId: string, userId: string) => Promise<CommentT>
}
