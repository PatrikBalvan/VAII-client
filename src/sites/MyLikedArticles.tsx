import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { User } from "../App"
import Article, { ArticleType } from "../components/Article"
import axios from 'axios'
import { Button, MenuItem, Select, Stack } from "@mui/material"
import { Navigate } from "react-router-dom"

interface MyLikedArticlesProps {
    user: User
    setUser: Dispatch<SetStateAction<User>>
}

const MyLikedArticles: FC<MyLikedArticlesProps> = (props) => {

    const [articles, setArticles] = useState<ArticleType[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [articlesPerPage, setArticlesPerPage] = useState(5)

    useEffect(() => {
        axios.get(`/userLikes/${props.user?._id}`, {
        headers: {
            Authorization: `Bearer ${props.user?.token}`
        },
        params: {
            page: currentPage,
            articlesPerPage: articlesPerPage
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
    },[currentPage, articlesPerPage])

    if(!props.user) {
        return (
            <Navigate to='/'/>
        )
    }

    return (
        <div>
            {
            articles.map((art) => (
                <Article key={art._id} article={art}/>
            ))
            }
            <div className='flex justify-center items-center'>
                <Stack spacing={2} direction={'row'}>
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
                    disabled={articles.length < articlesPerPage || isLoading} 
                    onClick={() => {
                        setCurrentPage(currentPage+1)
                        setIsLoading(true)
                    }}
                    >Ďalšia strana</Button>
                </Stack>
            </div>
            <div className='flex justify-center items-center'>
                <p className='mr-5'>Počet artiklov na stranku</p>
                <Select
                label={'Počet artiklov'}
                value={articlesPerPage}
                onChange={(event)=>{setArticlesPerPage(+event.target.value)}}  
                >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                </Select>
            </div>
        </div>
    )
}

export default MyLikedArticles