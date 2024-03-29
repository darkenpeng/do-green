import React, { useEffect, useState, Fragment, FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { FaHeart } from 'react-icons/fa';
import { ImBubble } from 'react-icons/im';
import useComment, { IComment } from '../../hooks/useComment';
import Loading from '../loadings/Loading';
import Modal from '../common/Modal';
import { useUserInfo } from '../../hooks/useUser';
import NewsCarousel from './NewsCarousel';
import usePost, { IPost } from '../../hooks/usePost';
import { DialogModal } from '../common/DialogModal';
import { useModalState } from '../../hooks/useModalState';

const Theme = {
  NewsTheme: {
    postContainer:
      'flex flex-col w-10/12 h-full  bg-slate-50 shadow-2xl rounded-lg overflow-hidden md:w-9/12 dark:bg-zinc-800 lg:w-8/12',
    footer: 'flex justify-between  px-6 py-2 rounded-b-lg bg-gradient-to-r from-gardenBG to-garden4 dark:from-forest4',
  },
  CommentTheme: {
    container: 'flex flex-col w-96 h-96 rounded-md bg-gray-50 dark:bg-zinc-800 overflow-hidden',
    form: 'flex justify-between px-2 py-4 bg-gradient-to-r from-gardenBG to-garden4 dark:from-forest4',
    input:
      'flex-auto mx-2 py-1 rounded-md bg-slate-50 text-gray-800 focus:outline-none focus:ring-4 focus:ring-garden3',
    button:
      'mx-2 px-2 rounded-md bg-garden4 text-gray-50 font-semibold transition duration-0 hover:scale-110 hover:duration-700',
  },
};

interface INews extends IPost {
  categoryName: string;
  categoryImg: string;
  categoryId: string;
}

export default function NewsCard(props: INews) {
  const { username } = useUserInfo((state) => state.userInfo);
  const [clickComment, setClickComment] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const { ref, inView } = useInView();
  const { isOpen, handleOpen, handleClose, handleToggle } = useModalState();
  const isLoggedIn = useUserInfo((state) => state.existUser);
  const {
    addComment,
    removeComment,
    commentQuery: { status, fetchNextPage, hasNextPage, data },
  } = useComment(props._id);
  const { addLike } = usePost();

  useEffect(() => {
    handleClose();
  }, []);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.length === 0) return;
    addComment.mutate({ postId: props._id, comment: inputValue });
    setInputValue('');
  };

  const handleFocus = (e: React.FocusEvent<HTMLFormElement>) => {
    if (!isLoggedIn) {
      handleOpen();
      e.target?.blur();
    }
  };

  const handleClickLike = (post: IPost) => {
    if (!isLoggedIn) {
      handleOpen();
      return;
    }
    addLike.mutate(post);
  };

  const handleDelete = (commentId: string) => {
    removeComment.mutate(commentId);
  };

  return (
    <div className="flex w-full h-full justify-center pt-20 py-6 px-6 bg-gardenBG">
      <div className="flex flex-col mr-4 items-center">
        <Link to={`/categories/${props.categoryId}`}>
          <img className={'rounded-full w-12 h-12 shadow-xl'} src={props.categoryImg} alt="펭귄" />
        </Link>
        <span className="font-semibold">{props.categoryName}</span>
      </div>
      <div className={Theme.NewsTheme.postContainer}>
        <div className="flex relative justify-center mt-6 rounded-t-md">
          {props.imageList.length !== 0 && props.imageList[0] !== null && <NewsCarousel imageList={props.imageList} />}
        </div>
        <span className="w-full px-6 pb-6 text-md whitespace-pre-wrap dark:text-slate-50">{props.content}</span>
        <div className={Theme.NewsTheme.footer}>
          <div className="flex items-center">
            <FaHeart
              className={
                ' w-6 h-6 mr-4 hover:cursor-pointer ' +
                (isLoggedIn && props.isLiked ? 'text-red-400' : 'dark:text-slate-50')
              }
              onClick={() =>
                handleClickLike({
                  _id: props._id,
                  content: props.content,
                  imageList: props.imageList,
                  createdAt: props.createdAt,
                  updatedAt: props.updatedAt,
                  likesNum: props.isLiked ? props.likesNum - 1 : props.likesNum + 1,
                  isLiked: !props.isLiked,
                })
              }
            />
            <ImBubble
              className={'mr-4 w-6 h-6 hover:cursor-pointer dark:text-slate-50'}
              onClick={() => setClickComment(!clickComment)}
            />
            {props.likesNum !== 0 && (
              <div className="pr-4 text-sm text-garden4 font-semibold">{props.likesNum} 명이 이 글을 좋아합니다.</div>
            )}
          </div>
          <span className=" text-slate-50 font-semibold text-sm">
            {props.createdAt.split('.')[0].replace(/T/, '  ')}
          </span>
        </div>
      </div>
      {clickComment && (
        <Modal
          onClose={() => {
            setClickComment(!clickComment);
          }}
        >
          <div className={Theme.CommentTheme.container}>
            <div className="flex-auto w-full overflow-y-scroll">
              {data?.pages.map((page, index) => (
                <Fragment key={index}>
                  {page.result.map((comment: IComment) => (
                    <div className={'flex mx-4 my-4'} key={comment._id}>
                      <img src={comment.userId.imgUrl} alt="사진" className="w-7 h-7 rounded-full bg-garden4" />
                      <div className="flex flex-col w-full ml-2">
                        <span className="text-sm font-semibold text-gray-400">{comment.userId.username}</span>
                        <div className={'flex flex-col relative justify-between w-full h-auto'}>
                          {username === comment.userId.username && (
                            <button
                              className="absolute right-0 z-10 mt-1 px-1 bg-red-400 rounded-sm text-sm text-white transition-all hover:scale-105"
                              onClick={() => handleDelete(comment._id)}
                            >
                              삭제
                            </button>
                          )}
                          <p className={'mr-8 text-md font-medium text-gray-400'}>{comment.comment}</p>
                          <p className="text-sm font-thin  text-gray-400">
                            {comment.createdAt.split('.')[0].replace(/T/, '  ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </Fragment>
              ))}
              {(hasNextPage || status === 'loading') && <Loading instance={ref} />}
            </div>
            <form onSubmit={handleSubmit} className={Theme.CommentTheme.form} onFocus={handleFocus}>
              <input type="text" className={Theme.CommentTheme.input} onChange={handleChange} value={inputValue} />
              <button className={Theme.CommentTheme.button}>ADD</button>
            </form>
          </div>
        </Modal>
      )}
      {isOpen && (
        <DialogModal title="로그인" message="로그인이 필요한 서비스입니다." type="alert" onClose={handleClose} />
      )}
    </div>
  );
}
