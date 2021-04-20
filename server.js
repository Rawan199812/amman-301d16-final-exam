'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({extended:true}));
// Specify a directory for static resources
app.use(express.static('public'))
// define our method-override reference
app.use(methodOverride('_method'))

// Set the view engine for server-side templating
app.set('view engine','ejs');

// Use app cors
app.use(cors());


// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
// -- WRITE YOUR ROUTES HERE --
app.get('/',renderHome);
app.post('/save',insertInToDB);
app.get('/favorite-quotes',showSaved)
app.get('/favorite-quotes/:id',seeDetails)
app.delete('/favorite-quotes/:id',deleteItem)





// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --
function renderHome(req,res) {
    let url=`https://thesimpsonsquoteapi.glitch.me/quotes?count=10`
    superagent.get(url).set('User-Agent', '1.0').then(results=>{
        const charactors=results.body.map(element=>{
            return new Charactor(element)
        })
        // console.log(charactors);
        res.render('pages/index', {Results:charactors})
        // console.log(results);

    })
    // res.render('pages/index')
}
function insertInToDB(req,res) {
    // console.log('hello');
    let SQL=`INSERT INTO characters (quote,character,image,characterDirection) VALUES ($1,$2,$3,$4) RETURNING id;`;
    let safeValues=[req.body.quote,req.body.character,req.body.image,req.body.characterDirection];
    client.query(SQL,safeValues).then(()=>{
        res.redirect('/favorite-quotes')
    })
    
}

function showSaved(req,res) {
    let SQL=`SELECT * FROM characters;`
    client.query(SQL).then(results=>{
        // console.log(results);
        res.render('pages/rendersaved',{Results:results.rows})
    })
    

    
}

function seeDetails(req,res) {
    let SQL=`SELECT * FROM characters WHERE id=$1`;
    let idN=req.params.id;
    client.query(SQL,[idN]).then(results=>{
        console.log(results.rows);
        res.render('pages/detailsPage',{Results:results.rows})
    })

    
}
function deleteItem(req,res) {
    let SQL=`DELETE FROM characters WHERE id=$1;`
    let idN=req.params.id;
    client.query(SQL,[idN]).then(()=>{

        res.redirect('/favorite-quotes')
    })
    
}

// helper functions
function Charactor(info) {
    this.quote=info.quote;
    this.character=info.character;
    this.image=info.image;
    this.characterDirection=info.characterDirection;
    
}

// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
