const express = require('express');

// database access using knex
const db = require('../data/db-config.js');

const router = express.Router();

router.get('/', (req, res) => {
    // SELECT * FROM posts
    db('posts') // shorthand for db.select('*').from('posts')
    .then(posts =>{
        res.status(200).json(posts)
    })
    .catch(error => {
        res.status(500).json({ message: 'failed to post'})
    })
});

router.get('/:id', (req, res) => {
    const { id } = req.params
    db('posts').where("id", id)
        .then(posts => {
            const post = posts[0]
            if(post){
                res.status(200).json(post)
            } else {
                res.status(404).json({message: 'invalid post id'})
            } 
        })
        .catch(error => {
            res.status(500).json({message:"there was an error", error: error})
        })
});

router.post('/', (req, res) => {
    // INSERT INTO Posts (all of keys from req.body) VALUES (all of the values from req.body)
    const postData = req.body
    db('posts').insert(postData)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(error => {
            res.status(500).json({message: 'failed to post'})
        })
})

router.put('/:id', (req, res) => {
    const { id } = req.params
    const bodyChanges = req.body
    db('posts').where('id', id).update(bodyChanges)
        .then(count => {
            if(count) {
                res.status(200).json({updated: count})
            } else {
                res.status(404).json({message: 'invalid post id'})
            }
        })
        .catch(error => {
            res.status(500).json({message: "error updating post"})
        })
});

router.delete('/:id', (req, res) => {
    const { id } = req.params
    db('posts').where('id', id).delete()
        .then(count => {
            if(count) {
                res.status(200).json({deleted: count})
            } else {
                res.status(404).json({message: 'invalid id'})
            }
        })
        .catch(error => {
            res.status(500).json({message: "error deleting post"})
        })
});

module.exports = router;