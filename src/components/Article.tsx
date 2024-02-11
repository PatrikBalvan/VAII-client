import { FC } from 'react';
import { Link } from 'react-router-dom';

export type ArticleType = {
    _id: string
    title: string
    body: string
    authorId: string
    createdAt: string
}

export interface ArticleInterface {
    article: ArticleType
}

const Article: FC<ArticleInterface> = (props) => {
    return (
        <div className='m-8 p-4 shadow-lg bg-stone-100 rounded-3xl'>
            <h2 className='text-2xl font-bold'>{props.article.title}</h2>
            <p className=''>{props.article.body.slice(0, 500)}</p>
            <Link className='text-blue-500' to={`/blog/${props.article._id}`}>Prečítať viac...</Link>
        </div>
    )
}

export default Article