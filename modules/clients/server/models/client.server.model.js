'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  validator = require('validator'),
  Schema = mongoose.Schema;

var validateLocalStrategyEmail = function (email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email, { require_tld: false }));
};
/**
 * Client Schema
 */
var ClientSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  firstName: {
    type: String,
    trim: true,
    required: 'Los nombres no pueden estar vacíos'
  },
  lastName: {
    type: String,
    trim: true,
    required: 'Los apellidos no pueden estar vacíos'
  },
  fullName: {
    type: String,
    trim: true,
    required: 'Nombres completos no pueden estar vacíos'
  },
  birthDate: {
    type: Date,
    default: ''
  },
  clientType: {
    type: String,
    default: 'Cliente'
  },
  legalName: {
    type: String,
    default: ''
  },
  rucOrDni: {
    type: String,
    required: 'Por favor ingresa Dni o Ruc'
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  points: {
    type: Number,
    default: 0
  },
  email: {
    type: String,
    index: {
      unique: true,
      sparse: true // For this to work on a previously indexed field, the index must be dropped & the application restarted.
    },
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Por favor ingresa un e-mail válido']
  },
  profileImageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Client', ClientSchema);
