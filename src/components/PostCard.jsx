import React from 'react'
import { Link } from 'react-router-dom'
import service from '../firebase/config'

function PostCard({ id, title, featuredImage, author }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image Preview */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={featuredImage}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {title}
        </h3>

        {author && (
          <p className="text-sm text-gray-500 mb-3">
            By <span className="font-medium text-gray-700">{author}</span>
          </p>
        )}

        <Link
          to={`/post/${id}`}
          className="inline-block text-primary font-medium hover:underline"
        >
          Read More →
        </Link>
      </div>
    </div>
  )
}

export default PostCard
