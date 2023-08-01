const mongoose = require('mongoose')
const Response = require('../models/responseModel')

// get all responses
const getResponses = async (req, res) => {
  const responses = await Response.find({}).sort({createdAt: -1})

  res.status(200).json(responses)
}

// get a single response
const getResponse = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'Invalid Request'})
  }

  const response = await Response.findById(id)

  if (!response) {
    return res.status(404).json({error: 'No such response'})
  }

  res.status(200).json(response)
}

// create a new response
const createResponse = async (req, res) => {
    try {

      const { form, email, categorizeAnswers, clozeAnswers, comprehensionAnswers } = req.body

      let emptyFields = []

      if (!form) {
        emptyFields.push('form')
      }
      if (!email) {
        emptyFields.push('email')
      }
      if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all fields', emptyFields })
      }
  
      const newResponse = new Response({
        form,
        email,
        categorizeAnswers,
        clozeAnswers,
        comprehensionAnswers,
      })
  
      const savedResponse = await newResponse.save()
  
      res.status(201).json(savedResponse)

    } catch (error) {
      res.status(500).json({ error: 'Failed to create the response.' });
    }
}

module.exports = {
  getResponses,
  getResponse,
  createResponse,
}