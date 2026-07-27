import React, { useState, useEffect } from 'react';

// 💡 バックエンドサーバーのURL（ポート番号等は環境に合わせて変更してください）
const API_BASE_URL = 'http://localhost:3000';

function Button({ onClick, children, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onClick} // disabled時はクリックできないようにガード
      disabled={disabled}
      style={{
        backgroundColor: disabled ? '#333' : '#444',
        color: disabled ? '#666' : '#ccc',
        border: '1px solid #666',
        padding: '4px 12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderRadius: '3px',
        fontSize: '0.9em'
      }}
    >
      {children}
    </button>
  );
}

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [symptom, setSymptom] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  // 📝 課題完了の条件：初回表示で自分のDBからデータを自動取得する
  useEffect(() => {
    fetchLatestReply();
  }, []);

  // 3. 返答内容の取得処理 (GET /api/replies)
  const fetchLatestReply = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/replies`);
      if (!response.ok) throw new Error('データの取得に失敗しました');
      const data = await response.json();
      
      // DBから取得した最新のメッセージを画面に表示（リロードしてもここから復元される）
      if (data && data.message) {
        setReplyMessage(data.message);
      }
    } catch (error) {
      console.error("履歴取得エラー:", error);
    }
  };

  // 1. ログイン実行 (POST /api/login)
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("メールアドレスとパスワードを入力してください！");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok) {
        setLoginMessage("ログイン成功");
      } else {
        setLoginMessage(`ログイン失敗: ${data.error || '認証エラー'}`);
      }
    } catch (error) {
      setLoginMessage("通信エラーが発生しました");
    }
  };

  // 2. 新規診断テスト (POST /api/results)
  const handleDiagnose = async () => {
    if (!symptom.trim()) {
      alert("症状を入力してください！");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptom })
      });
      const data = await response.json();

      if (!response.ok) throw new Error('診断送信に失敗しました');

      // 💡 送信成功後、DBに新しく保存された最新データをすぐに再取得して画面を更新
      fetchLatestReply();
      setSymptom(''); // 入力欄をクリア
    } catch (error) {
      alert("診断エラーが発生しました");
    }
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto 20px auto',
    textAlign: 'center',
    border: '1px solid #555',
    padding: '30px 20px',
    borderRadius: '4px',
    backgroundColor: '#1e1e1e'
  };

  const titleStyle = {
    fontSize: '1.1em',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#e0e0e0',
    textAlign: 'left'
  };

  const inputStyle = {
    backgroundColor: '#333',
    border: '1px solid #555',
    color: 'white',
    padding: '5px 10px',
    width: '250px',
    marginBottom: '15px',
    borderRadius: '3px'
  };

  return (
    <div
      style={{
        padding: '40px 20px',
        color: 'white',
        backgroundColor: '#1a1a1a',
        minHeight: '100vh',
        fontFamily: 'sans-serif'
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          fontSize: '2.5em',
          marginBottom: '40px',
          fontWeight: 'bold',
          letterSpacing: '2px'
        }}
      >
        AI病気診断アプリ
      </h1>

      {/* 1. ログインテスト */}
      <div style={containerStyle}>
        <div style={titleStyle}>1. ログインテスト (POST /api/login)</div>

        <input
          type="text"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <br />

        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <br />

        <Button onClick={handleLogin}>ログイン実行</Button>

        {loginMessage && (
          <p
            style={{
              fontWeight: 'bold',
              color: '#00ff66', // 💡 ダークモードで見やすいように明るい緑に変更しました
              marginTop: '10px',
              fontSize: '0.95em'
            }}
          >
            {loginMessage}
          </p>
        )}
      </div>

      {/* 2. 新規診断テスト */}
      <div style={containerStyle}>
        <div style={titleStyle}>2. 新規診断テスト (POST /api/results)</div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '5px',
            alignItems: 'center'
          }}
        >
          <input
            type="text"
            placeholder="症状を入力 (例: 熱がある)"
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            style={{
              ...inputStyle,
              width: '220px',
              marginBottom: 0
            }}
          />

          <Button onClick={handleDiagnose}>診断する</Button>
        </div>

        {symptom && (
          <p style={{ marginTop: '15px', color: '#00ffcc', fontSize: '0.9em' }}>
            入力中の症状：{symptom}
          </p>
        )}
      </div>

      {/* 3. 返答内容の受け取り */}
      <div style={containerStyle}>
        <div style={titleStyle}>3. 返答内容の受け取り (GET /api/replies)</div>

        <div style={{ marginBottom: '20px' }}>
          {/* 💡 ボタン押下時も実通信の取得処理を走らせる */}
          <Button onClick={fetchLatestReply}>履歴を更新</Button>
        </div>

        {replyMessage && (
          <div>
            <div
              style={{
                backgroundColor: 'white',
                color: 'black',
                padding: '15px',
                borderRadius: '4px',
                textAlign: 'left',
                fontSize: '0.95em',
                marginBottom: '15px'
              }}
            >
              {replyMessage}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '15px', borderTop: '1px solid #444', paddingTop: '15px' }}>
              <label style={{ fontSize: '0.9em', cursor: 'pointer', color: '#aaa' }}>
                <input 
                  type="checkbox" 
                  checked={isAgreed} 
                  onChange={(e) => setIsAgreed(e.target.checked)} 
                  style={{ marginRight: '8px' }}
                />
                内容を確認しました（医師の診断の代わりになりません）
              </label>

              <Button onClick={() => alert("承諾しました")} disabled={!isAgreed}>
                承諾を送信
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
