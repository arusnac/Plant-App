import mongoose from 'mongoose';

const PlantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    }
});

const PlantModel = mongoose.model('plants', PlantSchema);

export default PlantModel;