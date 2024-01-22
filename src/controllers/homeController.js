const router = require("express").Router()


    
router.get("/", (req, res) => {
    res.render("home")
})

// router.get("/create", (req, res) => {
//     res.render("create")
// })

// router.get('/search', (req, res) => {
//     res.render('search')
// })

router.get('/about', (req, res) => {
    res.render("about")
})

router.get('/404', (req, res) => {
    res.render('404')
})

module.exports = router