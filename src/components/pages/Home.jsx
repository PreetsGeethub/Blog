import React, { useEffect, useState } from "react";
import service from "../../firebase/config";
import { Container, PostCard } from "../index";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"; // ✅ Import React Router

function Home() {
  const [posts, setPosts] = useState([]);
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate(); // ✅ For programmatic navigation

  useEffect(() => {
    // Only fetch posts if user is logged in
    if (authStatus) {
      const fetchPosts = async () => {
        try {
          const allPosts = await service.getAllPosts();
          if (allPosts && allPosts.length > 0) {
            setPosts(allPosts);
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };

      fetchPosts();
    } else {
      setPosts([]);
    }
  }, [authStatus]);

  // Check auth status FIRST
  if (!authStatus) {
    return (
      <div className="w-full py-20 bg-linear-to-br from-blue-50 to-indigo-100 min-h-screen">
        <Container>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md">
              <svg
                className="w-24 h-24 mx-auto mb-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome to Our Blog
              </h1>
              <p className="text-gray-600 mb-8">
                Please login to read and create amazing blog posts
              </p>
              <div className="space-y-3">
                {/* ✅ Using Link component instead of <a> */}
                <Link
                  to="/login"
                  className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Check if posts exist (when logged in)
  if (posts.length === 0) {
    return (
      <div className="w-full py-20 bg-gray-50 min-h-screen">
        <Container>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md">
              <svg
                className="w-24 h-24 mx-auto mb-6 text-gray-400"
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
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                No Posts Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Be the first to create a post and share your thoughts!
              </p>
              {/* ✅ Using Link component */}
              <Link
                to="/add-post"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Create Your First Post
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Show posts grid
  return (
    <div className="w-full py-8 bg-gray-50 min-h-screen">
      <Container>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Latest Posts</h1>
          <p className="text-gray-600">Explore our collection of articles</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;