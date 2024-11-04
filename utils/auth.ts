import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  User,
  signOut,
} from 'firebase/auth';
import { auth } from '../newConfig';
import { setUserInfo, clearUserInfo } from '../redux/reducers/useSlice';
import { AppDispatch } from '../redux/store/store';
import { addUser, getUser, updateUserInFirestore } from './firestore';

// Типи для реєстрації та авторизації
interface AuthCredentials {
  email: string;
  password: string;
}

// Функція для реєстрації користувача
export const registerDB = async ({ email, password }: AuthCredentials) => {
  try {
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    const user = credentials.user;

    await addUser(user.uid, { uid: user.uid, email: user.email || '', displayName: user.displayName || ''})
  } catch (error) {
    console.log('SIGNUP ERROR:', error)
  };
};

// Функція для логіну користувача та збереження його в Redux
export const loginDB = async ({ email, password }: AuthCredentials, dispatch: AppDispatch) => {
  try {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    const user = credentials.user;

    dispatch(setUserInfo({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    }));
    return user;
  } catch (error) {
    throw error;
  }
};

  // Функція для логауту
export const logoutDB = async (dispatch: AppDispatch) => {
  try {
    await signOut(auth);
    // Очистити інформацію про користувача у Redux
    dispatch(clearUserInfo());
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Відстеження змін у стані аутентифікації
export const authStateChanged = (dispatch: AppDispatch) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userData = await getUser(user.uid)

      dispatch(setUserInfo({
        ...userData,
        uid: user.uid,
        email: user.email || '',
      }));
    } else {
      dispatch(clearUserInfo());
    }
  });
};