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
import Card from 'react-bootstrap/Card'
import OpacityIcon from '@mui/icons-material/Opacity';
import plant1 from './assets/plant1.png'
import styles from './App.module.css'
import UploadImage from './components/UploadImage'
import axios from 'axios';
import { setImagePath, toggleStatus } from './redux/UserSlice';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Modal, Typography } from '@mui/material'
import plantInfo from './assets/plantInfo.json'

const App = () => {
  const [plantList, setPlantList] = useState([])
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [plantId, setId] = useState('');
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


  const dispatch = useDispatch();

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

  const createPlant = () => {
    Axios.post('http://localhost:5000/plants/create', { name: name, location: location }).then((response) => {
      setPlantList([...plantList, { name: name, location }])
    });

  };

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

  const updateWatered = (e) => {
    const watered = new Date().toLocaleDateString();
    const id = e.target.value;
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

  //Handle whether or not to show the add plant form
  const toggleStack = () => {
    setShowStack(!showStack);
  }

  const [light, setLight] = useState('');
  const [plantName, setPlantName] = useState('');

  const lightInfo = (e) => {

    const plantName = e.target.value.toUpperCase();
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
          </Stack>}
          <div className={styles.plantContainer}>

            {plantList.map((plants, idx) => {
              return (
                <div key={plants._id}>

                  <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={plants.image} />
                    <Card.Body>
                      <Card.Title>{plants.name}</Card.Title>
                      <Card.Text>Location: {plants.location}<br />

                      </Card.Text>
                      <Card.Text>Last watered: {plants.watered}</Card.Text>
                      {/* <IconButton variant="contained" color="primary"><OpacityIcon /></IconButton> */}
                      <Button size="small" variant="contained" color="primary" value={plants.name} onClick={lightInfo}>?</Button>
                      <Button size="small" variant="contained" color="primary" value={plants._id} onClick={updateWatered} endIcon={<OpacityIcon />}>Water</Button>
                    </Card.Body>
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
