import './App.css';
import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { AccountContext } from './components/Account';
import Container from 'react-bootstrap/Container';
import styles from './App.module.css'
import UploadImage from './components/UploadImage'
import { toggleStatus, setUsername } from './redux/UserSlice';
import Button from '@mui/material/Button';
import { Stack, Box, Modal, Snackbar, Alert } from '@mui/material'
import PlantCard from './components/PlantCard'
import Nav from './components/Nav'
import { Navigate } from "react-router-dom";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';

const App = () => {
  const [plantList, setPlantList] = useState([])
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const [currentUser, setCurrentUser] = useState('')

  const { getUser } = useContext(AccountContext);

  const URL = 'http://localhost:5000/user/'
  const user = getUser();
  const PATH = useSelector((state) => state.user.value)
  const userStatus = useSelector((state) => state.user.value.user[0].isLoggedIn);
  const dispatch = useDispatch();

  //If the user is logged in get their plant collection on initial loading 
  useEffect(() => {
    //get the userstate from local storage
    dispatch(toggleStatus(window.localStorage.getItem('userStatus')));
    console.log('here ' + userStatus)
    let userName = ''
    if (user) {
      userName = user.username;
      dispatch(setUsername(userName))
      setCurrentUser(userName)
      console.log(userName)
      Axios.get(URL, {
        params:
          { username: userName }
      })
        .then((response) => {
          setPlantList(response.data.plants);
        })
    } else {
      userName = '';
    }

  }, [])

  //Save the userstatus to local storage to maintain the app on refresh
  useEffect(() => {
    window.localStorage.setItem('userStatus', userStatus);
  }, [userStatus]);

  //Toggles the light info modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  //Handles the alert when plant is added
  const [openSnack, setOpenSnack] = useState(false);

  const handleClick = () => {
    setOpenSnack(true);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };

  //Add plant to the user collection in mongoDB then update the list to 
  //rerender the the plant cards
  const updatePlant = () => {
    let watered = new Date().toLocaleDateString();
    let imagePath = PATH.imagePath;
    Axios.post(URL + 'update', { name: name, location: location, watered: watered, image: imagePath }, {
      params:
        { username: user.username }
    }).then((response) => {
      setPlantList([...plantList, { name, location, watered, image: imagePath, id: response._id }])
      handleClose();
      handleClick();
    });

  };

  return (
    <>
      {
        !user
          ? (<Navigate to='/login' replace={true} />)
          : <div>
            <Nav />
            <Container>
              <div className="App">
                <Snackbar
                  open={openSnack}
                  autoHideDuration={6000}
                  onClose={handleSnackClose}>
                  <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
                    Plant added!
                  </Alert>
                </Snackbar>
                {!open &&
                  <Box bottom position='fixed' sx={{ bottom: 0, right: 0 }}>
                    < IconButton variant="contained" color="success" onClick={handleOpen}>
                      <AddCircleIcon sx={{ fontSize: 60 }} />
                    </IconButton>
                  </Box>}

                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Stack
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                      spacing={2}
                    >

                      <UploadImage />

                      <input type='text' placeholder='name' onChange={(event) => { setName(event.target.value) }} />
                      <input type='text' placeholder='location' onChange={(event) => { setLocation(event.target.value) }} />
                      <Button variant="contained" color="success" onClick={updatePlant}>Add</Button>
                      <Button variant="contained" color="error" onClick={handleClose}>Cancel</Button>
                    </Stack>
                  </Box>
                </Modal>

                <div className={styles.plantContainer}>
                  {plantList.map((plants) => {
                    return <PlantCard key={plants._id} id={plants._id} name={plants.name} image={plants.image} location={plants.location} watered={plants.watered} userName={user.username} />
                  })}

                </div>

              </div >
            </Container >
          </div >
      }
    </>
  );
}
export default App;
