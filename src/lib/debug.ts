
export const debugCreateExercise = require('debug')('app:createexercise');
export const debugExercise = require('debug')('app:exercise');
export const debugCreateSession = require('debug')('app:createsession');
export const debugLanguageSelector = require('debug')('app:LanguageSelector');
debugLanguageSelector.log = console.log.bind(console);
