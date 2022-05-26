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

  const { getSession, logout, getUser } = useContext(AccountContext);

  const user = getUser();
  const PATH = useSelector((state) => state.user.value)
  const userStatus = useSelector((state) => state.user.value);


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
            <Nav.Link><Status /></Nav.Link>
          </Navbar.Collapse>

        </Container>
      </Navbar>
      {/* {userStatus.user[0].isLoggedIn && <SignUp />} */}
      {!loggedIn && <SignUp />}
      {!loggedIn && < Login />}
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
            {plantList.map((plants) => {
              return <PlantCard key={plants._id} id={plants._id} name={plants.name} image={plants.image} location={plants.location} watered={plants.watered} userName={user.username} />
            })}

          </div>

        </div >
      </Container >
    </div >

  );
}
export default App;
