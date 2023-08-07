import React, { useState, useEffect, useRef } from 'react'
import { AiFillPlusCircle, AiFillDelete, AiOutlineUnderline } from 'react-icons/ai'
import { useDispatch } from 'react-redux'

import axios from '../../api/axios'
import { setQuestionsValidity, addQuestion } from '../../store/formBuilderSlice'

const ClozeBuilder = ({ uniqueId }) => {
  const [questionTitle, setQuestionTitle] = useState('')
  const [paragraph, setParagraph] = useState('')
  const [img, setImg] = useState('')
  const [uploadStatus, setUploadStatus] = useState('idle')
  const [imgUrl, setImgUrl] = useState('')
  const [options, setOptions] = useState([])
  const [selectedUnderline, setSelectedUnderline] = useState(null)
  const [errors, setErrors] = useState({
    paragraphError: '',
    optionsError: '',
    selectedOptionError: '',
  })

  const dispatch = useDispatch()
  const inputRef = useRef(null)

  const handleAddOption = () => {
    setOptions([...options, { label: '' }])
  }

  const handleDeleteOption = (index) => {
    if (options.length > 2) {
      const updatedOptions = options.filter((_, i) => i !== index)
      setOptions(updatedOptions)
    }
  }

  const isValid = () => {

    if (paragraph.trim() === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        paragraphError: 'Sentence cannot be empty.',
      }))
      return false;
    } else {
      // Reset paragraph error if there are no issues
      setErrors((prevErrors) => ({
        ...prevErrors,
        paragraphError: '',
      }))
    }

    const emptyOptionFields = options.some((option) => option.label.trim() === '')
    if (emptyOptionFields && options.length < 2) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        optionsError: 'There should be at least two options and options cannot be empty.',
      }))
      return false
    } else if (emptyOptionFields && !options.length < 2) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        optionsError: 'Options cannot be empty.',
      }))
      return false
    } else if (!emptyOptionFields && options.length < 2) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        optionsError: 'There should be at least two options.',
      }))
      return false
    }

    if (!selectedUnderline) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedOptionError: 'There should be at least one blank.',
      }))
      return false
    }

    // Reset errors if there are no issues
    setErrors({
      paragraphError: '',
      optionsError: '',
      selectedOptionError: '',
    })

    return true
  }

  const handleParagraphChange = (e) => {
    const inputText = e.target.value
    setParagraph(inputText)
    isValid()
  }

  const handleUnderlineWord = () => {
    const input = inputRef.current
    const startPos = input.selectionStart
    const endPos = input.selectionEnd

    // Check if the user has selected any text
    if (startPos !== endPos) {
      // Get the whole text of the paragraph
      const paragraphText = input.value

      // Find the starting position of the word
      let startWordPos = startPos
      while (startWordPos > 0 && paragraphText[startWordPos - 1] !== ' ') {
        startWordPos--;
      }

      // Find the ending position of the word
      let endWordPos = endPos
      while (endWordPos < paragraphText.length && paragraphText[endWordPos] !== ' ') {
        endWordPos++;
      }

      // Extract the selected word and trim empty spaces
      const selectedWord = paragraphText.substring(startWordPos, endWordPos).trim()

      // Only allow single words to be underlined
      if (selectedWord.split(' ').length === 1) {
        // Update the paragraph to include the underlined word
        const updatedParagraph =
          paragraphText.substring(0, startWordPos) +
          `<u>${selectedWord}</u>` +
          paragraphText.substring(endWordPos)

        // Update the state with the updated paragraph and add the underlined word to options
        setParagraph(updatedParagraph)
        setOptions((prevOptions) => [...prevOptions, { label: selectedWord, isUnderlined: true }])
        input.focus() // Keep the focus on the input after underlining

        // Update the selectedUnderline state with the newly underlined word
        setSelectedUnderline(selectedWord)
      } else {
        alert('Please select a single word to underline')
      }
    }
  }

  const handleRadioChange = (e) => {
    setSelectedUnderline(e.target.value)
    isValid()
  };

  const handleInputBlur = (optionLabel) => {
    if (optionLabel === selectedUnderline) {
      setSelectedUnderline(null)
    }
  };

  const convertToPlainText = (html) => {
    const tempElement = document.createElement('div')
    tempElement.innerHTML = html
    const textNodes = []

    const traverseDOM = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        textNodes.push(node.nodeValue.trim()) // Trim the text to remove extra spaces
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.nodeName === 'U') {
          textNodes.push(node.textContent.trim()) // Trim the text to remove extra spaces
        } else {
          for (const childNode of node.childNodes) {
            traverseDOM(childNode)
          }
        }
      }
    }

    traverseDOM(tempElement)
    return textNodes.join(' ')
  };

  const extractUnderlinedWords = (text) => {
    const regex = /<u>(.*?)<\/u>/g;
    const matches = text.match(regex);
    if (matches) {
      return matches.map((match) => match.replace(/<u>|<\/u>/g, ''))
    }
    return []
  }

  const handleImageUpload = async () => {

    if (img) {

      setUploadStatus(prevState => 'loading')

      const imgData = new FormData()

      imgData.append('file', img)
      imgData.append('upload_preset', import.meta.env.VITE_REACT_APP_CLOUD_UPLOAD_PRESET)
      imgData.append('cloud_name', import.meta.env.VITE_REACT_APP_CLOUD_NAME)

      try {
        const cloudData = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_REACT_APP_CLOUD_NAME}/image/upload`, imgData)

        if (cloudData?.data?.url) {
          setImgUrl(prevState => cloudData?.data?.url)
          setUploadStatus(prevState => 'idle')
        }

      } catch (error) {
        setUploadStatus('error')
      }

    }

  }

  useEffect(() => {
    dispatch(setQuestionsValidity({ id: uniqueId, status: false }))
  }, [])

  useEffect(() => {

    // Remove underlined word from the sentence when the corresponding input field is deleted
    const updatedParagraph = paragraph.replace(/<u>(.*?)<\/u>/g, (match, p1) => {
      if (!options.some((option) => option.label === p1)) {
        return p1
      }
      return match
    })
    setParagraph(updatedParagraph)

    const valid = isValid()

    if (valid) {

      dispatch(setQuestionsValidity({ id: uniqueId, status: true }))

      const sentence = convertToPlainText(paragraph)

      const underlinedWords = extractUnderlinedWords(paragraph)

      const trimSpaces = (text) => {
        return text.replace(/\s+/g, ' ').trim()
      }

      // Get unique underlined words
      const uniqueUnderlinedWords = Array.from(new Set(underlinedWords.map(trimSpaces)))

      // Create blanks array without duplicates
      const blanks = uniqueUnderlinedWords.map((word) => {
        const wordsBefore = trimSpaces(paragraph).split(word)[0].split(' ')
        const index = wordsBefore.length - 1
        return { label: trimSpaces(word), index }
      })

      // Create correctMapping array without duplicates
      const correctMapping = uniqueUnderlinedWords.map((word) => {
        const wordsBefore = trimSpaces(paragraph).split(word)[0].split(' ')
        const blankIndex = wordsBefore.length - 1
        const optionIndex = options.findIndex((option) => trimSpaces(option.label) === trimSpaces(word))
        return { blankIndex, optionIndex }
      })

      const question = {
        id: uniqueId,
        updatedField: {
          label: questionTitle,
          type: "cloze",
          fieldImg: imgUrl,
          clozeField: {
            paragraph: sentence,
            blanks,
            options: options.map((option) => ({ label: option.label })),
            correctMapping
          }
        }
      }

      dispatch(addQuestion(question))

    } else {
      dispatch(setQuestionsValidity({ id: uniqueId, status: false }))
    }

  }, [paragraph, options, selectedUnderline, , imgUrl])

  return (
    <div className='flex flex-col gap-y-8'>
      <div className='flex md:flex-row flex-col gap-y-3 items-center justify-between'>
        <input
          className='input-bottom md:w-1/3'
          type='text'
          placeholder='Add Question (Optional)'
          value={questionTitle}
          onChange={(e) => setQuestionTitle(e.target.value)}
        />

        <div className='flex justify-end items-center gap-x-1 md:w-1/2 py-5'>
          <input type="file" name="categorizeImg" className='input-file'
            onChange={(e) => setImg(e.target.files[0])}
          />
          <button
            onClick={handleImageUpload}
            className='rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold px-3 py-1 transition duration-700'
          >
            {uploadStatus === 'loading' ? 'Uploading' : 'Upload Image'}
          </button>
        </div>
      </div>

      <div className='flex flex-col gap-y-10'>
        <div className='flex flex-col gap-y-5'>
          <div>
            <span className='font-medium'>Preview</span>
            <p dangerouslySetInnerHTML={{ __html: paragraph }} className='relative h-10 truncate rounded-sm border border-gray-200 p-2'></p>
          </div>

          <div className='flex flex-col gap-y-1'>
            <div className='flex items-center gap-x-10'>
              <span className='font-medium'>Sentence</span>
              <AiOutlineUnderline
                onClick={handleUnderlineWord}
                size={18}
                className='cursor-pointer'
              />
            </div>
            <textarea
              rows={2}
              placeholder='Underline the words to convert them into blanks.'
              ref={inputRef}
              type='text'
              className='input-bottom md:w-2/3'
              value={paragraph}
              onChange={handleParagraphChange}
            />
            {errors.paragraphError && <div className="text-red-500">{errors.paragraphError}</div>}
          </div>
        </div>

        <div className='flex flex-col gap-y-1'>
          {options?.map((option, index) => {
            const isUnderlinedOption = option.isUnderlined || false;

            return (
              <div key={index} className='flex items-center gap-x-5'>
                <input
                  type='radio'
                  value={option.label}
                  checked={isUnderlinedOption} // Mark the option as selected if it is underlined
                  onChange={handleRadioChange}
                />
                <input
                  className='input-box w-1/3'
                  type='text'
                  value={option.label}
                  placeholder='Add an option'
                  onChange={(e) => {
                    const updatedOptions = [...options]
                    updatedOptions[index].label = e.target.value
                    setOptions(updatedOptions)
                  }}
                  onBlur={() => handleInputBlur(option.label)}
                  disabled={isUnderlinedOption} // Disable the input for underlined options
                />
                {options.length > 2 ? (
                  <AiFillDelete
                    size={17}
                    color='gray'
                    className='cursor-pointer'
                    onClick={() => handleDeleteOption(index)}
                  />
                ) : (
                  <span className='relative w-4 h-10'></span>
                )}
              </div>
            );
          })}
          <AiFillPlusCircle
            title='Add an option'
            size={17}
            color='gray'
            className='cursor-pointer mt-2'
            onClick={handleAddOption}
          />
        </div>
        <div>
          {errors.optionsError && <div className="text-red-500">{errors.optionsError}</div>}
          {errors.selectedOptionError && <div className="text-red-500">{errors.selectedOptionError}</div>}
        </div>
      </div>
    </div>
  )
}

export default ClozeBuilder
