import React, { useState, useEffect } from 'react'
import './styles.css'
import {
  createChatRoom,
  sendMessage,
  listenForExecutiveMessages,
} from '../utils'

interface Message {
  senderID: string
  text: string
  timestamp: { seconds: number; nanoseconds: number }
}

const Chat = () => {
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const supervisorID = '23497900' // Reemplazar con el ID real del supervisor
  const executiveRUT = '6789' // Reemplazar con el RUT real del ejecutivo
  const chatID = `${supervisorID}-${executiveRUT}`

  useEffect(() => {
    const unsubscribe = listenForExecutiveMessages(chatID, setMessages)

    return () => {
      unsubscribe()
    }
  }, [chatID])

  const handleNewMessageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewMessage(event.target.value)
  }

  const handleSendMessage = (
    event: React.FormEvent,
    chatID: string,
    senderID: string
  ) => {
    event.preventDefault()
    sendMessage(chatID, senderID, newMessage)
    setNewMessage('')
  }

  const handleStartConversation = async () => {
    await createChatRoom(supervisorID, executiveRUT)
  }

  return (
    <div className='chat'>
      <button onClick={handleStartConversation}>Iniciar conversación</button>
      <div className='messages'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.senderID === supervisorID
                ? 'message supervisor'
                : 'message ejecutivo'
            }
          >
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <form
        className='message-form'
        onSubmit={(event) => handleSendMessage(event, chatID, supervisorID)}
      >
        <input
          type='text'
          value={newMessage}
          onChange={handleNewMessageChange}
          placeholder='Escribe tu mensaje...'
        />
        <button type='submit'>Enviar</button>
      </form>
    </div>
  )
}

export default Chat
