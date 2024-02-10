import { FC, useEffect, useState } from 'react';
import axios from 'axios'
import { Button } from '@mui/material';
import Article, { ArticleType } from './Article';

const ArticleList: FC = (props) => {

  const [articles, setArticles] = useState<ArticleType[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    console.log(currentPage)
    axios.get('/articles', {
      params: {
        page: `${currentPage}`
      }
    })
      .then((res) => {
        setArticles(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
  },[currentPage])

  return (
    <div>
        {
          articles.map((art) => (
            <Article key={art._id} article={art}/>
          ))
        }
        <Button onClick={() => {console.log(articles)}}>Info</Button>
        <Button onClick={() => {setCurrentPage(currentPage-1)}}>-</Button>
        <Button onClick={() => {setCurrentPage(currentPage+1)}}>+</Button>
    </div>
  )
}

export default ArticleList