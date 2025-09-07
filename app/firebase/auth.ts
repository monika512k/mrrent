import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  AuthError
} from "firebase/auth";
import { auth } from "./config";

// Auth providers
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("pramod",result);
    localStorage.setItem('user_loggedin', 'true');
    return { user: result.user, error: null };
  } catch (error) {
    const authError = error as AuthError;
    console.error("pramod_",authError);
    return { user: null, error: authError.message };
  }
};

// Sign in with Apple
export const signInWithApple = async () => {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    console.log("pramod_apple",result);
    localStorage.setItem('user_loggedin', 'true');
    return { user: result.user, error: null };
  } catch (error) {
    const authError = error as AuthError;
    console.error("pramod_apple",authError);
    return { user: null, error: authError.message };
  }
};

// Sign out
export const signOut = () => firebaseSignOut(auth);

// Subscribe to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
}; 