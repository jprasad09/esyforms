import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

import Option from './Option'

const CategorizeRenderer = ({ _id, questionNumber, fieldImg, categorizeField, label, setAnswers, answerStatus }) => {

  const [categoryState, setCategoryState] = useState({})
  const [error, setError] = useState(false)

  useEffect(() => {
    const initialOptions = categorizeField?.options || []
    const initialCategoryState = {}
    categorizeField?.categories?.forEach((category) => {
      initialCategoryState[category.label] = []
    })

    setCategoryState({
      Option: initialOptions,
      ...initialCategoryState,
    })

  }, [categorizeField])

  const handleDragDrop = (result) => {

    const { destination, source } = result

    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    if (destination.droppableId === 'Option') return

    const updatedState = { ...categoryState }
    const sourceCategory = updatedState[source.droppableId]
    const destinationCategory = updatedState[destination.droppableId]
    const option = sourceCategory[source.index]

    // Move the option within the same category or to a new category
    if (destination.droppableId === source.droppableId) {
      sourceCategory.splice(source.index, 1)
      sourceCategory.splice(destination.index, 0, option)
    } else {
      sourceCategory.splice(source.index, 1)
      destinationCategory.splice(destination.index, 0, option)
    }

    setCategoryState(updatedState)
  }

  useEffect(() => {
    if (categoryState['Option']?.length === 0) {
      setError(prevState => false)

      const selections = Object.entries(categoryState)
        .filter(([category]) => category !== 'Option')
        .map(([category, options]) => ({ category, options }))

      const data = {
        fieldId: _id,
        selections
      }

      setAnswers("categorizeAnswers", data)
      answerStatus("Category", _id, true)
    } else {
      setError(prevState => true)
      answerStatus("Category", _id, false)
    }

  }, [categoryState])

  return (
    <DragDropContext onDragEnd={handleDragDrop}>

      <div className="flex flex-col gap-y-7 border-gray-200 border-solid border-2 rounded px-5 py-3">

        <div className='flex justify-between'>
          <p className='my-2 text-lg font-bold'>Question {questionNumber}</p>
          {
            fieldImg &&
            <img className='border-2 border-gray-800 rounded-lg w-52 sm:w-80' src={fieldImg} loading="lazy" alt="Question Image" />
          }
        </div>

        <p>{label || 'Categorize the following'}</p>

        <div className="flex flex-col gap-y-5 self-center">

          <Droppable droppableId="Option">
            {(provided, snapshot) => (
              <div
                className='flex sm:flex-row flex-col gap-x-3 self-center'
                ref={provided.innerRef}
                {...provided.droppableProps} >
                {categoryState['Option']?.map((option, index) => (
                  <Option key={option._id} {...option} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="flex sm:flex-row flex-col gap-5 self-center">

            {categorizeField?.categories?.map((category) => (
              <div className="flex flex-col gap-y-2" key={category._id}>
                <p className="w-full border-indigo-700 border-solid border-2 p-1 text-center">{category.label}</p>

                <Droppable droppableId={category.label}>
                  {(provided, snapshot) => (
                    <div
                      style={{ minHeight: '100px' }}
                      className={`${snapshot.isDraggingOver ? 'bg-slate-100' : ''} flex flex-col items-center border-indigo-700 border-solid border-2 w-40 min-w-fit`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}>
                      {categoryState[category.label]?.map((option, index) => (
                        <Option key={option._id} {...option} index={index} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

              </div>
            ))}
          </div>

        </div>

        {
          error && <p className='text-red-500'>Categorize all the options</p>
        }
      </div>
    </DragDropContext>
  )
}

export default CategorizeRenderer
