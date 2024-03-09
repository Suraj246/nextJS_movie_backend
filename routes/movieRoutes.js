import express from 'express'
import movieDetails from '../model/formModel.js'
import multer from 'multer';
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path'

const movieRoutes = express.Router()

// this steps are important to use dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      cb(null, path.join(__dirname, '../uploads/image'))

    }
    else {
      cb(null, path.join(__dirname, '../uploads/videos'))
    }
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image') {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true)
    }
    else {
      cb(null, false)
    }
  }
  else {
    const ext = path.extname(file.originalname)
    if (ext !== ".mkv" && ext !== ".mp4") {
      return cb(new Error('only video files are allowed'))
    }
    cb(null, true);
  }
}


const upload = multer({
  storage: storage,
  fileFilter: fileFilter

}).fields([{ name: "image" }, { name: "videos" }])


movieRoutes.get("/", async (req, res) => {
  try {
    const movies = await movieDetails.find({});

    if (movies.length === 0) { // Check if no movies found
      return res.status(400).json({ movies: [], movieData: "No movies found" });
    }

    return res.status(200).json({ movies: movies, movieData: "Movies Found" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }

})


movieRoutes.post("/createMovie", upload, async (req, res) => {
  const { title, date, language, type, genre, actors, rating, country, description, trailer } = req.body
  console.log(req.body)

  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  const image = req.files['image'] ? req.files['image'][0].filename : ""
  // Access video files (assuming multiple video uploads)
  const videos = req.files['videos'] ? req.files['videos'].map(file => file.filename) : []

  const newMovie = new movieDetails({ title, date, language,type, image, genre, actors, rating, country, description, trailer, videos });
  const movies = await newMovie.save()

  if (movies) {
    return res.status(200).json({ movies, movieData: "New Movie Added" })
  }
  return res.status(400).json({ movies, movieData: "Failed to Add New Movie" })

})

movieRoutes.put('/update/:id', upload, async (req, res) => {

  
  try {
    const { title, date, language, actors, rating, country, description, trailer } = req.body.updateMovie
   
    const movieUpdate = await movieDetails.findByIdAndUpdate({ _id: req.params.id },
      { title: title, date: date,language:language,actors: actors, rating: rating, country: country, description: description, trailer: trailer }, { new: true })
    if (!movieUpdate) {
      res.status(400).json({ message: "failed to update movie" })
    }
    res.status(200).json({ message: "movie updated successfully" })


  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
})

movieRoutes.delete('/:id', async (req, res) => {
  try {
    const videoRemove = await movieDetails.findByIdAndDelete(req.params.id)
    if (!videoRemove) {
      res.status(400).json({ message: "failed to delete video" })
    }
    res.status(200).json({ message: "video deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
})

// get all movies by type
movieRoutes.get('/type/:movieType', async (req, res) => { 
  try {
    const { movieType } = req.params
    const movie = await movieDetails.find({})
    const genreMovies = movie.filter((item)=>item.type.includes(movieType))
    if (!genreMovies) {
      res.status(400).json({ message: "failed to find movies" })
    }
    res.status(200).json({ movie: genreMovies, movieData: "Movies Found" })
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
})

// get all movies by genre
movieRoutes.get('/genre/:movieGenre', async (req, res) => { 
  try {
    const { movieGenre } = req.params
    const movie = await movieDetails.find({})
    const genreMovies = movie.filter((item)=>item.genre.includes(movieGenre))
    if (!genreMovies) {
      res.status(400).json({ message: "failed to find movies" })
    }
    res.status(200).json({ movie: genreMovies, movieData: "Movies Found" })
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
})

movieRoutes.get('/downloadVideo/:id', async (req, res) => {
    res.download(`./uploads/videos/${req.params.id}`)
})
export default movieRoutes

