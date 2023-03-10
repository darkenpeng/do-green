import React from 'react';

import CardSkeleton from '../loadings/CardSkeleton';
import Card from './Card';

import useNews from '../../hooks/useNews';

export default function NewsCards() {
  const {
    newsQuery: { data: news },
  } = useNews();
  return (
    <div className="flex flex-wrap">
      {news === undefined ? (
        <CardSkeleton />
      ) : (
        news.map((item) => (
          <Card
            id={item._id}
            key={item._id}
            img={item.imageList[0]}
            name={item.category}
            description={item.content}
            cardtype="post"
          />
        ))
      )}
    </div>
  );
}
