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
import { setImagePath, toggleStatus } from './redux/UserSlice';
import Button from '@mui/material/Button';
import { getImageListItemBarUtilityClass, Modal, Typography, Stack, Box } from '@mui/material'
import plantInfo from './assets/plantInfo.json'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PlantCard from './components/PlantCard'

import LoginPage from './components/LoginPage'
import { BrowserRouter as Router, Switch, Route, Routes } from "react-router-dom";


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
  const [currentUser, setCurrentUser] = useState('')

  const { getSession, logout, getUser } = useContext(AccountContext);

  const URL = 'http://localhost:5000/user/'
  const user = getUser();
  const PATH = useSelector((state) => state.user.value)
  const userStatus = useSelector((state) => state.user.value.user[0].isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleStatus(window.localStorage.getItem('userStatus')));
    console.log(getSession())
    let userName = ''
    if (user) {
      userName = user.username;
      setCurrentUser(userName)
      console.log(userName)
      setLoggedIn(true);
      Axios.get(URL, {
        params:
          { username: userName }
      })
        .then((response) => {
          // formatDate(response.data.plants);
          setPlantList(response.data.plants);
        })
    } else {
      userName = '';
    }

  }, [userStatus])

  // useEffect(() => {
  //   window.localStorage.setItem('userStatus', userStatus);
  //   console.log(userStatus)
  // }, [userStatus]);


  //Add plant to the user collection
  const updatePlant = () => {
    let watered = new Date().toLocaleDateString();
    setDate(watered);
    setImage('plant1');
    let imagePath = PATH.imagePath;
    Axios.post(URL + 'update', { name: name, location: location, watered: watered, image: imagePath }, {
      params:
        { username: user.username }
    }).then((response) => {
      setPlantList([...plantList, { name, location, watered, image: imagePath, id: response._id }])
      toggleStack();
    });

  };


  //Handle whether or not to show the add plant form
  const toggleStack = () => {
    setShowStack(!showStack);
  }


  return (
    <div>
      <Navbar bg='dark' variant='dark'>
        <Container margin='0'>

          <Navbar.Brand href="#home">PLANTS!! </Navbar.Brand>

          <Navbar.Collapse className="justify-content-end">
            {userStatus && <><Nav.Link>Welcome {currentUser}</Nav.Link>
              <button onClick={logout}>Logout</button>
            </>}
          </Navbar.Collapse>

        </Container>
      </Navbar>
      {!userStatus && <LoginPage />}

      <Container>
        {user && <div className="App">
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
            {plantList.map((plants) => {
              return <PlantCard key={plants._id} id={plants._id} name={plants.name} image={plants.image} location={plants.location} watered={plants.watered} userName={user.username} />
            })}

          </div>

        </div >}
      </Container >
    </div >

  );
}
export default App;
