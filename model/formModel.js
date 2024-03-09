import mongoose from 'mongoose'

const formSchema = new mongoose.Schema({
    title: { type: String },
    date: { type: String },
    language: { type: String },
    type: { type: String },
    image: { type: String },
    genre: { type: String },
    actors: { type: String },
    rating: { type: String },
    country: { type: String },
    description: { type: String },
    trailer: { type: String },
    videos:[{type:String}]
},
    {
        timestamps: true
    }
)

const movieDetails = mongoose.model('movieDetails', formSchema)

export default movieDetails

