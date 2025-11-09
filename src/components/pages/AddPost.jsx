import React from 'react'
import { Container, PostForm } from '../index'

function AddPost() {
  return (
    <div className="py-4 sm:py-8 bg-gray-50 min-h-screen">
      <Container>
        <div className="px-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">
            Create New Post
          </h1>
          <PostForm />
        </div>
      </Container>
    </div>
  )
}

export default AddPost