import React, { useEffect, useState } from "react";
import service from "../../firebase/config";
import { Container, PostCard } from "../index";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    // Fetch all posts (public blog)
    if (authStatus) {
      const fetchPosts = async () => {
        setLoading(true);
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
    } else {
      setPosts([]);
      setLoading(false);
    }
  }, [authStatus]);

  // Show loading spinner while fetching
  if (loading) {
    return (
      <div className="w-full py-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading posts...</p>
        </div>
      </div>
    );
  }

  // Check auth status FIRST
  if (!authStatus) {
    return (
      <div className="w-full py-20 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
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

  // ✅ ALWAYS SHOW - Hero Section for logged-in users
  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      {/* 🎨 Hero Section - Always Visible */}
      <div className="relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <Container>
          <div className="relative py-12 sm:py-16 px-4">
            {/* Main Hero Content */}
            <div className="max-w-4xl mx-auto text-center">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-50 rounded-full animate-pulse"></div>
                  <div className="relative bg-white rounded-full p-4 sm:p-6 shadow-2xl">
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {posts.length === 0 ? (
                  <>
                    Create Your
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      First Blog Post
                    </span>
                  </>
                ) : (
                  <>
                    Welcome to
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      Our Blog Community
                    </span>
                  </>
                )}
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                {posts.length === 0 
                  ? "Share your ideas, stories, and expertise with the world. Start writing today and join our community of creators."
                  : "Explore amazing articles from our community. Share your thoughts and connect with fellow writers."
                }
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link
                  to="/add-post"
                  className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                >
                  <svg
                    className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  {posts.length === 0 ? "Create Your First Post" : "Create New Post"}
                </Link>

                <Link
                  to="/all-posts"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-gray-700 bg-white rounded-full shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  Browse All Posts
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Posts Section - Shows when posts exist */}
      {posts.length > 0 && (
        <div className="pb-12">
          <Container>
            <div className="px-4">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Latest Posts</h2>
                <p className="text-gray-600">Discover stories from our community</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))}
              </div>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}

export default Home;