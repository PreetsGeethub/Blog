import React, { useEffect, useState } from "react";
import service from "../../firebase/config";
import { Container, PostCard } from "../index";

function AllPost() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
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
  }, []);

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.length === 0 ? (
            <div className="p-2 w-full text-center">
              <h1 className="text-2xl font-bold">No posts yet</h1>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="p-2 w-1/4">
                <PostCard {...post} />
              </div>
            ))
          )}
        </div>
      </Container>
    </div>
  );
}

export default AllPost;