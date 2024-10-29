import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

const ChatComponent = () => {
  const { recipientId, recipientName } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !recipientId) {
      console.error('Missing user or recipientId');
      return;
    }

    const chatId = [user.uid, recipientId].sort().join('_');
    const q = query(
      collection(db, 'chats'),
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(fetchedMessages);
    }, (error) => {
      console.error('Error fetching messages:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load messages. Please try again later.'
      });
      navigate('/app/conversations');
    });

    return () => unsubscribe();
  }, [user, recipientId, navigate]);

  const sendMessage = async (e) => {
    e.preventDefault();
  
    if (!user || !recipientId) {
      console.error('Missing user or recipientId');
      return;
    }
  
    if (newMessage.trim() === '') return;
  
    setIsLoading(true);
  
    try {
      const chatId = [user.uid, recipientId].sort().join('_');
      const messageData = {
        chatId,
        senderId: user.uid,
        senderName: user.displayName || user.email,
        recipientId,
        recipientName: decodeURIComponent(recipientName),
        text: newMessage.trim(),
        timestamp: serverTimestamp(),
        read: false,
        participants: [user.uid, recipientId]
      };
  
      console.log('Chat ID being created:', chatId);
      console.log('Message data:', messageData);
  
      await addDoc(collection(db, 'chats'), messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to send message. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !recipientId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Cannot load chat at this time.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50">
      <div className="bg-white shadow-sm p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Chat with {decodeURIComponent(recipientName) || 'User'}
        </h2>
        <button
          onClick={() => navigate('/app/conversations')}
          className="text-gray-600 hover:text-gray-800"
        >
          Back to Conversations
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === user.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] break-words p-3 rounded-lg ${
                message.senderId === user.uid
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {message.timestamp?.toDate().toLocaleTimeString() || 'Sending...'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`bg-blue-500 text-white px-6 py-2 rounded-lg font-medium
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}
              transition duration-200`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;