import './App.css';
import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Status from './components/Status'
import { useDispatch, useSelector } from 'react-redux';
import { AccountContext } from './components/Account';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav'
import OpacityIcon from '@mui/icons-material/Opacity';
import plant1 from './assets/plant1.png'
import styles from './App.module.css'
import UploadImage from './components/UploadImage'
import axios from 'axios';
import { setImagePath, toggleStatus } from './redux/UserSlice';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { getImageListItemBarUtilityClass, Modal, Typography } from '@mui/material'
import plantInfo from './assets/plantInfo.json'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';
import { CardActions, CardHeader, Stack, Box, Card, CardContent, CardMedia } from '@mui/material';
import PlantCard from './components/PlantCard'


const App = () => {
  const [plantList, setPlantList] = useState([])
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const imagePath = useSelector((state) => state.user.value)
  const [showStack, setShowStack] = useState(false)
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const { getSession, logout, getUser } = useContext(AccountContext);

  const user = getUser();
  const PATH = useSelector((state) => state.user.value)
  const userStatus = useSelector((state) => state.user.value);

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



  useEffect(() => {
    console.log(plantInfo)
    let userName = ''
    if (user) {
      userName = user.username;

      setLoggedIn(true);
    } else {
      userName = '';
    }

    Axios.get('http://localhost:5000/user', {
      params:
        { username: userName }
    })
      .then((response) => {
        // formatDate(response.data.plants);
        setPlantList(response.data.plants);
      })
  }, [])

  // const createPlant = () => {
  //   Axios.post('http://localhost:5000/plants/create', { name: name, location: location }).then((response) => {
  //     setPlantList([...plantList, { name: name, location }])
  //   });

  // };

  //Add plant to the user collection
  const updatePlant = () => {
    let watered = new Date().toLocaleDateString();
    setDate(watered);
    setImage('plant1');
    let imagePath = 'http://localhost:5000' + PATH.imagePath
    Axios.post('http://localhost:5000/user/update', { name: name, location: location, watered: watered, image: imagePath }, {
      params:
        { username: user.username }
    }).then((response) => {
      setPlantList([...plantList, { name, location, watered, image: imagePath, id: response._id }])
      toggleStack();
    });

  };

  const updateWatered = (plantId) => {
    const watered = new Date().toLocaleDateString();
    const id = plantId;
    const index = plantList.findIndex(x => x._id === id);
    console.log(index);
    Axios.post('http://localhost:5000/user/water', { id: id, watered: watered }, {
      params:
      {
        username: user.username,
        id: plantId
      }
    }).then((response) => {
      plantList[index].watered = watered;
      setPlantList([...plantList])
      console.log(plantList)
    });
  }

  const editPlant = (plantId) => {
    const index = plantList.findIndex(x => x._id === plantId);
    setPlantList([...plantList])
  }

  //Handle whether or not to show the add plant form
  const toggleStack = () => {
    setShowStack(!showStack);
  }

  const [light, setLight] = useState('');
  const [plantName, setPlantName] = useState('');

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

  const [editing, setEdit] = useState(false);

  return (
    <div>
      <Navbar bg='dark' variant='dark'>
        <Container margin='0'>

          <Navbar.Brand href="#home">PLANTS!! </Navbar.Brand>

          <Navbar.Collapse className="justify-content-end">
            <Nav.Link><Status /></Nav.Link>
          </Navbar.Collapse>

        </Container>
      </Navbar>
      {/* {userStatus.user[0].isLoggedIn && <SignUp />} */}
      <SignUp />
      <Login />
      <Container>
        <div className="App">
          {!showStack && < Button variant="contained" color="primary" onClick={toggleStack}>Add Plant</Button>}
          {showStack && <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >

            <UploadImage />

            <input type='text' placeholder='name' onChange={(event) => { setName(event.target.value) }} />
            <input type='text' placeholder='location' onChange={(event) => { setLocation(event.target.value) }} />
            <Button variant="contained" color="success" onClick={updatePlant}>Add</Button>
            <Button variant="contained" color="error" onClick={toggleStack}>Cancel</Button>
            <input type='text' placeholder='name' onChange={(event) => { setName(event.target.value) }} />
            <input type='text' placeholder='location' onChange={(event) => { setLocation(event.target.value) }} />
            <Button variant="contained" color="success" onClick={editPlant}>Save</Button>
          </Stack>}
          <div className={styles.plantContainer}>
            {plantList.map((plants) => {
              return <PlantCard key={plants._id} id={plants._id} name={plants.name} image={plants.image} location={plants.location} watered={plants.watered} userName={user.username} />
            })}
            {plantList.map((plants, idx) => {
              return (
                <div key={plants._id}>

                  <Card variant="outlined" sx={{ minWidth: 275 }}>
                    {editing
                      ? <input type='text' placeholder='name' onChange={(event) => { setName(event.target.value) }} />
                      : <CardHeader
                        title={plants.name}
                      />}

                    <CardMedia component="img"
                      alt="user plant"
                      height="180"
                      image={plants.image} />
                    <CardContent>

                      <Typography>Location: {plants.location}<br />

                      </Typography>
                      <Typography>Last watered: {plants.watered}</Typography>
                      {/* <IconButton variant="contained" color="primary"><OpacityIcon /></IconButton> */}
                    </CardContent>

                    {/* <Button size="small" variant="contained" color="primary" value={plants.name} onClick={lightInfo}>?</Button> */}
                    <CardActions>
                      <IconButton color="primary" aria-label="add to shopping cart">
                        <InfoIcon value={plants.name} onClick={() => lightInfo(plants.name)} />
                      </IconButton>
                      <IconButton color="primary" aria-label="add to shopping cart">
                        <EditIcon onClick={() => setEdit(true)} />
                      </IconButton>
                      {/* <Button size="small" variant="contained" color="primary" value={plants._id} onClick={updateWatered} endIcon={<OpacityIcon />}>Water</Button> */}
                      <IconButton color="primary" aria-label="add to shopping cart">
                        <OpacityIcon onClick={() => updateWatered(plants._id)} />
                      </IconButton>
                    </CardActions>
                  </Card>

                </div>
              )
            })}
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
          </div>

        </div >
      </Container >
    </div >

  );
}
export default App;
