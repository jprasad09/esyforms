const express = require('express')

const {
  getForms,
  getForm,
  createForm,
} = require('../controllers/formController')

const router = express.Router()

// GET all forms
router.get('/', getForms)

// GET a single form
router.get('/:id', getForm)

// POST a new form
router.post('/', createForm)

module.exports = router