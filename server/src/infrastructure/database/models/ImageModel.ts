import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, required: true},
    title: {type: String, required: true},
    url: {type: String, required: true},
    order:{type: Number, required: true},

}, {timestamps: true})

export const ImageModel = mongoose.model('image', imageSchema)