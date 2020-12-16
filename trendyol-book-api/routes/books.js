const express = require('express');
const router = express.Router();

/*
let data = [
    {"id": 1, "author": "John Smith", "title": "SRE 101"},
    {"id": 2, "author": "Jane Archer", "title": "DevOps is a lie"}
];
*/
let data = [];

function checkDuplicate(req,res,next){
    let duplicate = false;
    data.forEach(function (checkData) {

        if (checkData.author === req.body.author && checkData.title === req.body.title) {
            duplicate = true;
        }
    })

    if (duplicate === true) {

        res.statusCode = 400;
        return res.json({
            "error": "Another book with similar title and author already exists."
        });
    }
 next();
}

function checkField(req,res,next) {

    if (req.body.author == null) {

        res.statusCode = 400;
        return res.json({
            "error": "Field 'author' is required"
        });
    }
    if (req.body.title == null) {
        res.statusCode = 400;
        return res.json({
            "error": "Field 'title' is required"
        });
    }
    if (req.body.author === '') {
        res.statusCode = 400;
        return res.json({
            "error": "Field 'author' cannot be empty"
        });
    }
    if (req.body.title === '') {
        res.statusCode = 400;
        return res.json({
            "error": "Field 'title' cannot be empty"
        });
    }
 next();
}


router.get('/books', function (req, res) {
    res.status(200).json(data);

});

// READ
router.get('/books/:id', function (req, res) {

    let found = data.find(function (item) {
        return item.id === parseInt(req.params.id);
    });

    if (found) {
        res.status(200).json(found);
    } else {
        res.statusCode = 404;
        return res.json({
            "error": "id does not exist"
        });
    }
});

// CREATE
router.put('/books',checkField,checkDuplicate, function (req, res,next) {

    let itemIds = data.map(item => item.id);
    let newId = itemIds.length > 0 ? Math.max.apply(Math, itemIds) + 1 : 1;

        let newItem = {
            id: newId,
            author: req.body.author,
            title: req.body.title,
        };
        data.push(newItem);
        res.status(201).json(newItem);
});

// UPDATE WITH ID
router.put('/books/:id',checkField,checkDuplicate, function (req, res) {

    let found = data.find(function (item) {
        return item.id === parseInt(req.params.id);
    });

    if (found) {
        let updated = {
            id: found.id,
            author: req.body.author,
            title: req.body.title
        };

        let targetIndex = data.indexOf(found);
        data.splice(targetIndex, 1, updated);
        res.json(updated);
    } else {
        res.statusCode = 404;
        return res.json({
            "error": "id does not exist"
        });
    }
});
router.delete('/books/:id', function (req, res) {
    let found = data.find(function (item) {
        return item.id === parseInt(req.params.id);
    });

    if (found) {
        let targetIndex = data.indexOf(found);
        data.splice(targetIndex, 1);
    }
    res.sendStatus(204);
});
module.exports = router;
