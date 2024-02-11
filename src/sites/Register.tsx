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
        email: z.string().email('Uveďte email v spravnom formate abc@abc.abc'),
        username: z.string()
            .min(1,'Úživateľské meno nesmie byť prázdne!')
            .min(5, 'Úživateľské meno musi mať aspoň 5 znakov!'),
        password: z.string().min(8, 'Heslo musi mať aspoň 8 znakov!')
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
        <div className='flex justify-center items-center mt-40'>
            <div className='w-96 p-6 shadow-lg bg-stone-100 rounded-3xl'>
                <h1 className='text-3xl'>Registracia</h1>
                <hr className='m-3'/>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='m-3'>
                        <TextField {...register('email')} label='Email' type='email' className='w-full'/>
                        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                    </div>
                    <div className='m-3'>
                        <TextField {...register('username')} label='Username' className='w-full'/>
                        {errors.username && <p className='text-red-500'>{errors.username.message}</p>}
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
                       {errors.root && <p>{errors.root.message}</p>}
                    </div>
                    <hr className='m-3'/>
                    <Button disabled={isSubmitting} type='submit' variant='contained' color='primary'>Registrovať</Button>
                </form>
            </div>
        </div>
    )
}

export default Register