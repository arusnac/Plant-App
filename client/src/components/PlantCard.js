import { Autocomplete, Typography, CardActions, CardHeader, Stack, Box, Card, CardContent, CardMedia, Modal, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpacityIcon from '@mui/icons-material/Opacity';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { useState, useEffect } from 'react'
import Axios from 'axios';
import plantInfo from '../assets/plantInfo.json'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import UploadImage from '../components/UploadImage'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

const filter = createFilterOptions();
const PlantCard = ({ userName, name, image, location, watered, id }) => {
    //Toggles the edit options for name and location
    const [editing, setEditing] = useState(false)

    //Hold plant info and reRender on edits
    const [plantName, setPlantName] = useState('')
    const [waterDate, setWaterDate] = useState(watered)
    const [imagePath, setImagePath] = useState(image)
    const [valueLocation, setValueLocation] = useState(null);

    //Toggles the light info modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [imageButton, showImageButton] = useState(false);
    const PATH = useSelector((state) => state.user.value.imagePath)

    //handles the the upload image modal
    const [openEdit, setOpenEdit] = useState(false);
    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);
    let navigate = useNavigate();

    //Set the name and image path from the props
    useEffect(() => {
        setPlantName(name);
        setImagePath(image);
        setValueLocation(location);
    }, [])

    //Update the watering date to today
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

    //Edit the plants name
    const editInfo = (plantId, name, location) => {
        const id = plantId;
        Axios.post('http://localhost:5000/user/edit', { id: id, name: name, location: location }, {
            params:
            {
                username: userName,
                id: plantId
            }
        }).then((response) => {
            setPlantName(name)
            setValueLocation(location)
            handleCloseEdit(false)
            setEditing(false)
        });
    }

    const editLocation = (plantId, location) => {
        const id = plantId;
        Axios.post('http://localhost:5000/user/editLocation', { id: id, location: location }, {
            params:
            {
                username: userName,
                id: plantId
            }
        }).then((response) => {
            setValueLocation(location)
            handleCloseEdit(false)
            setEditing(false)
        });
    }

    //Upload a new image for the plant
    const editImage = (plantId, PATH) => {
        const id = plantId;
        Axios.post('http://localhost:5000/user/editImage', { id: id, imagePath: PATH }, {
            params:
            {
                username: userName,
                id: plantId
            }
        }).then((response) => {
            setImagePath(PATH)
            setOpenEdit(false)
        });
    }

    //Toggle light modal
    const [light, setLight] = useState('');

    //If the plants light info exists, show in a modal
    const lightInfo = (name) => {
        const plantName = name.toUpperCase();
        setPlantName(plantName);
        if (plantName in plantInfo) {
            setLight(plantInfo[plantName].LIGHT)
        }
        else {
            setLight('No light information found')
        }
        handleOpen();
    }

    //style for modal
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

    //Test data for the input boxes
    const plantData = [{ name: "AFRICAN VIOLET PLANT" }, { name: "AGAVE PLANT" }, { name: "ALOCASIA" }, { name: "ALOCASIA – JEWEL ALOCASIA" }, { name: "ALOE VERA PLANT" }, { name: "AMARYLLIS" }, { name: "ANGEL WING BEGONIA" }, { name: "ANTHURIUM" },
    { name: "ARALIA PLANT" }, { name: "ARALIA PLANT – BALFOUR" }, { name: "ARECA PALM" }, { name: "ARROWHEAD PLANT" }, { name: "ASPARAGUS FERN" }, { name: "AZALEA" },
    { name: "BABY’S TEARS PLANT" }, { name: "BAMBOO PALM" }, { name: "BEGONIA PLANT" }, { name: "TERRARIUM" }, { name: "WANDERING JEW PLANT" }, { name: "YUCCA PLANT" }, { name: "ZAMIOCULCAS ZAMIIFOLIA - ZZ PLANT" }, { name: "ZEBRA PLANT" }]

    const options = [{ location: 'bedroom' }, { location: 'kitchen' }, { location: 'living room' }]

    return (
        <div>

            <Card
                onMouseOut={() => showImageButton(false)}
                onMouseOver={() => showImageButton(true)}
                variant="outlined" sx={{
                    minWidth: 275,
                    maxWidth: 275,
                    '&:hover': {},
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: 4
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
                                    editInfo(id, plantName);
                                    editLocation(id, valueLocation);
                                    setEditing(false);
                                    // your handler code
                                }
                            }}
                        />
                    </Stack>
                    : <CardHeader
                        title={plantName}
                    />}

                <CardMedia
                    component="img"
                    alt="user plant"
                    height="280"

                    sx={{ width: 250, boxShadow: 2 }}
                    image={imagePath} />

                <CardContent>

                    {
                        editing
                            ?
                            <Autocomplete
                                value={valueLocation}
                                onChange={(event, newValue) => {
                                    if (typeof newValue === 'string') {
                                        setValueLocation(
                                            newValue
                                        );
                                        console.log(valueLocation)
                                    } else if (newValue && newValue.inputValue) {
                                        // Create a new value from the user input
                                        setValueLocation(
                                            newValue.inputValue,

                                        );
                                        console.log(valueLocation)
                                    } else {
                                        setValueLocation(newValue);
                                        console.log(valueLocation)
                                    }
                                }}
                                filterOptions={(options, params) => {
                                    const filtered = filter(options, params);

                                    const { inputValue } = params;
                                    // Suggest the creation of a new value
                                    const isExisting = options.some((option) => inputValue === option.title);
                                    if (inputValue !== '' && !isExisting) {
                                        filtered.push({
                                            inputValue,
                                            title: `Add "${inputValue}"`,
                                        });
                                    }

                                    return filtered;
                                }}
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                id="free-solo-with-text-demo"
                                options={options}
                                getOptionLabel={(option) => {
                                    // Value selected with enter, right from the input
                                    if (typeof option === 'string') {
                                        return option;
                                    }
                                    // Add "xxx" option created dynamically
                                    if (option.inputValue) {
                                        return option.inputValue;
                                    }
                                    // Regular option
                                    return option.location;
                                }}
                                renderOption={(props, option) => <li {...props}>{option.location}</li>}
                                sx={{ width: 270 }}
                                freeSolo
                                renderInput={(params) => (
                                    <TextField {...params} label="Location" value="test" />
                                )}
                            />
                            :
                            <Typography>Location: {valueLocation}<br />
                            </Typography>
                    }
                    <Typography>Last watered: {waterDate}</Typography>
                    {/* <IconButton variant="contained" color="primary"><OpacityIcon /></IconButton> */}
                </CardContent>

                {/* <Button size="small" variant="contained" color="primary" value={plants.name} onClick={lightInfo}>?</Button> */}
                <CardActions>
                    <Button onClick={() => { navigate(`/plantpage/${id}`) }}>More Info</Button>
                    <IconButton value={plantName} onClick={() => lightInfo(plantName)} color="primary" aria-label="light info">
                        <InfoIcon />
                    </IconButton>
                    {
                        !editing ? <IconButton onClick={() => setEditing(!editing)} color="primary" aria-label="add to shopping cart">
                            <EditIcon />
                        </IconButton>
                            : <div>
                                <IconButton onClick={() => setEditing(!editing)} color="error" aria-label="add to shopping cart">
                                    <CancelIcon />
                                </IconButton>
                                <IconButton onClick={() => editInfo(id, plantName, valueLocation)} color="success" aria-label="add to shopping cart">
                                    <CheckCircleIcon />
                                </IconButton>
                            </div>
                    }

                    <IconButton onClick={() => updateWatered(id)} color="primary" aria-label="add to shopping cart">
                        <OpacityIcon />
                    </IconButton>
                    {imageButton && <IconButton onClick={handleOpenEdit} color="success" aria-label="uplaod new image">
                        <AddPhotoAlternateIcon />
                    </IconButton>

                    }

                </CardActions>
            </Card>

            <Modal
                open={openEdit}
                onClose={handleCloseEdit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {plantName}
                    </Typography>
                    <UploadImage onChange={() => setImagePath(PATH)} buttonType='icon' />
                    <Button onClick={() => editImage(id, PATH)}>Save</Button>
                    <Button onClick={() => handleCloseEdit(false)}>Cancel</Button>
                </Box>
            </Modal>

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

