import { Dispatch, FC, SetStateAction, useEffect } from "react"
import { User } from "../App"
import { SubmitHandler, useForm } from "react-hook-form"
import axios from 'axios'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, TextField } from "@mui/material"

interface CreateArticleProps {
    user: User
    setUser: Dispatch<SetStateAction<User>>
}

const CreateArticle: FC<CreateArticleProps> = (props) => {  
    useEffect(() => {
        if(!props.user) {
            window.location.href = '/'
        }

        axios.get(`/users/isEditor/${props.user?._id}`, {
          headers: {
            Authorization: `Bearer ${props.user?.token}`
          }
        })
        .then((res) => {
          if(res.status !== 200) {
            window.location.href = '/'
          }
        })
        .catch((err) => {
          console.error(err)
          window.location.href = '/'
        })
      },[props.user])

    const formSchema = z.object({
        title: z.string()
            .min(1, 'Nadpis nesmie byť prázdny!')
            .max(50, 'Nadpis nesmie mať viac ako 50 znakov!'),
        body: z.string().min(1, 'Obsah nesmie byť prázdny!')
    })
    
    type FormFields = z.infer<typeof formSchema>

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        resolver: zodResolver(formSchema)
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        axios.post('/articles', {
            title: data.title,
            body: data.body
        }, {
            headers: {
                Authorization: `Bearer ${props.user?.token}`
            }
        })
        .then((res) => {
            window.location.href = '/'
        })
        .catch((err) => {
            console.error(err)
        })
    }

    return (
        <div className='flex justify-center items-center m-5'>
            <div className='w-full p-6 shadow-lg bg-stone-100 rounded-3xl'>
                <h1 className='text-3xl'>Novy artikel</h1>
                <hr className='m-3'/>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='m-3'>
                        <TextField {...register('title')} label='Nadpis' type='text' className='w-full'/>
                        {errors.title && <p className='text-red-500'>{errors.title.message}</p>}
                    </div>
                    <div className='m-3 h-80'>
                        <TextField {...register('body')} multiline={true} minRows={12} className='w-full' label='Obsah' type='text'/>
                        {errors.body && <p className='text-red-500'>{errors.body.message}</p>}
                    </div>
                    <div className='m-3'>
                       {errors.root && <p className='text-red-500'>{errors.root.message}</p>}
                    </div>
                    <hr className='m-3'/>
                    <Button disabled={isSubmitting} type='submit' variant='contained' color='primary'>Vytvoriť</Button>
                </form>
            </div>
        </div>
    )
}

export default CreateArticle