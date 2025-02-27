import { Card, Typography, TextField, Stack, Grid, Avatar, Paper } from "@mui/material";
import { Button } from "@mui/material";
import { React, useState, useEffect } from "react";
import CardContent from '@mui/material/CardContent';
import DeleteIcon from '@mui/icons-material/Delete';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useImgPreview } from "../../components/custom_hooks/useImgPrev";
import './style.css';
import {URL} from '../../components/constantes/globales.js';




const ImageAvatar = ({
    handleImage,
    handleImageChange,
    urlPreview,
    refId,
    defaultImg,
}) => {
    return (
        <Grid item container >
            <Avatar sx={{ width: 290, height: 290 }}
                src={urlPreview || defaultImg}
                className="defaultImg__style"
                alt="profile"
            />
            <button
                className="divImg__style--button"
                type="button"
                onClick={handleImage}
                disableRipple={true}
                disableFocusRipple={true}
            >
                <span
                    className={urlPreview ? 'bx bx-x icon_edit' : 'bx bxs-pencil icon_edit'
                    }
                />
            </button>
            <input
                type="file"
                encType="multipart/form-data"
                name="image"
                id={refId}
                className="hidden__style"
                onChange={handleImageChange}
                multiple={false}
            />
        </Grid>
    );
};

export default function CaretakerProfile() {
    const { stateImg, handleImageChange, handleImage, refId } = useImgPreview('pic');
    const { urlPreview } = stateImg;
    let history = useHistory();
    const [i] = useTranslation("global");
    const [userInfo, setUserInfo] = useState(0);
    console.log(userInfo)
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const options = {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${token}`,
                'content-type': 'application/json'
            },
        }
        fetch(`${URL}/user/`, options)
            .then(r => r.json())
            .then(d => setUserInfo(d))

    }, []);


    const handleDeleteUser = (event) => {

        event.preventDefault();
        const token = sessionStorage.getItem('token');
        const options = {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${token}`,
                'content-type': 'application/json'
            },
        }
        fetch(`${URL}/user/account`, options)
            .then(r => {
                console.log('primer then', r.status)
                if (r.status === 200) {
                    sessionStorage.removeItem('token')
                    history.push('/register')
                } else if (r.status === 400) {
                    alert('Ha ocurrido un error, sorry')
                }
            })
    };

    const handleProfileChange = (event) => {
        event.preventDefault()
        const token = sessionStorage.getItem('token');
        const formData = new FormData(event.currentTarget);

        const options = {
            method: 'PATCH',
            headers: {
                'authorization': `Bearer ${token}`,
            },
            body: formData,


        }
        fetch(`${URL}/user/modifyUser`, options)
            .then(r => {
                console.log(r)
                window.location.reload()
            })

    }

    // PONER MODAL DE AVISO DE CARGA CORRECTA Y REFRESCAR PÁGINA 
    // const handleClose = () => {setOpenModal(false)
    //                     MODO DE REFRESCO DE PÁGINA}
    //
    //
    //
    //
    return (

        <Stack flexDirection="column" flexWrap='wrap' >

            <Stack>
                <Typography variant="h3" sx={{marginLeft:"30px", marginTop:"30px"}}>
                    Hola {userInfo.name}
                </Typography>
                <Typography variant="body1" sx={{marginLeft:"30px"}} >
                    Aquí podrás actualizar tus datos.
                </Typography>
            </Stack>

            <Stack component='form'
                sx={{ backgroundColor: 'white' }}
                noValidate
                autoComplete='off'
                justifyContent='center'
                margin={3}
                spacing={3}
                onSubmit={handleProfileChange}
            >
                <Paper elevation={2} sx={{maxWidth:"300px", padding:"5px", marginLeft:'19px', marginBottom:"10px", marginTop:"10px"}}>
                    <ImageAvatar
                        handleImage={handleImage}
                        handleImageChange={handleImageChange}
                        urlPreview={urlPreview}
                        refId={refId}
                        defaultImg={userInfo ? `${URL}/public/images/${userInfo.pic}` : `${URL}/public/images/user.png`}
                        rounded
                    />
                </Paper>
                <Typography variant="body2" color="text.secondary">
                </Typography>
                <TextField id="outlined-basic" name="name" label={i("menu-registro.name")} variant="outlined" />
                <TextField id="outlined-basic" multiline={true} minRows="5" name="description" label={i("menu-registro.description")} variant="outlined" />
                <Button type='submit' size="large" variant='contained' sx={{maxWidth:"70vw", alignSelf:"center"}} >{i("caretaker.modify")} </Button>
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Stack direction='row' justifyContent='flex-start' alignItems='center' spacing={3} mb={3}>
                            <NewReleasesIcon sx={{ color: 'alert.main' }} />
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                {i("caretaker.alert")}
                            </Typography>
                        </Stack>
                        <Typography variant="body2">
                            {i("caretaker.text-alert")}
                        </Typography>

                    </CardContent>
                </Card>
            </Stack>
            <Button
                type='submit'
                variant='outlined'
                size='medium'
                sx={{ color: 'alert.delete', margin: "10px" }}
                startIcon={<DeleteIcon />} onClick={handleDeleteUser}> {i("caretaker.delete")}</Button>
        </Stack>
    );
}
