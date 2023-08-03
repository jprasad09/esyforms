const mongoose = require('mongoose')
const Form = require('../models/formModel')

// get all forms
const getForms = async (req, res) => {
  const forms = await Form.find( {}, { title: 1, fields: 1, createdAt: 1 } ).sort({createdAt: -1})

  res.status(200).json(forms)
}

// get a single form
const getForm = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'Invalid Request'})
  }

  const form = await Form.findById(id)

  if (!form) {
    return res.status(404).json({error: 'No such form'})
  }

  res.status(200).json(form)
}

// create a new form
const createForm = async (req, res) => {
    try {
      const { title, formImg, fields } = req.body

      let emptyFields = []

      if (!title) {
        emptyFields.push('title')
      }
      if (!fields) {
        emptyFields.push('fields')
      }
      if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all fields', emptyFields })
      }

      const newForm = new Form({
        title,
        formImg,
        fields,
      })
  
      const savedForm = await newForm.save()
  
      res.status(201).json(savedForm)

    } catch (error) {
      res.status(500).json({ error: 'Failed to create the form.' })
    }
}

module.exports = {
  getForms,
  getForm,
  createForm,
}