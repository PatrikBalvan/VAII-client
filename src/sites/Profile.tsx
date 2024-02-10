import { Button, Stack, TextField,} from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'
import { ErrorMessage } from '@hookform/error-message';
import axios from 'axios';
import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { User } from '../App';

interface ProfileProps {
    user: User
    setUser: Dispatch<SetStateAction<User>>
}

const Profile: FC<ProfileProps> = (props) => {
    useEffect(() => {
        if(!props.user) {
            window.location.href = window.location.origin
        }
    }, [props.user])

    const formSchema = z.object({
        email: z.string().email(),
        username: z.string().min(5),
        newPassword: z.string().min(8).optional().or(z.literal(''))
    })
    
    type FormFields = z.infer<typeof formSchema>

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: props.user?.email,
            username: props.user?.username
        }
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {

        axios.patch(`/users/${props.user?._id}`, {
            email: data.email,
            username: data.username,
            password: data.newPassword
        }, {
            headers: {
                Authorization: `Bearer ${props.user?.token}`
            }
        }).then((res) => {
            const newUser = JSON.parse(localStorage.getItem('user')!)
            newUser.email = res.data.email
            newUser.username = res.data.username
            localStorage.setItem('user', JSON.stringify(newUser))
            props.setUser({
                email: newUser.email,
                token: newUser.token,
                username: newUser.username,
                _id: newUser._id
            })
            window.location.href = window.location.origin
        }).catch((err) => {
            console.error(err)
        })
    }

    return (
        <>
            <h1>Profil</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2} direction='column' width={400}>
                    <TextField {...register('email')} label='Email' type='email'/>
                    <ErrorMessage errors={errors} name='email'/>
                    <TextField {...register('username')} label='Username' type='text'/>
                    <ErrorMessage errors={errors} name='username'/>
                    <TextField {...register('newPassword')} label='New password' type='password'/>
                    <ErrorMessage errors={errors} name='newPassword'/>
                </Stack>
                <Button disabled={isSubmitting} type='submit' variant='contained' color='primary'>Upraviť</Button>
            </form>
        </>
    )
}

export default Profile