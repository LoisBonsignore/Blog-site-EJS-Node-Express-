// Avec le framework express
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const { render } = require("ejs");
const blogRoutes = require("./routes/blogRoutes");

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

// redirects
app.get("/about-us", (req, res) => {
    res.redirect("./about");
});

//blog routes
app.use("/blogs", blogRoutes);

// 404 page -> Le code va s'executer de haut en bas et si l'url ne correspond pas aux autre fonctions cela va passer à celle d'en dessous, comme un "default" dans un switch case
app.use((req, res) => {
    //res.status(404).sendFile("./views/404.html", { root: __dirname })
    res.status(404).render("404", { title: "404" });
});