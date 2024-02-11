import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { User } from '../App';
import axios from 'axios'
import { Link, useParams } from 'react-router-dom';
import { ArticleType } from '../components/Article';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import EditIcon from '@mui/icons-material/Edit';
import { Button, IconButton } from '@mui/material';

interface ArticleSiteProps {
    user: User
    setUser: Dispatch<SetStateAction<User>>
}

const ArticleSite: FC<ArticleSiteProps> = (props) => {
    const { articleId } = useParams()

    const [article, setArticle] = useState<ArticleType>()
    const [isEditor, setIsEditor] = useState(false)
    const [author, setAuthor] = useState()
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
        axios.get(`/users/isEditor/${props.user?._id}`, {
            headers: {
                Authorization: `Bearer ${props.user?.token}`
            }
        })
        .then((res) => {
            if(res.status === 200) {
                setIsEditor(true)
            }
        })
        .catch((err) => {
            console.error(err)
        })
    }, [props.user])

    useEffect(() => {
        axios.get(`/users/${article?.authorId}`)
        .then((res) => {
            setAuthor(res.data.username)
        })
        .catch((err) => {
            console.error(err)
        })
    }, [article])

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

    const createdDate = new Date(article.createdAt)

    return (
        <div>
            <div className='ml-5 md:ml-28 mr-5 md:mr-28 mt-5 p-4 shadow-lg bg-stone-100 rounded-3xl'>
                <h2 className='text-2xl font-bold'>{article.title}</h2>
                <p className=''>{article.body}</p>
                <p className=''>Napisal {author} dňa {createdDate.toLocaleDateString()}</p>
            </div>
            <div className='flex ml-28'>
                <IconButton disabled={isLoading} onClick={likeHandler} sx={{color: existingLike ? 'dodgerblue' : ''}}>
                    <ThumbUpIcon></ThumbUpIcon>
                </IconButton>
                <h4 className='mt-2'>{articleLikes}</h4>
                {isEditor &&
                <IconButton onClick={() => {window.location.href = `/editArticle/${articleId}`}}>
                    <EditIcon></EditIcon>
                </IconButton>}
            </div>
        </div>
    )
}

export default ArticleSite