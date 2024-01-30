
const movieRouter = require("express").Router()
const movieManager = require("../managers/movieManager")
const castManager = require("../managers/castManager")

movieRouter.get("/create", (req, res) => {
    res.render("create")
})

movieRouter.post("/movies/create", async (req, res) => {
    
    try {
        await movieManager.createMovies(req.body)
        res.redirect('/')
    } catch (error) {
        console.log(error.message)
        res.redirect("/create")
    }
    
})

movieRouter.get('/movies/:movieId/details', async (req, res) => {
    const movieId = req.params.movieId
    let movie = await movieManager.getOne(movieId).lean()
    // const casts = await castManager.getByIds(movie.casts).lean() ===> only if populate is not used - populate populates the cast info into the movie with the ref: Cast in the Movie Schema
    res.render('details', {movie})
})

movieRouter.get('/search', async (req, res) => {
    const {title, genre, year} = req.query
    const movies = await movieManager.search(title, genre, year).lean()
    res.render('search', {movies, title, genre, year})
})

movieRouter.get('/movies/:movieId/attach', async (req, res) => {
    const movie = await movieManager.getOne(req.params.movieId).lean()
    const casts = await castManager.getAll().lean()
    res.render('movie/attach', {...movie, casts})
})

movieRouter.post('/movies/:movieId/attach', async (req, res) => {
    const castId = req.body.cast
    await movieManager.attach(req.params.movieId, castId)
    res.redirect(`/movies/${req.params.movieId}/attach`) // /movies/:movieId/attach
})

module.exports = movieRouter