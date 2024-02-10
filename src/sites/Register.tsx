import { Button, Stack, TextField, InputAdornment, IconButton, Tooltip } from '@mui/material'
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'
import { ErrorMessage } from '@hookform/error-message';
import axios from 'axios';
import { User } from '../App';

interface RegisterProps {
    user: User
    setUser: Dispatch<SetStateAction<User>>
}

const Register: FC<RegisterProps> = (props) => {
    useEffect(() => {
        if(props.user) {
            window.location.href = window.location.origin
        }
    }, [props.user])

    const formSchema = z.object({
        email: z.string().email(),
        username: z.string().min(1,'Required field').min(5, 'Atleast 5 chars'),
        password: z.string().min(8)
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

    const [showPassword, setShowpassword] = useState<boolean>(false)

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        console.log(data)
        axios.post('/auth/register', {
            email: data.email,
            password: data.password,
            username: data.username
        }).then((res) => {
            localStorage.setItem('user', JSON.stringify(res.data))
            props.setUser(res.data)
            window.location.href = window.location.origin
        }).catch((err) => {
            console.error(err)
        })
    }

    return (
        <>
            <h1>Registrácia</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2} direction='column' width={400}>
                    <TextField {...register('email')} label='Email' type='email'/>
                    <ErrorMessage errors={errors} name='email'/>
                    <TextField {...register('username')} label='Username'/>
                    <ErrorMessage errors={errors} name='username'/>
                    <TextField {...register('password')} label='Password' type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title={showPassword ? 'Skryť heslo' : 'Zobraziť heslo'}>
                                        <IconButton onClick={()=>{setShowpassword(!showPassword)}}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </Tooltip>
                                    
                                </InputAdornment>
                            )
                        }}
                    />
                    <ErrorMessage errors={errors} name='password'/>
                </Stack>
                <Button disabled={isSubmitting} type='submit' variant='contained' color='primary'>Registrovať</Button>
            </form>
        </>
    )
}

export default Register