import { Button, Stack, TextField,} from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'
import { ErrorMessage } from '@hookform/error-message';
import axios from 'axios';
import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { User } from '../App';
import '../styles/Login.css'

interface LoginProps {
    user: User
    setUser: Dispatch<SetStateAction<User>>
}

const Login: FC<LoginProps> = (props) => {
    useEffect(() => {
        if(props.user) {
            window.location.href = window.location.origin
        }
    }, [props.user])

    const formSchema = z.object({
        email: z.string().email(),
        password: z.string().min(1)
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
        axios.post('/auth/login', {
            email: data.email,
            password: data.password,
        }).then((res) => {
            localStorage.setItem('user', JSON.stringify(res.data))
            props.setUser(res.data)
            window.location.href = window.location.origin
        }).catch((err) => {
            console.error(err)
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>Prihlasenie</h1>
                <Stack spacing={2} direction='column' width={400}>
                    <TextField {...register('email')} label='Email' type='email'/>
                    <ErrorMessage errors={errors} name='email'/>
                    <TextField {...register('password')} label='Password' type='password'/>
                    <ErrorMessage errors={errors} name='password'/>
                </Stack>
                <Button disabled={isSubmitting} type='submit' variant='contained' color='primary'>Prihlasiť</Button>
            </form>
            <a className='register-link' href='/register'>Vytvoriť účet</a>
        </div>
    )
}

export default Login