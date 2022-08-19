// Avec le framework express
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blog");

// express app
const app = express();

// connect to mongo db atlas
const dbURI = "mongodb+srv://netninja:lois020325@cluster0.rbtuuad.mongodb.net/nodeNinja?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }) // object pour éviter les messages de dépreciation
    // listen for requests
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// register view engine
app.set("view engine", "ejs");

//middleware & static files
app.use(express.static("public")); // dossier à mettre à disposition du browser (le dossier "public" en l'occurence)
//remplace le middleware d'en dessous pour avoir les infos de la requete (on l'appelle 3rd party middleware)
app.use(morgan("dev"));

// mongoose and mongo sandbox routes
/* app.get("/add-blog", (req, res) => {
    const blog = new Blog({
        title: "new blog 2",
        snippet: "about my new blog 2",
        body: "again blog 2"
    });

    blog.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/all-blog", (req, res) => {
    Blog.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/single-blog", (req, res) => {
    Blog.findById("62fe61d98f89a94a92a7a3c4")
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        });
}); */

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
})

app.get("/blogs/create", (req, res) => {
    res.render("create", { title: "Create a new blog" });
});

// redirects
app.get("/about-us", (req, res) => {
    res.redirect("./about");
});

// 404 page -> Le code va s'executer de haut en bas et si l'url ne correspond pas aux autre fonctions cela va passer à celle d'en dessous, comme un "default" dans un switch case
app.use((req, res) => {
    //res.status(404).sendFile("./views/404.html", { root: __dirname })
    res.status(404).render("404", { title: "404" });
});