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
    return (
        <div className='article'>
            <h2 className="article-title">{props.article.title}</h2>
            <p className="article-content">{props.article.body}</p>
        </div>
    )
}

export default Article