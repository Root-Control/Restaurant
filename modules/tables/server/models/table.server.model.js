'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Table Schema
 */
var TableSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  tableNumber: {
    type: Number,
    unique: 'Ya existe una mesa con este número',
    required: 'El número de mesa es obligatorio'
  },
  status: {
    type: [{
      type: String,
      enum: ['desocupada', 'ocupada']
    }],
    default: ['desocupada'],
    required: 'Asigna un estado a la mesa'
  },
  visibilityStatus: {
    type: [{
      type: String,
      enum: ['activa', 'inactiva']
    }],
    default: ['activa'],
    required: 'Asigna un estado a la mesa'
  },
  chairQuantity: {
    type: Number,
    default: 0
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Table', TableSchema);
