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
    <div>
      <h2>Your Chats</h2>
      {chats.map(chat => (
        <Link key={chat.id} to={`/chat/${chat.id}`}>
          Chat with {chat.participants.find(id => id !== user.uid)}
        </Link>
      ))}
    </div>
  );
};

export default ChatList;