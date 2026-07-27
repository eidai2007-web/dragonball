import React, { useState, useEffect } from 'react';

export default function App() {
  const [username, setUsername] = useState('');
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  const getMessages = async () => {
    try {
      const response = await fetch('api/messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("メッセージ取得エラー:", error);
    }
  };

  useEffect(() => {
    getMessages();
    const interval = setInterval(getMessages, 3000); 
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!username.trim() || !text.trim()) return;

    try {
      await fetch('api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, text })
      });
      setText(''); 
      getMessages(); 
    } catch (error) {
      console.error("メッセージ送信エラー:", error);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '480px', margin: '40px auto', background: '#f0f4f8', padding: '16px', borderRadius: '8px' }}>
      <h1 style={{ background: '#0d7377', color: 'white', padding: '12px 20px', borderRadius: '6px', fontSize: '20px', margin: '0 0 12px 0' }}>
        チャットアプリ (React版)
      </h1>
      
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input 
          type="text" 
          placeholder="名前" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          style={{ width: '80px', padding: '8px 10px', border: '1px solid #bbb', borderRadius: '4px', fontSize: '15px', color: 'black', backgroundColor: 'white' }}
        />
        <input 
          type="text" 
          placeholder="メッセージ" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          required 
          style={{ flex: 1, padding: '8px 10px', border: '1px solid #bbb', borderRadius: '4px', fontSize: '15px', color: 'black', backgroundColor: 'white' }}
        />
        <button type="submit" style={{ padding: '8px 14px', background: '#0d7377', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          送信
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {messages.map((msg, index) => (
          <li key={index} style={{ background: 'white', color: 'black', padding: '8px 12px', marginBottom: '8px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'left' }}>
            <strong>{msg.username}</strong>: {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
