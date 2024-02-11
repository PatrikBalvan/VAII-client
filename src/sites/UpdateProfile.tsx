import { Button, IconButton, InputAdornment, TextField, Tooltip,} from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'
import axios from 'axios';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { User } from '../App';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Navigate } from 'react-router-dom';

interface ProfileProps {
    user: User
    setUser: Dispatch<SetStateAction<User>>
}

const UpdateProfile: FC<ProfileProps> = (props) => {
    const formSchema = z.object({
        email: z.string().email('Uveďte email v spravnom formate abc@abc.abc'),
        username: z.string()
            .min(1,'Úživateľské meno nesmie byť prázdne!')
            .min(5, 'Úživateľské meno musi mať aspoň 5 znakov!')
            .max(10, 'Úživateľské meno musi mať najviac 10 znakov!'),
        newPassword: z.string()
            .min(8, 'Heslo musi mať aspoň 8 znakov!')
            .max(15, 'Heslo musi mať najviac 15 znakov!').optional().or(z.literal(''))
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

    const [showPassword, setShowpassword] = useState<boolean>(false)

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
            setError('root', {message: err.response.data.message})
        })
    }

    if(!props.user) {
        return (
            <Navigate to='/'/>
        )
    }

    return (
        <div className='flex justify-center items-center mt-40'>
            <div className='w-96 p-6 shadow-lg bg-stone-100 rounded-3xl'>
                <h1 className='text-3xl'>Úprava udajov</h1>
                <hr className='m-3'/>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='m-3'>
                        <TextField {...register('email')} label='E-mail' type='email' className='w-full'/>
                        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                    </div>
                    <div className='m-3'>
                        <TextField {...register('username')} label='Úživateľské meno' className='w-full'/>
                        {errors.username && <p className='text-red-500'>{errors.username.message}</p>}
                    </div>
                    <div className='m-3'>
                    <TextField {...register('newPassword')} className='w-full' label='Nové heslo' type={showPassword ? 'text' : 'password'}
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
                        {errors.newPassword && <p className='text-red-500'>{errors.newPassword.message}</p>}
                    </div>
                    <div className='m-3'>
                       {errors.root && <p className='text-red-500'>{errors.root.message}</p>}
                    </div>
                    <hr className='m-3'/>
                    <Button disabled={isSubmitting} type='submit' variant='contained' color='primary'>Odoslať</Button>
                </form>
            </div>
        </div>
    )
}

export default UpdateProfile