import { Autocomplete, Typography, CardActions, CardHeader, Stack, Box, Card, CardContent, CardMedia, Modal, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpacityIcon from '@mui/icons-material/Opacity';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useState, useEffect } from 'react'
import Axios from 'axios';
import plantInfo from '../assets/plantInfo.json'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import UploadImage from '../components/UploadImage'
import { useSelector } from 'react-redux';

const PlantCard = ({ userName, name, image, location, watered, id }) => {
    const [editing, setEditing] = useState(false)
    const [plantName, setPlantName] = useState('')
    const [waterDate, setWaterDate] = useState(watered)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [imageButton, showImageButton] = useState(false);
    const v = useSelector((state) => state.user.value.imagePath)

    useEffect(() => {
        setPlantName(name);
    }, [])

    const updateWatered = (plantId) => {
        const watered = new Date().toLocaleDateString();
        const id = plantId;
        Axios.post('http://localhost:5000/user/water', { id: id, watered: watered }, {
            params:
            {
                username: userName,
                id: plantId
            }
        }).then((response) => {
            setWaterDate(watered)
        });
    }

    const editInfo = (plantId, name) => {
        const id = plantId;
        Axios.post('http://localhost:5000/user/edit', { id: id, name: name }, {
            params:
            {
                username: userName,
                id: plantId
            }
        }).then((response) => {
            setPlantName(name)
            setEditing(false)
        });
    }

    const editImage = (plantId, PATH) => {
        const id = plantId;
        Axios.post('http://localhost:5000/user/editImage', { id: id, imagePath: PATH }, {
            params:
            {
                username: userName,
                id: plantId
            }
        }).then((response) => {
            setPlantName(name)
            setEditing(false)
        });
    }

    const [light, setLight] = useState('');

    const lightInfo = (name) => {

        const plantName = name.toUpperCase();
        setPlantName(plantName);
        if (plantName in plantInfo) {
            setLight(plantInfo[plantName].LIGHT)
            console.log(light)
        }
        else {
            setLight('No light information found')
        }

        handleOpen();
    }


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const plantData = [{ name: "AFRICAN VIOLET PLANT" }, { name: "AGAVE PLANT" }, { name: "ALOCASIA" }, { name: "ALOCASIA – JEWEL ALOCASIA" }, { name: "ALOE VERA PLANT" }, { name: "AMARYLLIS" }, { name: "ANGEL WING BEGONIA" }, { name: "ANTHURIUM" },
    { name: "ARALIA PLANT" }, { name: "ARALIA PLANT – BALFOUR" }, { name: "ARECA PALM" }, { name: "ARROWHEAD PLANT" }, { name: "ASPARAGUS FERN" }, { name: "AZALEA" },
    { name: "BABY’S TEARS PLANT" }, { name: "BAMBOO PALM" }, { name: "BEGONIA PLANT" }, { name: "TERRARIUM" }, { name: "WANDERING JEW PLANT" }, { name: "YUCCA PLANT" }, { name: "ZAMIOCULCAS ZAMIIFOLIA - ZZ PLANT" }, { name: "ZEBRA PLANT" }]



    return (
        <div>

            <Card
                onMouseOut={() => showImageButton(false)}
                onMouseOver={() => showImageButton(true)}
                variant="outlined" sx={{
                    minWidth: 275, maxWidth: 300, '&:hover': {}
                }}>
                {editing
                    ? <Stack spacing={1} sx={{ width: 275 }}>
                        <Autocomplete
                            id="free-solo-demo"
                            freeSolo
                            options={plantData.map((option) => option.name)}
                            renderInput={(params) => <TextField {...params} />}
                            value={plantName}
                            inputValue={plantName}
                            onInputChange={(event, newInputValue) => {
                                setPlantName(newInputValue);
                                // editInfo(id, newInputValue)

                            }}
                            onKeyDown={(event, newInputValue) => {
                                if (event.key === 'Enter') {
                                    // Prevent's default 'Enter' behavior.
                                    editInfo(id, plantName)
                                    setEditing(false)
                                    // your handler code
                                }
                            }}
                        />
                    </Stack>
                    : <CardHeader
                        title={plantName}
                    />}

                <CardMedia component="img"
                    alt="user plant"
                    height="180"
                    image={image} />

                <CardContent>

                    <Typography>Location: {location}<br />

                    </Typography>
                    <Typography>Last watered: {waterDate}</Typography>
                    {/* <IconButton variant="contained" color="primary"><OpacityIcon /></IconButton> */}
                </CardContent>

                {/* <Button size="small" variant="contained" color="primary" value={plants.name} onClick={lightInfo}>?</Button> */}
                <CardActions>
                    <IconButton color="primary" aria-label="light info">
                        <InfoIcon value={plantName} onClick={() => lightInfo(plantName)} />
                    </IconButton>
                    {!editing ? <IconButton color="primary" aria-label="add to shopping cart">
                        <EditIcon onClick={() => setEditing(!editing)} />
                    </IconButton>
                        : <div>
                            <IconButton color="error" aria-label="add to shopping cart">
                                <CancelIcon onClick={() => setEditing(!editing)} />
                            </IconButton>
                            <IconButton color="success" aria-label="add to shopping cart">
                                <CheckCircleIcon onClick={() => editInfo(id, plantName)} />
                            </IconButton>
                        </div>}
                    <IconButton color="primary" aria-label="add to shopping cart">
                        <OpacityIcon onClick={() => updateWatered(id)} />
                    </IconButton>
                    {imageButton &&
                        <UploadImage buttonType='icon' />
                    }

                </CardActions>
            </Card>


            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {plantName}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {light}
                    </Typography>
                </Box>
            </Modal>
        </div >
    )
}

export default PlantCard;

