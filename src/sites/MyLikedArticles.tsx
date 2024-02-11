import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import ArticleList from "../components/ArticleList"
import Login from "./Login"
import { User } from "../App"
import '../styles/Home.css'
import Article, { ArticleType } from "../components/Article"
import axios from 'axios'
import { Button } from "@mui/material"
import { Navigate } from "react-router-dom"

interface MyLikedArticlesProps {
    user: User
    setUser: Dispatch<SetStateAction<User>>
}

const MyLikedArticles: FC<MyLikedArticlesProps> = (props) => {

    const [articles, setArticles] = useState<ArticleType[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        axios.get(`/userLikes/${props.user?._id}`, {
        headers: {
            Authorization: `Bearer ${props.user?.token}`
        },
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

export default MyLikedArticles