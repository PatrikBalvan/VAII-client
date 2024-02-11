import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { User } from '../App';
import axios from 'axios'
import { Link, useParams } from 'react-router-dom';
import { ArticleType } from '../components/Article';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Button, IconButton } from '@mui/material';

interface ArticleSiteProps {
    user: User
    setUser: Dispatch<SetStateAction<User>>
}

const ArticleSite: FC<ArticleSiteProps> = (props) => {
    const { articleId } = useParams()

    const [article, setArticle] = useState<ArticleType>()
    const [articleLikes, setArticleLikes] = useState(0)
    const [existingLike, setExistingLike] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

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
    },[articleId])

    useEffect(() => {
        setIsLoading(true)
        axios.get(`/articleLikes/${articleId}`, {
            params: {
                articleId: articleId
            }
        })
            .then((res) => {
                setArticleLikes(res.data.likes)
            })
            .catch((err) => {
                console.error(err)
            })

        axios.get('/like', {
            headers: {
                Authorization: `Bearer ${props.user?.token}`
            },
            params: {
                articleId: articleId,
                userId: props.user?._id
            }
        })
            .then((res) => {
                setExistingLike(res.data.likes === 1)
                setIsLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setExistingLike(false)
            })

    }, [articleId, props.user, existingLike])

    const likeHandler = async () => {
        setIsLoading(true)
        if(!existingLike) {
            await axios.post('/like', {
                articleId: articleId,
                userId: props.user?._id
            }, {
                headers: {
                    Authorization: `Bearer ${props.user?.token}`
                }
            })
            .then((res) => {
                setIsLoading(false)
                setExistingLike(true)
            })
            .catch((err) => {
                console.error(err)
            })
        } else {
            await axios.delete('/like', {
                headers: {
                    Authorization: `Bearer ${props.user?.token}`
                },
                params: {
                    articleId: articleId,
                    userId: props.user?._id
                }
            })
            .then((res) => {
                setIsLoading(false)
                setExistingLike(false)
            })
            .catch((err) => {
                console.error(err)
            })
        }
    }

    if(!article) {
        return (
            <></>
        )
    }

    return (
        <div>
            <div className='ml-5 md:ml-28 mr-5 md:mr-28 mt-5 p-4 shadow-lg bg-stone-100 rounded-3xl'>
                <h2 className='text-2xl font-bold'>{article.title}</h2>
                <p className=''>{article.body}</p>
            </div>
            <div className='flex ml-28'>
                <IconButton disabled={isLoading} onClick={likeHandler} sx={{color: existingLike ? 'dodgerblue' : ''}}>
                    <ThumbUpIcon></ThumbUpIcon>
                </IconButton>
                <h4 className='mt-2'>{articleLikes}</h4>
            </div>
        </div>
    )
}

export default ArticleSite