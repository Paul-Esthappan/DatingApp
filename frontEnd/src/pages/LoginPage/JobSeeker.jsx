import { Button } from '@material-tailwind/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const JobSeeker = () => {
    const navigate = useNavigate();
    
    const handleSubmit = () => {
        navigate("/dating/relationship");
    }
  return (
      <div>
          <form onSubmit={handleSubmit}>
              <Button type='submit'>Next</Button>
          </form>
    </div>
  )
}

export default JobSeeker