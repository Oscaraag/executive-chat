import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  addDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
  orderBy,
} from 'firebase/firestore'
import db from './firebase'

export const createChatRoom = async (
  supervisorID: string,
  executiveUID: string
): Promise<void> => {
  try {
    // Crear el ID del chat concatenando el RUT del ejecutivo y el ID del supervisor
    const chatID = `${supervisorID}-${executiveUID}`

    // Crear una referencia al documento en Firestore
    const chatDocRef = doc(db, 'chats', chatID)

    // Crear el documento con un array vacío para los mensajes
    await setDoc(chatDocRef, {
      participants: [supervisorID, executiveUID],
      executiveUID: executiveUID,
      supervisorUID: supervisorID,
      supervisorName: 'Oscar Angel',
      executiveName: 'Ejecutivo',
      timestamp: serverTimestamp(),
    })

    console.log(`Chat room ${chatID} has been created or already exists`)
    return Promise.resolve()
  } catch (error) {
    console.error('Error creating chat room: ', error)
    return Promise.reject(error)
  }
}
export const sendMessage = async (
  chatID: string,
  senderID: string,
  text: string
): Promise<void> => {
  try {
    // Crear una referencia a la subcolección de mensajes en el documento del chat
    const messagesCollectionRef = collection(db, 'chats', chatID, 'messages')

    // Crear el objeto del mensaje
    const message = {
      senderID,
      userName: 'ZQ Chat',
      text,
      timestamp: serverTimestamp(),
    }

    // Agregar el mensaje como un nuevo documento en la subcolección de mensajes
    await addDoc(messagesCollectionRef, message)

    console.log(`Message sent in chat room ${chatID}, message: ${message}`)
    return Promise.resolve()
  } catch (error) {
    console.error('Error sending message: ', error)
    return Promise.reject(error)
  }
}

export interface Message {
  senderID: string
  text: string
  timestamp: Timestamp
}

export const listenForExecutiveMessages = (
  chatID: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
): (() => void) => {
  const messagesCollectionRef = collection(db, 'chats', chatID, 'messages')
  const messagesQuery = query(
    messagesCollectionRef,
    orderBy('timestamp', 'asc')
  )

  return onSnapshot(messagesQuery, (snapshot) => {
    const updatedMessages: Message[] = []
    snapshot.forEach((doc) => {
      const message = doc.data() as Message
      updatedMessages.push(message)
    })
    setMessages(updatedMessages)
  })
}
