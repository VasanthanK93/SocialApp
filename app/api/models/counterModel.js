var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var counterSchema = new Schema({

  _id:String,
  sequence_value:Number
  });

module.exports = mongoose.model('counters', counterSchema);