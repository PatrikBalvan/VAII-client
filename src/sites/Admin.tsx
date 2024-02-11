import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { User } from "../App"
import axios from 'axios'
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Button, TextField } from "@mui/material"
import '../styles/Admin.css'

interface AdminProps {
    user: User
    setUser: Dispatch<SetStateAction<User>>
}

const Admin: FC<AdminProps> = (props) => {
    const [reload, setReload] = useState(false)
    const [admins, setAdmins] = useState([])
    const [editors, setEditors] = useState([])

    const [adminEmail, setAdminEmail] = useState('')
    const [editorEmail, setEditorEmail] = useState('')
    const [selectedAdmins, setSelectedAdmins] = useState<GridRowSelectionModel>()
    const [selectedEditors, setSelectedEditors] = useState<GridRowSelectionModel>()

    useEffect(() => {
        axios.get('/usersRole/admins', {
            headers: {
                Authorization: `Bearer ${props.user?.token}`
            }
        })
        .then((res) => {
            setAdmins(res.data)
        })
        .catch((err) => {
            console.log(err)
        })

        axios.get('/usersRole/editors', {
            headers: {
                Authorization: `Bearer ${props.user?.token}`
            }
        })
        .then((res) => {
            setEditors(res.data)
        })
        .catch((err) => {
            console.log(err)
        })

        setReload(false)
    }, [props.user, reload])

    const adminRows = admins.map((itm) => {
        return { id: itm['_id'], email: itm['email'], username: itm['username'] }
    })
    const editorRows = editors.map((itm) => {
        return { id: itm['_id'], email: itm['email'], username: itm['username'] }
    })

    const columns: GridColDef[] = [
        {field: 'username', headerName: 'Meno', minWidth: 150},
        {field: 'email', headerName: 'E-mail', minWidth: 150},
    ]

    const adminHandler = () => {
        if(selectedAdmins) {
            selectedAdmins.forEach((value) => {
                axios.patch(`/users/removeUserAdmin/${value.toString()}`, {}, {
                    headers: {
                        Authorization: `Bearer ${props.user?.token}`
                    }
                })
            })
        }
        setReload(true)
    }

    const editorHandler = () => {
        if(selectedEditors) {
            selectedEditors.forEach((value) => {
                axios.patch(`/users/removeUserEditor/${value.toString()}`, {}, {
                    headers: {
                        Authorization: `Bearer ${props.user?.token}`
                    }
                })
            })
        }
        setReload(true)
    }

    const adminAddHandler = () => {
        axios.patch(`/users/makeUserAdmin/${adminEmail}`, {}, {
            headers: {
                Authorization: `Bearer ${props.user?.token}`
            }
        })
        .then((res) => {
            console.log(res)
            setReload(true)
        })
        .catch((error) => {
            console.error(error)
        })
    }

    const editorAddHandler = () => {
        axios.patch(`/users/makeUserEditor/${editorEmail}`, {}, {
            headers: {
                Authorization: `Bearer ${props.user?.token}`
            }
        })
        .then((res) => {
            console.log(res)
            setReload(true)
        })
        .catch((error) => {
            console.error(error)
        })
    }

    return (
        <div className='container block'>
            <div className='md:flex'>
                <div className='admin-textfield'>
                    <h4 className='font-bold'>Pridať admina</h4>
                    <div className="flex items-center">
                        <TextField
                            placeholder="E-mail"
                            onChange={(event) => {setAdminEmail(event.target.value)}}/>
                        <Button className='send-button' onClick={adminAddHandler} variant='contained'>Odoslať</Button>
                    </div>
                </div>
                <div className='admin-textfield'>
                    <h4 className='font-bold'>Pridať editora</h4>
                    <div className="flex items-center">
                        <TextField
                            placeholder="E-mail"
                            onChange={(event) => {setEditorEmail(event.target.value)}}/>
                        <Button className='send-button' onClick={editorAddHandler} variant='contained'>Odoslať</Button>
                    </div>
                </div>
            </div>
            <div className='md:flex'>
                <div className='datagrid' style={{ height: 300, width: 600 }}>
                    <h1 className='font-bold'>Admini</h1>
                    <DataGrid
                        rows={adminRows}
                        columns={columns}
                        initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        onRowSelectionModelChange={(rows) => {
                            setSelectedAdmins(rows)
                        }}
                    />
                    <Button className='delete-button' variant='contained' color='error' onClick={adminHandler}>Odstraniť vybranych adminov</Button>
                </div>
                <div className='md:ml-20 ml-0 md:mt-2 mt-20' style={{ height: 300, width: 600 }}>
                    <h1 className='font-bold'>Editori</h1>
                    <DataGrid
                        rows={editorRows}
                        columns={columns}
                        initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        onRowSelectionModelChange={(rows) => {
                            setSelectedEditors(rows)
                        }}
                    />
                    <Button className='delete-button' variant='contained' color='error' onClick={editorHandler}>Odstraniť vybranych editorov</Button>
                </div>
            </div>
        </div>
    )
}

export default Admin