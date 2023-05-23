import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: 'AIzaSyBYXkd8RqHPYKbBCs4Bs_Lvqo5k3nlX200',
  authDomain: 'zq-chat-7cf50.firebaseapp.com',
  projectId: 'zq-chat-7cf50',
  storageBucket: 'zq-chat-7cf50.appspot.com',
  messagingSenderId: '353735704566',
  appId: '1:353735704566:web:20cce562bc90a8c56051d7',
  measurementId: 'G-QJ1NLWXVSB',
}

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

export default db
