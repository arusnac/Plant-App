import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    plants: [{ name: String, location: String, watered: String, image: String }]
});

const UserModel = mongoose.model('users', UserSchema);
export default UserModel;

// const PlantSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     location: {
//         type: String,
//         required: true,
//     }
// });

// const PlantModel = mongoose.model('plants', PlantSchema);

// export default PlantModel;