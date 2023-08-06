const mongoose = require('mongoose')

// Define the schema for the categorize form field
const categorizeFieldSchema = new mongoose.Schema({
    categories: [
        {
            label: { type: String, required: true },
            correctOptions: [
                {
                    label: { type: String, required: true },
                }
            ],
        }
    ],
    options: [
        {
            label: { type: String, required: true }
        }
    ]
})

// Define the schema for the cloze form field
const clozeFieldSchema = new mongoose.Schema({
    paragraph: { type: String, required: true },
    blanks: [
        {
            label: { type: String, required: true },
            index: { type: Number, required: true }
        }
    ],
    options: [
        {
            label: { 
                type: String, 
                required: true 
            },
        }
    ],
    correctMapping: [
        { 
            blankIndex: { type: Number, required: true },
            optionIndex: { type: Number, required: true },
        }
    ],
})

// Define the schema for the cloze form field
const comprehensionFieldSchema = new mongoose.Schema({
    paragraph: { type: String, required: true },
    questions: [
        {
            questionId: { type: String, required: true },
            question: { type: String, required: true },
            answer: { type: String, required: true },
            options: [
                {
                    label: { type: String, required: true },
                    isCorrect: { type: Boolean, default: false },
                }
            ],
        }
    ],
})


// Define the form field schema
const formFieldSchema = new mongoose.Schema({
  label: { type: String },
  type: {
    type: String,
    enum: ['categorize', 'cloze', 'comprehension'],
    required: true,
  },
  fieldImg: {
    type: String
  },
  
  // For "categorize" field type, use the categorizeFieldSchema schema
  categorizeField: { 
      type: categorizeFieldSchema, 
      required: function () {
          return this.type === 'categorize'
      }
  },

  // For "cloze" field type, use the clozeFieldSchema schema
  clozeField: { 
      type: clozeFieldSchema, 
      required: function () {
          return this.type === 'cloze';
      }
  },

  // For "comprehension" field type, use the comprehensionFieldSchema schema
  comprehensionField: { 
      type: comprehensionFieldSchema, 
      required: function () {
          return this.type === 'comprehension';
      }
  },
})

// Define the main form schema
const formSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  formImg: {
    type: String
  },
  formDescription: {
    type: String
  },
  fields: { 
    type: [formFieldSchema], 
    required: true 
  }, 
}, { timestamps: true })

// Create the Form model
module.exports = mongoose.model('Form', formSchema)
