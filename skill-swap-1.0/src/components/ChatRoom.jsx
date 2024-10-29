import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, onSnapshot, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import ChatInput from './ChatInput';

const ChatRoom = () => {
  const [chat, setChat] = useState(null);
  const { recipientId, recipientName } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !recipientId) return;

    const chatId = [user.uid, recipientId].sort().join('_');
    const chatRef = doc(db, 'chats', chatId);

    // Primero verificamos si el chat existe
    const initializeChat = async () => {
      const chatDoc = await getDoc(chatRef);
      if (!chatDoc.exists()) {
        // Si no existe, lo creamos
        await setDoc(chatRef, {
          participants: [user.uid, recipientId],
          messages: [],
          lastTimestamp: serverTimestamp(),
          createdAt: serverTimestamp()
        });
      }
    };

    initializeChat();

    // Luego establecemos el listener
    const unsubscribe = onSnapshot(chatRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setChat({ id: docSnapshot.id, ...docSnapshot.data() });
      }
    }, (error) => {
      console.error("Error listening to chat:", error);
    });

    return () => unsubscribe();
  }, [user, recipientId]);

  const sendMessage = async (text) => {
    if (!chat) return;

    const chatRef = doc(db, 'chats', chat.id);
    try {
      await updateDoc(chatRef, {
        messages: arrayUnion({
          senderId: user.uid,
          recipientId: recipientId,
          text: text,
          timestamp: serverTimestamp()
        }),
        lastTimestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!chat) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white shadow-sm p-4">
        <h2 className="text-xl font-semibold">Chat with {decodeURIComponent(recipientName)}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages && chat.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.senderId === user.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.senderId === user.uid
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p>{message.text}</p>
              <span className="text-xs opacity-75">
                {message.timestamp?.toDate().toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ChatRoom;