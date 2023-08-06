import React, { useState, useEffect } from "react"
import { AiFillPlusCircle, AiFillDelete } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { v4 as uuidv4 } from "uuid"

import { setQuestionsValidity, addQuestion } from "../../store/formBuilderSlice"

const ComprehensionBuilder = ({ uniqueId, index }) => {
  const [questionTitle, setQuestionTitle] = useState("")
  const [paragraph, setParagraph] = useState("")
  const [paragraphError, setParagraphError] = useState(false)
  const [questions, setQuestions] = useState([
    {
      questionId: `${index}.${uuidv4()}`,
      question: "",
      answer: "",
      options: [{ label: "" }, { label: "" }],
    },
  ])
  const [questionErrors, setQuestionErrors] = useState({})
  const [optionErrors, setOptionErrors] = useState({})

  const dispatch = useDispatch()

  const handleAddQuestion = (currentQuestionId, id) => {
    const currentQuestionIndex = questions.findIndex(
      (question) => question.questionId === currentQuestionId
    )

    const newQuestionId = `${index}.${uuidv4()}`
    const newQuestion = {
      questionId: newQuestionId,
      question: "",
      answer: "",
      options: [{ label: "" }, { label: "" }],
    }

    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions]
      updatedQuestions.splice(currentQuestionIndex + 1, 0, newQuestion)
      return updatedQuestions
    })
  }

  const handleDeleteQuestion = (questionId) => {
    if (questions.length > 1) {
      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.questionId !== questionId)
      )
    }
  }

  const handleAddOption = (questionId) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((question) => {
        if (question.questionId === questionId) {
          const newOption = { label: "", isCorrect: false };
          const updatedOptions = [...question.options, newOption];

          if (question.options.length === 0) {
            newOption.isCorrect = true;
          }

          return {
            ...question,
            options: updatedOptions,
          }
        }
        return question
      })
      return updatedQuestions
    })
  }

  const handleDeleteOption = (questionId, optionIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((question) => {
        if (question.questionId === questionId) {
          if (question.options.length <= 2) {
            // Minimum 2 options are required, so prevent deletion
            return question
          }

          const updatedOptions = question.options.filter(
            (_, idx) => idx !== optionIndex
          )
          const updatedAnswer =
            question.answer === question.options[optionIndex].label
              ? ""
              : question.answer // Clear the answer if the deleted option was the correct option

          return {
            ...question,
            options: updatedOptions,
            answer: updatedAnswer,
          }
        }
        return question
      })
      return updatedQuestions
    })
  }

  useEffect(() => {
    dispatch(setQuestionsValidity({ id: uniqueId, status: false }))
  }, [])

  useEffect(() => {
    const validateForm = () => {
      let questionErrors = {}
      let optionErrors = {}
      let isValid = true

      if (!paragraph.trim()) {
        setParagraphError(true)
        isValid = false
      } else {
        setParagraphError(false)
      }

      questions.forEach((question) => {
        if (!question.question.trim()) {
          questionErrors[question.questionId] = "Question is required"
          isValid = false;
        }

        let isAnyOptionSelected = false;
        question.options.forEach((option, optionIndex) => {
          if (!option.label.trim()) {
            optionErrors[`${question.questionId}.${optionIndex}`] =
              "Option is required"
            isValid = false
          }

          if (option.isCorrect) {
            isAnyOptionSelected = true
          }
        })

        if (!isAnyOptionSelected) {
          optionErrors[question.questionId] = "Please select an option"
          isValid = false
        }
      })

      setQuestionErrors(questionErrors)
      setOptionErrors(optionErrors)

      return isValid
    }

    const valid = validateForm()
    if (valid) {
      dispatch(setQuestionsValidity({ id: uniqueId, status: true }))

      const question = {
        id: uniqueId,
        updatedField: {
          label: questionTitle,
          type: "comprehension",
          comprehensionField: {
            paragraph,
            questions
          }
        }
      }

      dispatch(addQuestion(question))
    } else {
      dispatch(setQuestionsValidity({ id: uniqueId, status: false }))
    }
  }, [paragraph, questions])

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex items-center justify-between">
        <input
          className="input-bottom w-1/3"
          type="text"
          placeholder="Add Question (Optional)"
          value={questionTitle}
          onChange={(e) => setQuestionTitle(e.target.value)}
        />
        <div className="flex items-center gap-x-1 w-1/2 py-5">
          <label className="text-sm">Question Image (optional)</label>
          <input type="file" name="categorizeImg" className="input-file" />
        </div>
      </div>

      <div className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-2 w-2/3">
          <span>Add a paragraph</span>
          <textarea
            className={`border-2 ${paragraphError ? "border-red-500" : "border-gray-200"
              }`}
            name="paragraph"
            cols="50"
            rows="10"
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
          />
          {paragraphError && (
            <p className="text-red-500">Paragraph is required</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          {questions.map((question, id) => {
            return (
              <div
                key={question.questionId}
                className="w-2/3 border-2 border-gray-200 rounded-md relative"
              >
                <div className="absolute top-2 right-2 flex gap-x-2">
                  <span>
                    <AiFillPlusCircle
                      size={20}
                      color="gray"
                      className="cursor-pointer"
                      onClick={() => handleAddQuestion(question.questionId)}
                    />
                  </span>
                  <span>
                    <AiFillDelete
                      size={20}
                      color="gray"
                      className="cursor-pointer"
                      onClick={() => handleDeleteQuestion(question.questionId)}
                    />
                  </span>
                </div>

                <div className="m-2 font-medium">{`Question ${index}.${id + 1}`}</div>

                <div className="p-10 flex flex-col gap-y-8">
                  <div>
                    <input
                      className="input-bottom"
                      placeholder="Add a question"
                      type="text"
                      value={question?.question}
                      onChange={(e) =>
                        setQuestions((prevQuestions) => {
                          const updatedQuestions = prevQuestions.map((q) => {
                            if (q.questionId === question.questionId) {
                              return { ...q, question: e.target.value }
                            }
                            return q;
                          });
                          return updatedQuestions;
                        })
                      }
                    />
                    {questionErrors[question.questionId] && (
                      <p className="text-red-500">
                        {questionErrors[question.questionId]}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-y-2">
                    {question?.options.map((option, optionIndex) => {
                      return (
                        <div
                          className="flex items-center gap-x-5"
                          key={`${question.questionId}.${optionIndex}`}
                        >
                          <input
                            className="cursor-pointer"
                            type="radio"
                            name={question.questionId}
                            value={option.label}
                            checked={option.isCorrect} // Make sure the correct option is checked
                            onChange={(e) =>
                              setQuestions((prevQuestions) => {
                                const updatedQuestions = prevQuestions.map(
                                  (q) => {
                                    if (q.questionId === question.questionId) {
                                      const updatedOptions = q.options.map(
                                        (o, idx) => {
                                          if (idx === optionIndex) {
                                            return {
                                              ...o,
                                              isCorrect: e.target.checked,
                                            }
                                          } else {
                                            // Uncheck the other options when selecting a new one
                                            return { ...o, isCorrect: false }
                                          }
                                        }
                                      );
                                      return {
                                        ...q,
                                        options: updatedOptions,
                                        answer: e.target.checked
                                          ? option.label
                                          : q.answer,
                                      }
                                    }
                                    return q
                                  }
                                )
                                return updatedQuestions
                              })
                            }
                          />
                          <input
                            className="input-bottom w-1/2"
                            type="text"
                            value={option.label}
                            placeholder="Add an option"
                            onChange={(e) =>
                              setQuestions((prevQuestions) => {
                                const updatedQuestions = prevQuestions.map(
                                  (q) => {
                                    if (q.questionId === question.questionId) {
                                      const updatedOptions = q.options.map(
                                        (o, idx) => {
                                          if (idx === optionIndex) {
                                            return {
                                              ...o,
                                              label: e.target.value,
                                            }
                                          }
                                          return o
                                        }
                                      );
                                      return { ...q, options: updatedOptions }
                                    }
                                    return q
                                  }
                                );
                                return updatedQuestions
                              })
                            }
                          />
                          <AiFillDelete
                            size={17}
                            color="gray"
                            className="cursor-pointer"
                            onClick={() =>
                              handleDeleteOption(question.questionId, optionIndex)
                            }
                          />
                          {optionErrors[
                            `${question.questionId}.${optionIndex}`
                          ] && (
                              <p className="text-red-500">
                                {
                                  optionErrors[
                                  `${question.questionId}.${optionIndex}`
                                  ]
                                }
                              </p>
                            )}
                        </div>
                      );
                    })}

                    {question.options.length < 5 && (
                      <AiFillPlusCircle
                        size={17}
                        color="gray"
                        className="cursor-pointer mt-2"
                        onClick={() => handleAddOption(question.questionId)}
                      />
                    )}

                    {optionErrors[question.questionId] && (
                      <p className="text-red-500">
                        {optionErrors[question.questionId]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default ComprehensionBuilder;
