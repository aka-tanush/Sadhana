import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  updateEmail,
  deleteUser,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  githubProvider,
  microsoftProvider,
  appleProvider
} from '../lib/firebase';
import { UserProfileData } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfileData | null;
  loading: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  signUpWithEmail: (fullName: string, email: string, pass: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string, rememberMe?: boolean) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInGuest: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfileData>) => Promise<void>;
  changePassword: (newPass: string) => Promise<void>;
  changeEmailAddress: (newEmail: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  signOutUser: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync Auth State & Firestore Profile
  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthError(null);

      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);

        // Listen for user profile changes in Firestore
        unsubscribeDoc = onSnapshot(userRef, async (snapshot) => {
          if (snapshot.exists()) {
            setUserProfile(snapshot.data() as UserProfileData);
          } else {
            // Initialize default profile if doc doesn't exist yet
            const defaultProfile: UserProfileData = {
              uid: currentUser.uid,
              fullName: currentUser.displayName || (currentUser.isAnonymous ? 'Guest Devotee' : 'Devotee'),
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || '',
              dateJoined: new Date().toISOString().split('T')[0],
              preferredLanguage: 'English',
              theme: 'light',
              notificationsEnabled: true,
              soundEnabled: true,
              onboardingCompleted: false
            };
            try {
              await setDoc(userRef, defaultProfile, { merge: true });
              setUserProfile(defaultProfile);
            } catch (err) {
              console.error('Error creating user profile in Firestore:', err);
            }
          }
        }, (err) => {
          console.warn('Firestore snapshot error for user profile:', err);
        });
      } else {
        setUserProfile(null);
        if (unsubscribeDoc) unsubscribeDoc();
      }

      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const signUpWithEmail = async (fullName: string, email: string, pass: string) => {
    setAuthError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(res.user, { displayName: fullName });
      
      const newProfile: UserProfileData = {
        uid: res.user.uid,
        fullName,
        email,
        photoURL: '',
        dateJoined: new Date().toISOString().split('T')[0],
        preferredLanguage: 'English',
        theme: 'light',
        notificationsEnabled: true,
        soundEnabled: true,
        onboardingCompleted: false
      };

      await setDoc(doc(db, 'users', res.user.uid), newProfile);
      setUserProfile(newProfile);

      // Send email verification
      try {
        await sendEmailVerification(res.user);
      } catch (err) {
        console.warn('Email verification send issue:', err);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Failed to register account');
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string, rememberMe = true) => {
    setAuthError(null);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to sign in');
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setAuthError(err.message || 'Google sign in failed');
      throw err;
    }
  };

  const signInWithMicrosoft = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, microsoftProvider);
    } catch (err: any) {
      setAuthError(err.message || 'Microsoft sign in failed');
      throw err;
    }
  };

  const signInWithApple = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, appleProvider);
    } catch (err: any) {
      setAuthError(err.message || 'Apple sign in failed');
      throw err;
    }
  };

  const signInWithGithub = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (err: any) {
      setAuthError(err.message || 'GitHub sign in failed');
      throw err;
    }
  };

  const signInGuest = async () => {
    setAuthError(null);
    try {
      await signInAnonymously(auth);
    } catch (err: any) {
      setAuthError(err.message || 'Guest mode failed');
      throw err;
    }
  };

  const sendPasswordReset = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to send password reset email');
      throw err;
    }
  };

  const sendVerificationEmail = async () => {
    if (!auth.currentUser) return;
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to resend verification email');
      throw err;
    }
  };

  const updateProfileData = async (data: Partial<UserProfileData>) => {
    if (!user) return;
    try {
      if (data.fullName || data.photoURL !== undefined) {
        await updateProfile(user, {
          displayName: data.fullName ?? user.displayName,
          photoURL: data.photoURL ?? user.photoURL
        });
      }
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, data);
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const changePassword = async (newPass: string) => {
    if (!user) return;
    try {
      await updatePassword(user, newPass);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to update password');
      throw err;
    }
  };

  const changeEmailAddress = async (newEmail: string) => {
    if (!user) return;
    try {
      await updateEmail(user, newEmail);
      await updateProfileData({ email: newEmail });
    } catch (err: any) {
      setAuthError(err.message || 'Failed to update email');
      throw err;
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    try {
      const uid = user.uid;
      // Delete profile doc
      await deleteDoc(doc(db, 'users', uid));
      await deleteUser(user);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to delete account');
      throw err;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err: any) {
      setAuthError(err.message || 'Sign out failed');
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;
    try {
      await updateProfileData({ onboardingCompleted: true });
    } catch (err) {
      console.error('Error setting onboarding completed:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        authError,
        setAuthError,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        signInWithMicrosoft,
        signInWithApple,
        signInWithGithub,
        signInGuest,
        sendPasswordReset,
        sendVerificationEmail,
        updateProfileData,
        changePassword,
        changeEmailAddress,
        deleteAccount,
        signOutUser,
        completeOnboarding
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
