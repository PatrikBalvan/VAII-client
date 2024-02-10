import { FC, useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Stack } from '@mui/material';
import Article, { ArticleType } from './Article';
import '../styles/ArticleList.css'

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
    <div className='article-list'>
        {
          articles.map((art) => (
            <Article key={art._id} article={art}/>
          ))
        }
        <Stack spacing={2} direction={'row'}>
          <Button variant='contained' onClick={() => {setCurrentPage(currentPage-1)}}>Predošla strana</Button>
          <Button variant='contained' onClick={() => {setCurrentPage(currentPage+1)}}>Ďalšia strana</Button>
        </Stack>
    </div>
  )
}

export default ArticleList