import React, { useEffect, useState } from "react";
import service from "../../firebase/config";
import { Container, PostCard } from "../index";
import { Link } from "react-router-dom";

function AllPost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await service.getAllPosts();
        if (allPosts && allPosts.length > 0) {
          setPosts(allPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-10 sm:py-20 bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-base sm:text-lg">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4 sm:py-8 bg-gray-50 min-h-screen">
      <Container>
        <div className="mb-6 sm:mb-8 px-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            All Posts
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Browse through all published articles
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 sm:py-20 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-12 max-w-md w-full text-center">
              <svg
                className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                No Posts Yet
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Be the first to create a post!
              </p>
              <Link
                to="/add-post"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Create Post
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4">
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default AllPost;