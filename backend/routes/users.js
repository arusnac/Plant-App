import express from 'express';
const router = express.Router();
import UserModel from '../models/User.js'

router.get('/', (req, res) => {
    let param = req.query.username;
    console.log(param);
    UserModel.findOne({ userName: param }, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    })
})

router.post('/new', async (req, res) => {
    const user = req.body;
    const newUser = new UserModel(user);
    await newUser.save();

    res.json(user);
});

router.post('/update', async (req, res) => {
    // console.log(req.body);
    let param = req.query.username;
    const result = await UserModel.findOne({ userName: param }).then(doc => {
        doc.plants.push(req.body);
        doc.save();
        res.json(doc.plants.at(-1))
    })

    // console.log(res.json(result.upsertedId));

    res.json(result);
});

router.post('/water', async (req, res) => {
    console.log(req.body);
    let param = req.query.username;
    const watered = req.body.watered;
    const plantId = req.body.id;
    console.log(req.body);

    const result = await UserModel.findOne({ username: param }).then(doc => {
        console.log(doc)
        let plant = doc.plants.id(plantId);
        console.log(plant.id)
        plant.watered = watered;
        doc.save();

    })
    res.json(result);
});

router.post('/edit', async (req, res) => {
    console.log(req.body);
    let param = req.query.username;
    const name = req.body.name;
    const plantId = req.body.id;
    console.log(req.body);

    const result = await UserModel.findOne({ username: param }).then(doc => {
        console.log(doc)
        let plant = doc.plants.id(plantId);
        console.log(plant.id)
        plant.name = name;
        doc.save();

    })
    res.json(result);
})

export default router;