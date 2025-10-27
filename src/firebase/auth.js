import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
  } from "firebase/auth";
  import { auth } from "./firebaseApp"; // ✅ import the auth instance
  
  class AuthService {
    constructor() {
      this.auth = auth;
    }
  
    // ✅ Register a new user and automatically log them in
    async registerUser(email, password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        const user = userCredential.user;
  
        // Optionally call login right after registration
        await this.loginUser(email, password);
  
        console.log("User registered successfully:", user.email);
        return user;
      } catch (error) {
        console.error("Firebase Auth :: registerUser :: error", error.code, error.message);
        throw error; // rethrow so UI can show messages
      }
    }
  
    // ✅ Login user
    async loginUser(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        const user = userCredential.user;
        console.log("User logged in:", user.email);
        return user;
      } catch (error) {
        console.error("Firebase Auth :: loginUser :: error", error.code, error.message);
        throw error;
      }
    }
  
    // ✅ Logout user
    async logoutUser() {
      try {
        await signOut(this.auth);
        console.log("User logged out successfully");
      } catch (error) {
        console.error("Firebase Auth :: logoutUser :: error", error.code, error.message);
        throw error;
      }
    }
  
    // ✅ Listen for login/logout state changes
    onAuthChange(callback) {
      return onAuthStateChanged(this.auth, callback);
    }
  }
  
  // Export a single instance (Singleton)
  const authService = new AuthService();
  export default authService;
  