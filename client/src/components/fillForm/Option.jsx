import { Draggable } from 'react-beautiful-dnd'

const Option = ({ _id, label, index }) => {
    return (
      <Draggable draggableId={_id} index={index}>
        {(provided, snapshot) => (
          <span
            className={`${snapshot.isDragging ? 'bg-slate-100' : ''} border-cyan-800 border-solid border-2 rounded px-2 text-center mx-2 my-1 max-w-fit`}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {label}
          </span>
        )}
      </Draggable>
    )
}

export default Option