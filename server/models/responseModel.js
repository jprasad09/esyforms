const mongoose = require('mongoose')

// Define the schema for a single user's answer to a categorize question
const categorizeAnswerSchema = new mongoose.Schema({
  fieldId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selections: [
    {
        category: { type: String, required: true },
        options: [
          {
            option: { type: String, required: true },
          }
        ],
    }
  ],
})

// Define the schema for a single user's answer to a cloze field
const clozeAnswerSchema = new mongoose.Schema({
  fieldId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selections: [
    {
      blankIndex: { type: Number, required: true },
      optionIndex: { type: Number, required: true },
    },
  ],
})

// Define the schema for a single user's answer to a comprehension field
const comprehensionAnswerSchema = new mongoose.Schema({
  fieldId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selections: [
    {
      questionId: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
})

// Define the response schema
const responseSchema = new mongoose.Schema({
  form: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Form', 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true
  },
  categorizeAnswers: [categorizeAnswerSchema],
  clozeAnswers: [clozeAnswerSchema],
  comprehensionAnswers: [comprehensionAnswerSchema],
}, { timestamps: true })

// Create the Response model
module.exports = mongoose.model('Response', responseSchema)
