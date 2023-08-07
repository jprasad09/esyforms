import React, { useState, useEffect } from 'react'
import { AiFillPlusCircle, AiFillDelete } from "react-icons/ai"
import { useDispatch } from 'react-redux'

import axios from '../../api/axios'
import { addQuestion, setQuestionsValidity } from '../../store/formBuilderSlice'

const CategorizeBuilder = ({ uniqueId }) => {

  const [questionTitle, setQuestionTitle] = useState('')
  const [categories, setCategories] = useState([{ label: '' }, { label: '' }])
  const [options, setOptions] = useState([{ label: '' }, { label: '' }])
  const [isValid, setIsValid] = useState(false)
  const [categoryErrors, setCategoryErrors] = useState([])
  const [optionErrors, setOptionErrors] = useState([])
  const [belongsToErrors, setBelongsToErrors] = useState([])
  const [img, setImg] = useState('')
  const [uploadStatus, setUploadStatus] = useState('idle')
  const [imgUrl, setImgUrl] = useState('')

  const dispatch = useDispatch()

  const addCategory = () => {
    setCategories((prevCategories) => [...prevCategories, { label: '', correctOptions: [] }])
  }

  const deleteCategory = (index) => {
    if (categories.length > 2) {
      setCategories((prevCategories) => {
        const updatedCategories = [...prevCategories]
        updatedCategories.splice(index, 1)
        return updatedCategories
      })
    }
  }

  const addOption = () => {
    setOptions((prevOptions) => [...prevOptions, { label: '' }])
  }

  const deleteOption = (index) => {
    if (options.length > 2) {
      setOptions((prevOptions) => {
        const updatedOptions = [...prevOptions]
        updatedOptions.splice(index, 1)
        return updatedOptions
      })
    }
  }

  const handleCategoryChange = (index, value) => {
    setCategories((prevCategories) => {
      const updatedCategories = [...prevCategories]
      updatedCategories[index].label = value
      return updatedCategories
    })
  }

  const handleOptionChange = (index, value) => {
    setOptions((prevOptions) => {
      const updatedOptions = [...prevOptions]
      updatedOptions[index].label = value
      return updatedOptions
    })
  }

  const handleOptionCategoryChange = (index, value) => {
    setOptions((prevOptions) => {
      const updatedOptions = prevOptions.map((option, idx) => {
        if (idx === index) {
          return { ...option, category: value }
        }
        return option
      })

      setCategories((prevCategories) => {
        const updatedCategories = prevCategories.map((category) => {
          if(category && category.label === value){
            const correctOptions = category.correctOptions
              ? [...category.correctOptions, updatedOptions[index].label]
              : [updatedOptions[index].label]
            return { ...category, correctOptions }
          }else{
            const correctOptions = category.correctOptions
              ? category.correctOptions?.filter((label) => label !== updatedOptions[index].label)
              : []
            return { ...category, correctOptions }
          }
        })

        return updatedCategories
      })

      return updatedOptions
    })
  }

  const handleImageUpload = async() => {

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
    const isCategoryValid = categories.every((category) => category.label.trim() !== '')
    const isOptionValid = options.every((option) => option.label.trim() !== '')
    const isBelongsToValid = options.every((option) => option.category && option.category !== 'Select Belongs To')

    setIsValid(prevState => isCategoryValid && isOptionValid && isBelongsToValid)
    setCategoryErrors(categories.map((category) => category.label.trim() !== '' ? '' : 'Category is required'))
    setOptionErrors(options.map((option) => option.label.trim() !== '' ? '' : 'Option is required'))
    setBelongsToErrors(options.map((option) => option.category && option.category !== 'Select Belongs To' ? '' : 'Belongs To category is required'))
  }, [categories, options])

  useEffect(() => {
    dispatch(setQuestionsValidity({ id: uniqueId, status: false }))
  }, [])

  useEffect(() => {
    if(isValid){
      dispatch(setQuestionsValidity({ id: uniqueId, status: true }))

      const question = {
        id: uniqueId,
        updatedField: {
          label: questionTitle,
          type: "categorize",
          fieldImg: imgUrl,
          categorizeField: {
            categories: categories.map((category) => ({
              label: category.label,
              correctOptions: category.correctOptions.map((correctOption) => ({
                label: correctOption
              }))
            })),
            options: options.map((option) => ({
              label: option.label,
            })),
          }
        }
      }

      dispatch(addQuestion(question))

    }else{
      dispatch(setQuestionsValidity({ id: uniqueId, status: false }))
    }
  }, [isValid, categories, options, questionTitle, imgUrl])

  return (
    <div className='flex flex-col gap-y-10'>

      <div className='flex md:flex-row flex-col gap-y-3 items-center justify-between'>

        <input
          className='input-bottom md:w-1/3'
          type="text"
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

        <div className='flex flex-col gap-y-3'>

          <div className='flex items-center gap-x-2'>
            <span className='font-medium'>Categories</span>
              <span>
                <AiFillPlusCircle
                  size={20}
                  color='gray'
                  className='cursor-pointer'
                  onClick={addCategory}
                />
              </span>
          </div>

          <div className='flex flex-col gap-y-1'>
            {
              categories?.map((category, index) => {
                return (
                  <div key={index} className='flex items-center md:gap-x-10'>
                    <input
                      type="text"
                      placeholder='Category'
                      className='input-box w-52'
                      value={category.label}
                      onChange={(e) => handleCategoryChange(index, e.target.value)}
                    />
                    {categories.length > 2 ? (
                      <span>
                        <AiFillDelete
                          size={20}
                          color='gray'
                          className='cursor-pointer'
                          onClick={() => deleteCategory(index)}
                        />
                      </span>
                    ): <span className='relative w-5 h-10'></span>}
                    {categoryErrors[index] && <span className="text-red-500">{categoryErrors[index]}</span>}
                  </div>
                )
              })
            }
          </div>

        </div>

        <div className='flex flex-col gap-y-3'>

          <div className='flex items-center'>
            <div className='flex items-center gap-x-2'>
              <span className='font-medium'>Option</span>
                <span>
                  <AiFillPlusCircle
                    size={20}
                    color='gray'
                    className='cursor-pointer'
                    onClick={addOption}
                  />
                </span>
            </div>
          </div>

          <div className='flex flex-col gap-y-1'>
            {
              options?.map((option, index) => {
                return (
                  <div key={index} className='flex items-start md:gap-x-10 gap-x-2'>
                    <div className='flex items-center gap-x-10'>
                      <div className='flex flex-col gap-y-1'>
                        <input
                          type="text"
                          className='input-box w-52'
                          placeholder='Option'
                          value={option.label}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                        />
                        {optionErrors[index] && <span className="text-red-500 text-sm mb-2">{optionErrors[index]}</span>}
                      </div>
                    </div>
                    <div className='my-2'>
                    {options.length > 2 ? (
                      <span>
                        <AiFillDelete
                          size={20}
                          color='gray'
                          className='cursor-pointer'
                          onClick={() => deleteOption(index)}
                        />
                      </span>
                    ): <span className='relative w-4 h-10'></span> }
                    </div>
                    <div className='my-2'>
                      <select
                        name="category"
                        className={`cursor-pointer rounded-md border-gray-200 border-2 w-36 duration-300 ${belongsToErrors[index] ? 'border-red-500' : ''}`}
                        value={options[index]?.category || "Select Belongs To"}
                        onChange={(e) => handleOptionCategoryChange(index, e.target.value)}
                      >
                        <option value="Select Belongs To" disabled>
                          Select Category
                        </option>
                        {
                          categories?.map((category, index) => {
                            if (category.label.trim() !== '') {
                              return <option key={index} value={category?.label}>{category?.label}</option>
                            }
                            return null
                          })
                        }
                      </select>
                    </div>
                  </div>
                )
              })
            }
          </div>

        </div>

      </div>

    </div>
  )
}

export default CategorizeBuilder