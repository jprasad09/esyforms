const express = require('express')

const {
  getResponses,
  getResponse,
  createResponse,
} = require('../controllers/responseController')

const router = express.Router()

// GET all responses
router.get('/', getResponses)

// GET a single response
router.get('/:id', getResponse)

// POST a new response
router.post('/', createResponse)

module.exports = router