import dotenv from 'dotenv';
dotenv.config();
console.log('DEBUG environment variable:', process.env.DEBUG);


export const debugCreateExercise = require('debug')('createexercise');
export const debugExercise = require('debug')('exercise');
export const debugCreateSession = require('debug')('createsession');