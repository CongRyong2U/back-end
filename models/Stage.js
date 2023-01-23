const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stageSchema = mongoose.Schema({
    placeName: String,
    placeDesc: String,
    placeImage: String,
    lat: Number,
    lng: Number,
    personName: String,
    category: String,
    personDesc: String,
    personYear: String,
    itemName: String,
    itemImage: String,
    illustId: {
      type: Schema.Types.ObjectId,
      ref: 'Illust',
    }
})


const Stage = mongoose.model('Stage', stageSchema);

module.exports = { Stage }