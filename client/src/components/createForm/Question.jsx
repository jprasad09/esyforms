import React, { useState } from 'react'
import { AiFillPlusCircle, AiFillDelete } from "react-icons/ai"

import CategorizeBuilder from './CategorizeBuilder'
import ClozeBuilder from './ClozeBuilder'
import ComprehensionBuilder from './ComprehensionBuilder'

const Question = ({ uniqueId, index, onAddQuestion, onDeleteQuestion, disableDelete }) => {

    const [questionType, setQuestionType] = useState('Categorize')

    const addQuestionBelow = () => {
        onAddQuestion(index)
    }

    const handleDeleteQuestion = () => {
        onDeleteQuestion(index)
    }

    return (
        <div className='flex flex-col gap-y-10 border-gray-200 border-2 rounded-md md:mx-20 p-5 my-5'>
            
            <div className='flex justify-between'>
                <span>Question {index + 1}</span>

                <div className='flex items-center gap-x-3'>

                    <select
                        className='border-0 cursor-pointer rounded-md drop-shadow-md bg-cyan-100 w-36 duration-300'
                        onChange={(e) => setQuestionType(e.target.value)}
                    >
                        <option value="Categorize">Categorize</option>
                        <option value="Cloze">Cloze</option>
                        <option value="Comprehension">Comprehension</option>
                    </select>

                    <span>
                        <AiFillPlusCircle
                            size={20}
                            color='gray'
                            className='cursor-pointer'
                            onClick={addQuestionBelow}
                        />
                    </span>

                    <span>
                        <AiFillDelete
                            size={20}
                            color='gray'
                            className='cursor-pointer'
                            onClick={disableDelete ? null : handleDeleteQuestion}
                        />
                    </span>

                </div>

            </div>

            <div>
                {
                    questionType && questionType === "Categorize" ? <CategorizeBuilder uniqueId={uniqueId} /> :
                        questionType === "Cloze" ? <ClozeBuilder uniqueId={uniqueId} /> :
                            questionType === "Comprehension" ? <ComprehensionBuilder uniqueId={uniqueId} index={index + 1} /> : null
                }
            </div>

        </div>
    )
}

export default Question