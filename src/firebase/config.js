// service.js
import { 
  collection, addDoc, doc, updateDoc, deleteDoc, getDoc, getDocs, serverTimestamp 
} from "firebase/firestore";
import { db, storage } from "./firebaseApp"; // ✅ centralized import

class Service {
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

  async updatePost(postId, updatedData) {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, updatedData);
      console.log("✅ Post updated successfully");
    } catch (error) {
      console.log("Service :: updatePost :: error", error);
    }
  }

  async deletePost(postId) {
    try {
      const postRef = doc(db, "posts", postId);
      await deleteDoc(postRef);
      console.log("✅ Post deleted successfully");
    } catch (error) {
      console.log("Service :: deletePost :: error", error);
    }
  }

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

  async getAllPosts() {
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.log("Service :: getAllPosts :: error", error);
    }
  }
}

const service = new Service();
export default service;
