const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const illustSchema = mongoose.Schema({
    name: String,
    desc: String,
    image: String,
    stageId: {
      type: Schema.Types.ObjectId,
      ref: 'Stage',
  }
});


const Illust = mongoose.model('Illust', illustSchema)

module.exports = { Illust }