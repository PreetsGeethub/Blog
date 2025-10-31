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
    }
  }

  // ✅ Get All Posts
  async getAllPosts() {
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.log("Service :: getAllPosts :: error", error);
    }
  }

  // ✅ Upload file to Cloudinary
  async uploadFile(file) {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "blog_upload"); // your preset name

      // ⚠️ FIXED: remove angle brackets around cloud name
      const res = await fetch("https://api.cloudinary.com/v1_1/dxu5jkdwy/image/upload", {
        method: "POST",
        body: data,
      });

      const uploadRes = await res.json();

      if (!uploadRes.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      console.log("✅ File uploaded to Cloudinary:", uploadRes.secure_url);
      return uploadRes.secure_url; // URL to store in Firestore
    } catch (error) {
      console.error("service :: uploadFile :: error", error);
      throw error;
    }
  }

  // ✅ Delete file (Cloudinary deletion not available client-side)
  async deleteFile(fileUrl) {
    console.log("⚠️ Delete not implemented for Cloudinary free plan.");
    // Cloudinary deletion requires server-side API key for security.
  }
}

const service = new Service();
export default service;
