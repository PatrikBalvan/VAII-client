import { Button, Stack, TextField, InputAdornment, IconButton, FormControl, FormLabel, Typography, Tooltip } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'
import { ErrorMessage } from '@hookform/error-message';
import axios from 'axios';

const Users = () => {
    const [data, setData] = useState()

    useEffect(() => {
       axios.get('/users')
        .then((res) => {
            setData(res.data)
            console.log(res.data)
        })
        .catch((err) => {
            console.error(err)
        }) 
    }, [])
    

    return (
        <div>

        </div>
    )
}

export default Users