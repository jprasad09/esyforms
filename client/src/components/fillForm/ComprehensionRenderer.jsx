import React, { useEffect, useState } from 'react'

const ComprehensionRenderer = ({ _id, questionNumber, fieldImg, comprehensionField, label, setAnswers, answerStatus }) => {

  const [selectedOptions, setSelectedOptions] = useState({})
  const [error, setError] = useState(false)

  const handleOptionChange = (questionId, label) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [questionId]: label,
    }))
  }

  useEffect(() => {
    const allQuestionsAnswered = comprehensionField?.questions?.every((question) => selectedOptions[question.questionId])

    if (allQuestionsAnswered) {

      setError(prevState => false)

      const selections = comprehensionField.questions.map((question) => ({
        questionId: question.questionId,
        answer: selectedOptions[question.questionId]
      }))

      const data = {
        fieldId: comprehensionField._id,
        selections,
      }
      setAnswers('comprehensionAnswers', data)
      answerStatus("Comprehension", _id, true)
    } else {
      setError(prevState => true)
      answerStatus("Comprehension", _id, false)
    }
  }, [selectedOptions])

  return (
    <div className='flex flex-col gap-y-7 border-gray-200 border-solid border-2 rounded px-5 py-3'>

      <div className='flex justify-between'>
        <p className='my-2 text-lg font-bold'>Question {questionNumber}</p>
        {
          fieldImg &&
          <img className='border-2 border-gray-800 rounded-lg w-80' src={fieldImg} loading="lazy" alt="Question Image" />
        }
      </div>

      <p>{label || 'Based on the paragarph, answer the following questions'}</p>

      <div className="flex flex-col gap-y-5">

        <div>
          {
            comprehensionField && comprehensionField?.paragraph &&
            <p>{comprehensionField?.paragraph}</p>
          }
        </div>

        <div className='flex flex-col gap-y-5'>
          {
            comprehensionField && comprehensionField?.questions &&
            comprehensionField?.questions?.map(({ _id, questionId, question, options }, index) => {
              const qid = `${questionId.split(".")[0]}.${index + 1}`
              return <div key={_id} className='flex flex-col border-t-2 border-gray-200'>
                <span className='my-2 text-sm font-bold'>Question {qid}</span>
                <p className='text-lg my-1'>{question}</p>
                <div>
                  {
                    options && options?.map(({ _id, label }) => {
                      return <div key={_id} className='flex items-center gap-2'>
                        <input
                          className='cursor-pointer'
                          key={_id}
                          type="radio"
                          name={questionId}
                          checked={selectedOptions[questionId] === label}
                          onChange={() => handleOptionChange(questionId, label)}
                        />
                        <label>{label}</label>
                      </div>
                    })
                  }
                </div>
              </div>
            })
          }
        </div>

        {
          error && <p className='text-red-500'>Answer all the questions</p>
        }

      </div>

    </div>
  )
}

export default ComprehensionRenderer