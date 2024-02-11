import { FC, useEffect, useState } from 'react';
import { User } from '../App';
import axios from 'axios'
import { Link, useParams } from 'react-router-dom';
import { ArticleType } from '../components/Article';

const ArticleSite: FC = (props) => {
    const { articleId } = useParams()

    const [article, setArticle] = useState<ArticleType>()

    useEffect(() => {
        axios.get(`/article/${articleId}`, {
            params: {
                articleId: articleId
            }
        })
        .then((res) => {
            setArticle(res.data)
        })
        .catch((err) => {
            console.error(err)
        })
    }, [articleId])

    if(!article) {
        return (
            <></>
        )
    }

    return (
        <div className='ml-28 mr-28 mt-5 p-4 shadow-lg bg-stone-100 rounded-3xl'>
            <h2 className='text-2xl font-bold'>{article.title}</h2>
            <p className=''>{article.body}</p>
        </div>
    )
}

export default ArticleSite