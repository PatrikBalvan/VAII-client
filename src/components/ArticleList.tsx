import { FC, useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Stack } from '@mui/material';
import Article, { ArticleType } from './Article';

const ArticleList: FC = (props) => {

  const [articles, setArticles] = useState<ArticleType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    axios.get('/articles', {
      params: {
        page: `${currentPage}`
      }
    })
      .then((res) => {
        setArticles(res.data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  },[currentPage])

  if(articles.length === 0) {
    return <></>
  }

  return (
    <div>
        {
          articles.map((art) => (
            <Article key={art._id} article={art}/>
          ))
        }
        <div className='flex justify-center items-center'>
          <Button 
            variant='contained' 
            disabled={currentPage===1 || isLoading} 
            onClick={() => {
              setCurrentPage(currentPage-1)
              setIsLoading(true)
            }}
          >Predošla strana</Button>
          <Button 
            variant='contained' 
            disabled={articles.length < 5 || isLoading} 
            onClick={() => {
              setCurrentPage(currentPage+1)
              setIsLoading(true)
            }}
          >Ďalšia strana</Button>
        </div>
    </div>
  )
}

export default ArticleList