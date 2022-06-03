import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AccountContext } from './Account';
import Axios from 'axios';

const PlantPage = () => {
    // const username = useSelector((state) => state.user.value.username);
    const [plant, setPlant] = useState({});
    let params = useParams();
    const URL = 'http://localhost:5000/user/plant';
    const { getUser } = useContext(AccountContext);
    const username = getUser();

    useEffect(() => {
        Axios.get(URL, {
            params:
            {
                username: username.username,
                id: params.plantId
            }
        })
            .then((response) => {
                console.log(response.data);
                setPlant(response.data)
                // setPlantList(response.data.plants);
            })
    }, []);

    return (
        <>
            <h1>plant </h1>
            <h1>{plant.name} {plant.location} {plant.watered} {plant.image}</h1>
            <img src={plant.image} />
        </>
    );
}

export default PlantPage;