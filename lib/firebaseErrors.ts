import { FirebaseError } from 'firebase/app';

export const getFirebaseErrorMessage = (error: FirebaseError): string => {
  switch (error.code) {
    // Authentication errors
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact admin support.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Contact admin support.';
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please check your email and password.';
    
    // Firestore errors
    case 'permission-denied':
      return 'You do not have permission to access this data.';
    case 'not-found':
      return 'The requested document was not found.';
    case 'already-exists':
      return 'The document already exists.';
    case 'resource-exhausted':
      return 'Quota exceeded. Please try again later.';
    case 'failed-precondition':
      return 'The operation was rejected due to a failed precondition.';
    case 'aborted':
      return 'The operation was aborted due to a conflict.';
    case 'out-of-range':
      return 'The operation was attempted past the valid range.';
    case 'unimplemented':
      return 'This operation is not implemented or supported.';
    case 'internal':
      return 'Internal server error. Please try again later.';
    case 'unavailable':
      return 'The service is currently unavailable. Please try again later.';
    case 'data-loss':
      return 'Unrecoverable data loss or corruption occurred.';
    
    // Network errors
    case 'network-request-failed':
      return 'Network error. Please check your internet connection.';
    
    // Default
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

export const isFirebaseError = (error: any): error is FirebaseError => {
  return error && typeof error.code === 'string' && typeof error.message === 'string';
};