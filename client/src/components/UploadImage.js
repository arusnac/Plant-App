
import React, { useEffect, useState } from 'react';
import { uploadFile } from 'react-s3';
import axios from 'axios';
import { setImagePath, toggleStatus } from '../redux/UserSlice';
import { useDispatch, useSelector } from "react-redux";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import styles from './UploadImage.module.css'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';


async function postImage({ image, description }) {
    const formData = new FormData();

    formData.append("image", image)
    formData.append("description", description)


    const result = await axios.post('http://localhost:5000/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    return result.data
}

const UploadImageToS3WithReactS3 = ({ buttonType }) => {
    const PATH = useSelector((state) => state.user.value)
    const [file, setFile] = useState()
    const [description, setDescription] = useState("")
    const [images, setImages] = useState([])
    const [imagePath, setImagePath2] = useState('')
    const dispatch = useDispatch();

    //post image then set the path to user slice for retrieval
    const submit = async event => {
        const file = event.target.files[0]
        setFile(file)
        event.preventDefault()
        await postImage({ image: file, description }).then((response) => {
            let path = 'http://localhost:5000' + response.imagePath
            setImagePath2(path)
            setImages([response.image, ...images])
            dispatch(setImagePath(path))
        })
    }

    useEffect(() => {
        console.log(buttonType)
    })

    const Input = styled('input')({
        display: 'none',
    });


    const setImage = () => {
        dispatch(setImagePath(imagePath))
    }

    const fileSelected = event => {

    }

    return (
        <div className={styles.uploadContainer}>
            {/* Change the buttons type depending on where the element is placed */}
            <label htmlFor="contained-button-file">
                <Input onChange={submit} accept="image/*" id="contained-button-file" multiple type="file" />
                {buttonType === 'icon'
                    ?
                    <IconButton variant="contained" component="span" color="success" aria-label="uplaod new image">
                        <AddPhotoAlternateIcon />
                    </IconButton>
                    : <Button variant="contained" component="span">
                        Upload
                    </Button>}

            </label>

            {/* {images.map(image => (
                <div key={image}>
                    <img src={image}></img>
                </div>
            ))} */}
            {/* Display the uploaded image before saving to mongoDB document */}
            {imagePath && <Box
                sx={{
                    display: 'flex',
                    width: 330,
                    height: 330,
                    backgroundColor: 'primary.dark'
                }}>
                <img className={styles.uploadedImage} src={imagePath} alt='uploaded' />
            </Box>}
        </div>
    );
}

export default UploadImageToS3WithReactS3;