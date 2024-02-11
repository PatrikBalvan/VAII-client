import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { User } from '../App';
import axios from 'axios'
import { useParams } from 'react-router-dom';
import { ArticleType } from '../components/Article';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import EditIcon from '@mui/icons-material/Edit';
import { Button, IconButton, TextField } from '@mui/material';
import '../styles/Article.css'

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
    const [commentContent, setCommentContent] = useState('')
    const [reloadComments, setReloadComments] = useState(false)
    const [comments, setComments] = useState<any[]>([])

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

    useEffect(() => {
        axios.get(`/comments/${articleId}`)
            .then((res) => {
                setComments(res.data)
            })
            .catch((err) => {
                console.error(err)
            })
        setReloadComments(false)
    }, [reloadComments])

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

    const addCommentHandler = async () => {
        axios.post('/comment', {
            articleId: articleId,
            userId: props.user?._id,
            body: commentContent
        }, {
            headers: {
                Authorization: `Bearer ${props.user?.token}`
            }
        })
        .then((res) => {
            setReloadComments(true)
        })
        .catch((err) => {
            console.error(err)
        })
    }

    const onDeleteHandler = async (id: string) => {

        await axios.delete(`/comment/${id}`, {
            headers: {
                Authorization: `Bearer ${props.user?.token}`
            }
        })
        .then((res) => {
            setReloadComments(true)
        })
        .catch((err) => {
            console.error(err)
        })
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
            <div className='flex ml-10 md:ml-28'>
                <IconButton disabled={isLoading} onClick={likeHandler} sx={{color: existingLike ? 'dodgerblue' : ''}}>
                    <ThumbUpIcon></ThumbUpIcon>
                </IconButton>
                <h4 className='mt-2'>{articleLikes}</h4>
                {isEditor &&
                <IconButton onClick={() => {window.location.href = `/editArticle/${articleId}`}}>
                    <EditIcon></EditIcon>
                </IconButton>}
            </div>
            <h1 className='comments-title'>Komentáre</h1>
            {
                comments.map((item) => (
                    <div key={item._id} className='ml-5 md:ml-28 mr-5 md:mr-28 mt-5 p-4 shadow-lg bg-stone-100 rounded-3xl'>
                        <p className='comment-body'>{item.body}</p>
                        <p className='comment-author'>Napisal {item.username} dňa {item.createdAt}</p>
                        {isEditor && <Button variant='contained' color='error' onClick={() => {
                            onDeleteHandler(item._id)
                        }}>Zmazať</Button>}
                    </div>
                ))
            }
            {props.user && 
            <div className='ml-5 md:ml-28 mr-5 md:mr-28 mt-5 p-4 shadow-lg bg-stone-100 rounded-3xl'>
                <h4 className='mt-2'>Pridať komentar</h4>
                <TextField fullWidth inputProps={{maxLength: 150}} value={commentContent} onChange={(event) => {setCommentContent(event.target.value)}}/>
                <Button variant='contained' onClick={addCommentHandler}>Odoslať</Button>
            </div>}
        </div>
    )
}

export default ArticleSite