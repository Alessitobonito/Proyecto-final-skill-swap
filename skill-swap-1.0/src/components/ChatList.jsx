import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(chatList);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">My Conversations</h2>
      <div className="space-y-4">
        {chats.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No conversations yet</p>
            <p className="text-gray-400 text-sm mt-2">Start chatting with someone to see your conversations here</p>
          </div>
        ) : (
          chats.map(chat => {
            const otherParticipantId = chat.participants.find(id => id !== user.uid);
            const lastMessage = chat.messages?.[chat.messages.length - 1];
            
            return (
              <Link
                key={chat.id}
                to={`/app/chat/${otherParticipantId}/${encodeURIComponent(chat.participantNames?.[otherParticipantId] || 'User')}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {chat.participantNames?.[otherParticipantId] || 'User'}
                    </h3>
                    {lastMessage && (
                      <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                        {lastMessage.text}
                      </p>
                    )}
                  </div>
                  {lastMessage?.timestamp && (
                    <span className="text-xs text-gray-400">
                      {new Date(lastMessage.timestamp).toLocaleString()}
                    </span>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;