const express = require('express');
const router = express.Router();
const db = require('../db/connection')

router.get("/", (req, res) => {
  const templateVars = {
    cookie: req.headers.cookie
  };
  res.render("addMovie", templateVars);
});

router.post("/", (req, res) => {
    const {title, year, price, quality, genre_id} = req.body;

    const queryString = `
    INSERT INTO movies (title, year, price, quality, genre_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `;
    const values = [title, year, price, quality, genre_id];
  
    console.log(values)
    db.query(queryString, values)
      .then(result => {
        res.json(result.rows[0]);
      })
      .catch(err => {
       console.log('query error:', err);
       res.status(500).send('Error submitting form');
      })
})

module.exports = router;