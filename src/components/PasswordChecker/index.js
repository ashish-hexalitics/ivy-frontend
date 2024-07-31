import React, { useEffect, useState } from 'react'

const UPPERCASE_REGEX = '(.*[A-Z].*)'
const DIGIT_REGEX = '(.*[0-9].*)'
const SPECIAL_REGEX = '(.*[!@#\$%\^\&*\)\(+=._-].*)'

const PasswordChecker = ({ password }) => {
  const [length, setLength] = useState(false)
  const [capitalLetter, setCapitalLetter] = useState(false)
  const [digit, setDigit] = useState(false)
  const [specialLetter, setSpecialLetter] = useState(false)

  useEffect(() => {
    if (password.length) {
      setLength(password.length >= 8);
      if (String(password).match(UPPERCASE_REGEX)) {
        setCapitalLetter(true)
      }
      if (String(password).match(DIGIT_REGEX)) {
        setDigit(true)
      }
      if (String(password).match(SPECIAL_REGEX)) {
        setSpecialLetter(true)
      }
    }
  }, [password])

  return (
    <div className="flex flex-col gap-2 text-sm font-bold">
      <span className='text-sm font-bold text-gray-700'>Please enter a valid password.</span>
      <span className={`${length ? 'text-green-600' : 'text-red-600'}`}> - Password should be 8 characters long</span>
      <span className={`${capitalLetter ? 'text-green-600' : 'text-red-600'}`}> - Password should contain atleast 1 Uppercase letter (A)</span>
      <span className={`${digit ? 'text-green-600' : 'text-red-600'}`}> - Password should contain atleast 1 Digit (7)</span>
      <span className={`${specialLetter ? 'text-green-600' : 'text-red-600'}`}> - Password should contain atleast 1 Special letter (&)</span>
    </div>
  )
}

export default PasswordChecker
