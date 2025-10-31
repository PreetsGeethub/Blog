import {
  collection, addDoc, doc, updateDoc, deleteDoc, getDoc, getDocs, serverTimestamp
} from "firebase/firestore";

import { db } from "./firebaseApp";

class Service {

  // ✅ Create Post
  async createPost(data) {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        ...data,
        createdAt: serverTimestamp(),
      });
      console.log("✅ Post added with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.log("Service :: createPost :: error", error);
      throw error;
    }
  }

  // ✅ Update Post
  async updatePost(postId, updatedData) {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, updatedData);
      console.log("✅ Post updated successfully");
    } catch (error) {
      console.log("Service :: updatePost :: error", error);
      throw error;
    }
  }

  // ✅ Delete Post
  async deletePost(postId) {
    try {
      const postRef = doc(db, "posts", postId);
      await deleteDoc(postRef);
      console.log("✅ Post deleted successfully");
    } catch (error) {
      console.log("Service :: deletePost :: error", error);
      throw error;
    }
  }

  // ✅ Get a Single Post
  async getPost(postId) {
    try {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.log("⚠️ No such post found!");
        return null;
      }
    } catch (error) {
      console.log("Service :: getPost :: error", error);
      throw error;
    }
  }

  // ✅ Get All Posts
  async getAllPosts() {
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.log("Service :: getAllPosts :: error", error);
      throw error;
    }
  }

  // ✅ Upload file to Cloudinary with validation
  async uploadFile(file) {
    try {
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("File size must be less than 5MB");
      }

      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Only PNG, JPG, JPEG, and GIF files are allowed");
      }

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "blog_upload");

      const res = await fetch("https://api.cloudinary.com/v1_1/dxu5jkdwy/image/upload", {
        method: "POST",
        body: data,
      });

      const uploadRes = await res.json();

      if (!uploadRes.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      console.log("✅ File uploaded to Cloudinary:", uploadRes.secure_url);
      return uploadRes.secure_url;
    } catch (error) {
      console.error("service :: uploadFile :: error", error);
      throw error;
    }
  }

  // ✅ Delete file (for future server-side implementation)
  async deleteFile(fileUrl) {
    try {
      // Extract public_id for future use
      const urlParts = fileUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      const publicId = filename.split('.')[0];
      
      console.log("⚠️ Delete not implemented for Cloudinary free plan.");
      console.log("Public ID for deletion:", publicId);
      
      // TODO: Implement server-side deletion when backend is ready
      // This requires Cloudinary API key and secret
    } catch (error) {
      console.error("Error parsing file URL:", error);
    }
  }
}

const service = new Service();
export default service;