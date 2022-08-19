// Avec le framework express
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const { render } = require("ejs");

// express app
const app = express();

// connect to mongo db atlas
const dbURI = "mongodb+srv://netninja:node123456@cluster0.rbtuuad.mongodb.net/nodeNinja?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }) // object pour éviter les messages de dépreciation
    // listen for requests
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// register view engine
app.set("view engine", "ejs");

//middleware & static files
app.use(express.static("public")); // dossier à mettre à disposition du browser (le dossier "public" en l'occurence)
//sert à accepter la data du formulaire
app.use(express.urlencoded({ extended: true }));
//remplace le middleware d'en dessous pour avoir les infos de la requete (on l'appelle 3rd party middleware)
app.use(morgan("dev"));

// Routes

// pas de fonction next puisque si l'url correspond à "/" on veut arrêter le déroulement du code sur ce middleware ci
app.get("/", (req, res) => {
    res.redirect("/blogs");
});

app.get("/about", (req, res) => {
    //res.sendFile("./views/about.html", { root: __dirname });
    res.render("about", { title: "About" });
});


// blog routes 
app.get("/blogs", (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render("index", { title: "All Blogs", blogs: result })
        })
        .catch((err) => {
            console.log(err);
        });
});

// Poster un blog à partir du form
app.post("/blogs", (req, res) => {
    //console.log(req.body);
    const blog = new Blog(req.body);

    blog.save()
        .then((result) => {
            res.redirect("/blogs");
        })
        .catch((err) => {
            console.log(err);
        })
});

app.get("/blogs/create", (req, res) => {
    res.render("create", { title: "Create a new blog" });
});

// blog par id
app.get("/blogs/:id", (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render("details", { blog: result, title: "Blog Details" })
        })
        .catch((err) => {
            console.log(err);
        })
})

app.delete("/blogs/:id", (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: "/blogs" })
        })
        .catch(err => console.log(err));
})


// redirects
app.get("/about-us", (req, res) => {
    res.redirect("./about");
});

// 404 page -> Le code va s'executer de haut en bas et si l'url ne correspond pas aux autre fonctions cela va passer à celle d'en dessous, comme un "default" dans un switch case
app.use((req, res) => {
    //res.status(404).sendFile("./views/404.html", { root: __dirname })
    res.status(404).render("404", { title: "404" });
});