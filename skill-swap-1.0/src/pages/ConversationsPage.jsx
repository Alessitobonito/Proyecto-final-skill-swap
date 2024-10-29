import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

const ConversationsPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const chatsRef = collection(db, 'chats');
        const q = query(
          chatsRef,
          where('participants', 'array-contains', user.uid),
          orderBy('timestamp', 'desc'),
          limit(50)
        );

        const querySnapshot = await getDocs(q);
        const conversationsMap = new Map();

        querySnapshot.forEach(doc => {
          const data = doc.data();
          const otherParticipant = data.participants.find(id => id !== user.uid);
          
          if (!conversationsMap.has(otherParticipant)) {
            conversationsMap.set(otherParticipant, {
              id: otherParticipant,
              name: data.senderId === user.uid ? data.recipientName : data.senderName,
              lastMessage: data.text,
              timestamp: data.timestamp
            });
          }
        });

        setConversations(Array.from(conversationsMap.values()));
      } catch (error) {
        console.error('Error fetching conversations:', error);
        // Considera agregar un mensaje de error amigable para el usuario aquí
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  const handleConversationSelect = (conversation) => {
    navigate(`/app/chat/${conversation.id}`);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading conversations...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Conversations</h1>
      {conversations.length === 0 ? (
        <p>You don't have any conversations yet.</p>
      ) : (
        <div className="space-y-4">
          {conversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => handleConversationSelect(conversation)}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="font-semibold">{conversation.name}</div>
              <div className="text-sm text-gray-500 truncate">{conversation.lastMessage}</div>
              <div className="text-xs text-gray-400">
                {conversation.timestamp?.toDate().toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationsPage;