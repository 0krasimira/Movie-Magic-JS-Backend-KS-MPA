
const movieRouter = require("express").Router()
const movieManager = require("../managers/movieManager")
const castManager = require("../managers/castManager")
const {isAuth} = require("../middlewares/authMiddleware")
const router = require("./homeController")
const { getErrorMessage } = require("../utils/errorUtils")

movieRouter.get("/create", isAuth, (req, res) => {
    res.render("create")
})

movieRouter.post("/movies/create", isAuth, async (req, res) => {
    
    const newMovie = {...req.body,
    owner: req.user._id}

    try {
        await movieManager.createMovies(newMovie)
        res.redirect('/')
    } catch (error) {
        const message = getErrorMessage(error)
        res.status(400).render("create", {error: message}, ...newMovie)
    }
    
})

movieRouter.get('/movies/:movieId/details', async (req, res) => {
    try{
        const movieId = req.params.movieId
        const movie = await movieManager.getOne(movieId).lean()
        // console.log(movie.owner)
        // console.log(req.user._id)
        const isOwner = movie.owner && movie.owner == req.user?._id /*they are of different types = owner is Object, and _id is a string. so to compare them, we have to turn them both to be 1 type = either use ==, which will stringify the owner, or stringify it manually like this*/ /*req.user?_id - optional chaining - if there is no user, return undefined and do not throw error (because there's no id)*/
        // const casts = await castManager.getByIds(movie.casts).lean() ===> only if populate is not used - populate populates the cast info into the movie with the ref: Cast in the Movie Schema
        
        res.render('movie/details', {movie, isOwner})
    } catch (error) {
        console.log(error.message)
        res.redirect("/")
    }
    
})

movieRouter.get('/search', async (req, res) => {
    try{
    const {title, genre, year} = req.query
    const movies = await movieManager.search(title, genre, year).lean()
    res.render('search', {movies, title, genre, year})
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
    
})

movieRouter.get('/movies/:movieId/attach', isAuth, async (req, res) => {
    try{
        const movie = await movieManager.getOne(req.params.movieId).lean()
        const casts = await castManager.getAll().lean()
        res.render('movie/attach', {...movie, casts})
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
    
})

movieRouter.post('/movies/:movieId/attach', isAuth, async (req, res) => {
    try{
        const castId = req.body.cast
        await movieManager.attach(req.params.movieId, castId)
        res.redirect(`/movies/${req.params.movieId}/attach`) // /movies/:movieId/attach
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
    
})


movieRouter.get("/movies/:movieId/edit", isAuth, async (req, res) => {
    if(!req.user){
        return res.redirect('/auth/login')
    }
    const movie = await movieManager.getOne(req.params.movieId).lean()
    res.render(`movie/edit`, {movie})
})

movieRouter.post('/movies/:movieId/edit', isAuth, async(req, res) => {
    const editedMovie = req.body
    await movieManager.edit(req.params.movieId, editedMovie)
    res.redirect(`/movies/${req.params.movieId}/details`)
})

movieRouter.get("/movies/:movieId/delete", isAuth, async (req, res) => {
    await movieManager.delete(req.params.movieId)
    res.redirect('/')
})

module.exports = movieRouter