import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth } from "./firebaseApp";

class AuthService {
  constructor() {
    this.auth = auth;
  }

  // ✅ Helper to extract serializable user data
  serializeUser(user) {
    if (!user) return null;
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
  }

  async registerUser(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      await this.loginUser(email, password);
      console.log("User registered successfully:", user.email);
      return this.serializeUser(user); // ✅ Return serializable data
    } catch (error) {
      console.error("Firebase Auth :: registerUser :: error", error.code, error.message);
      throw error;
    }
  }

  async loginUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      console.log("User logged in:", user.email);
      return this.serializeUser(user); // ✅ Return serializable data
    } catch (error) {
      console.error("Firebase Auth :: loginUser :: error", error.code, error.message);
      throw error;
    }
  }

  async logoutUser() {
    try {
      await signOut(this.auth);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Firebase Auth :: logoutUser :: error", error.code, error.message);
      throw error;
    }
  }

  onAuthChange(callback) {
    return onAuthStateChanged(this.auth, (user) => {
      callback(this.serializeUser(user)); // ✅ Return serializable data
    });
  }

  // ✅ Get the current logged-in user
  getCurrentUser() {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        this.auth,
        (user) => {
          unsubscribe();
          resolve(this.serializeUser(user)); // ✅ Return serializable data
        },
        (error) => reject(error)
      );
    });
  }
}

const authService = new AuthService();
export default authService;