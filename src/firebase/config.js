import { 
  collection, addDoc, doc, updateDoc, deleteDoc, getDoc, getDocs, serverTimestamp
} from "firebase/firestore";

import { 
  getStorage, ref, uploadBytes, getDownloadURL, deleteObject
} from "firebase/storage";

import { db, storage } from "./firebaseApp";

class Service {
  constructor() {
    this.storage = storage;
  }

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

  // ✅ Upload file
  async uploadFile(file, path = "uploads") {
    try {
      const fileRef = ref(this.storage, `${path}/${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      console.log("✅ File uploaded:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("firebase service :: uploadFile :: error", error);
      throw error;
    }
  }

  // ✅ Delete file
  async deleteFile(fileUrl) {
    try {
      const fileRef = ref(this.storage, fileUrl);
      await deleteObject(fileRef);
      console.log("🗑️ File deleted successfully");
    } catch (error) {
      console.error("firebase service :: deleteFile :: error", error);
      throw error;
    }
  }
}

const service = new Service();
export default service;
