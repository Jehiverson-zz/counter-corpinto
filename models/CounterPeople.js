'use strict'

const mongoose =  require('mongoose');
const { Schema } = mongoose;
const path = require('path');
const fileSchema = new Schema ({
    to: {type: String },
    from: {type: String },
    in: {type: Number },
    adultIn: {type: Number },
    out: {type: Number },
    adultOut: {type: Number },
    store: {type: String}
});

fileSchema.virtual('uniqueId')
    .get(function(){
        return this.filename.replace(path.extname(this.filename), '')
    });

module.exports = mongoose.model('counterPeople',fileSchema)