import { Button, IconButton, InputAdornment, Stack, TextField, Tooltip,} from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'
import { ErrorMessage } from '@hookform/error-message';
import axios from 'axios';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { User } from '../App';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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
        email: z.string().email('Uveďte email v spravnom formate abc@abc.abc'),
        password: z.string().min(1, 'Heslo nesmie byť prázdne!')
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
        axios.post('/auth/login', {
            email: data.email,
            password: data.password,
        }).then((res) => {
            localStorage.setItem('user', JSON.stringify(res.data))
            props.setUser(res.data)
            window.location.href = window.location.origin
        }).catch((err) => {
            console.error(err)
            setError('root', {message: err.response.data.message})
        })
    }

    return (
        <div className='flex justify-center items-center mt-40'>
            <div className='w-96 p-6 shadow-lg bg-stone-100 rounded-3xl'>
                <h1 className='text-3xl'>Prihlasenie</h1>
                <hr className='m-3'/>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='m-3'>
                        <TextField {...register('email')} label='Email' type='email' className='w-full'/>
                        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                    </div>
                    <div className='m-3'>
                    <TextField {...register('password')} className='w-full' label='Password' type={showPassword ? 'text' : 'password'}
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
                        {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                    </div>
                    <div className='m-3'>
                       {errors.root && <p className='text-red-500'>{errors.root.message}</p>}
                    </div>
                    <hr className='m-3'/>
                    <Button disabled={isSubmitting} type='submit' variant='contained' color='primary'>Prihlasiť</Button>
                </form>
                <a className='mt-5 text-blue-500' href='/register'>Nemate učet? Vytvoriť účet</a>
            </div>
        </div>
    )
}

export default Login