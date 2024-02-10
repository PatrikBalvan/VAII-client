import { FC, useEffect, useState } from 'react';
import '../styles/Article.css'
import { User } from '../App';
import axios from 'axios'

export type ArticleType = {
    _id: string
    title: string
    body: string
    authorId: string
}

export interface ArticleInterface {
    article: ArticleType
}

const Article: FC<ArticleInterface> = (props) => {
    const [author, setAuthor] = useState<User>(undefined)

    useEffect(() => {
        if(props.article.authorId) {
            axios.get(`/users/${props.article.authorId}`)
                .then((res) => {
                    setAuthor(res.data)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
        
    }, [props.article.authorId])

    return (
        <div className='article'>
            <h2 className="article-title">{props.article.title}</h2>
            <p className="article-content">{props.article.body}</p>
            <p className="article-author">Napisal: {author ? author.username : ''}</p>
        </div>
    )
}

export default Article