import React from 'react';
import { Link } from 'react-router-dom';
const MyPageTabBar = () => {
  return (
    <div className="flex flex-col font-bold text-xl">
      <Link to="/mypage" className="mb-10 pl-8">
        마이페이지 홈
      </Link>
      <Link to="/mypage/editUser" className="mb-10 pl-8">
        내 정보 수정
      </Link>
      <Link to="/mypage/subscribe" className="mb-10 pl-8">
        내 구독 정보
      </Link>
    </div>
  );
};
export default MyPageTabBar;
