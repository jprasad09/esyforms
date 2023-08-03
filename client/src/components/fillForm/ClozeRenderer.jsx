import React, { useState, useEffect, useRef } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

import Option from './Option'

const ClozeRenderer = ({ _id, questionNumber, clozeField, label, setAnswers, answerStatus }) => {

  const [clozeState, setClozeState] = useState({})
  const [error, setError] = useState(false)

  const isInitialRender = useRef(true)

  useEffect(() => {
    const initialOptions = clozeField?.options || []
    const initialClozeState = {}
    clozeField?.blanks?.forEach((blank) => {
      initialClozeState[blank.label] = []
    })

    setClozeState({
      Option: initialOptions,
      ...initialClozeState,
    })

  }, [clozeField])

  const handleDragDrop = (result) => {
    const { destination, source } = result
  
    if (!destination) return
  
    if (destination.droppableId === source.droppableId && destination.index === source.index) return
  
    const updatedState = { ...clozeState }
    const sourceBlank = updatedState[source.droppableId]
    const option = sourceBlank[source.index]
  
    // Determine the destination blank based on the droppableId
    let destinationBlank
    if(destination.droppableId === 'Option'){
      destinationBlank = updatedState.Option
    }else{
      destinationBlank = updatedState[destination.droppableId]
  
      // Check if the destination blank is already occupied
      const isDestinationOccupied = destinationBlank.length > 0
  
      // If the destination blank is already occupied, swap the options
      if (isDestinationOccupied) {
        const destinationOption = destinationBlank[0]
        sourceBlank.splice(source.index, 1, destinationOption)
        destinationBlank.splice(0, 1, option)
      } else {
        // If the destination blank is not occupied, move the option to the destination blank
        sourceBlank.splice(source.index, 1)
        destinationBlank.push(option)
      }
    }
  
    setClozeState(updatedState)
  }

  useEffect(() => {

    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }
    
    // Check if any blank is empty
    const isAnyBlankEmpty = Object.keys(clozeState)
      .filter((key) => key !== 'Option')
      .some((key) => clozeState[key]?.length === 0)
  
    // If any blank is empty, set the error state and completion status to false
    if(isAnyBlankEmpty){
      setError(true)
      answerStatus("Cloze", _id, false)
    }else{
      setError(false)
      answerStatus("Cloze", _id, true)
  
      const selections = Object.entries(clozeState)
      .filter(([category]) => category !== 'Option')
      .flatMap(([category, options], blankIndex) =>
        options.map((option) => ({
          blankIndex,
          option,
        }))
      )

      const data = {
        fieldId: _id,
        selections,
      }
  
      setAnswers('clozeAnswers', data)
    }
  }, [clozeState])
  
  return (
    <DragDropContext onDragEnd={handleDragDrop}>

      <div className='flex flex-col gap-y-7 border-gray-200 border-solid border-2 rounded px-5 py-3'>

        <p className='my-2 text-lg font-bold'>Question {questionNumber}</p>

        <p>{label || 'Fill in the blanks'}</p>

        <div className="flex flex-col gap-y-5">

          <Droppable droppableId="Option">
            {(provided, snapshot) => (
              <div
                className='flex gap-x-3 self-center'
                ref={provided.innerRef}
                {...provided.droppableProps} >
                {clozeState['Option']?.map((option, index) => (
                  <Option key={option._id} {...option} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className='flex items-center gap-1'>
            {
              clozeField?.paragraph.split(' ').map((word, index) => {
                const blankIndex = clozeField?.blanks.findIndex((blank) => blank.index === index)
                if (blankIndex !== -1) {
                  const blankLabel = clozeField.blanks[blankIndex].label
                  return (
                    <Droppable droppableId={blankLabel} key={index}>
                      {(provided, snapshot) => (
                        <span
                          style={{ minHeight: '30px', minWidth: "80px" }}
                          className={`${snapshot.isDraggingOver ? 'bg-slate-100' : ''} flex items-center justify-center bg-gray-200`}
                          ref={provided.innerRef}
                          {...provided.droppableProps}>
                          {clozeState[blankLabel]?.map((option, index) => (
                            <Option key={option._id} {...option} index={index} />
                          ))}
                          {provided.placeholder}
                        </span>
                      )}
                    </Droppable>
                  )
                }
                return <span key={index}>{word}</span>
              })

            }
          </div>

        </div>

        {
          error && <p className='text-red-500'>Fill in all the blanks</p>
        }

      </div>

    </DragDropContext>
  )
}

export default ClozeRenderer