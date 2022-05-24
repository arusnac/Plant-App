
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


async function postImage({ image, description }) {
    const formData = new FormData();

    formData.append("image", image)
    formData.append("description", description)


    const result = await axios.post('http://localhost:5000/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    return result.data
}

const UploadImageToS3WithReactS3 = () => {
    const PATH = useSelector((state) => state.user.value)
    const [file, setFile] = useState()
    const [description, setDescription] = useState("")
    const [images, setImages] = useState([])
    const [imagePath, setImagePath2] = useState('')
    const dispatch = useDispatch();

    const submit = async event => {
        const file = event.target.files[0]
        setFile(file)
        event.preventDefault()
        await postImage({ image: file, description }).then((response) => {
            let path = 'http://localhost:5000' + response.imagePath
            setImagePath2(path)
            setImages([response.image, ...images])
            dispatch(setImagePath(response.imagePath))
        })
    }

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
            {/* <form onSubmit={submit}>
                <input onChange={submit} type="file" accept="image/*"></input>
                <input value={description} onChange={e => setDescription(e.target.value)} type="text"></input>
                <Button variant="contained" color="primary" type="submit">Upload</Button>
            </form> */}

            <label htmlFor="contained-button-file">
                <Input onChange={submit} accept="image/*" id="contained-button-file" multiple type="file" />
                <Button variant="contained" component="span">
                    Upload
                </Button>
            </label>

            {images.map(image => (
                <div key={image}>
                    <img src={image}></img>
                </div>
            ))}
            {imagePath && <Box
                sx={{
                    display: 'flex',
                    width: 375,
                    height: 375,
                    backgroundColor: 'primary.dark'
                }}>
                <img className={styles.uploadedImage} src={imagePath} alt='uploaded' />
            </Box>}
        </div>
    );
}

export default UploadImageToS3WithReactS3;