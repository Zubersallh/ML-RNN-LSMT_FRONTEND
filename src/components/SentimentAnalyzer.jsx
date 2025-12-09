import { useState } from 'react';

const SentimentAnalyzer = () => {
  const [text, setText] = useState('');
  const [model, setModel] = useState('lstm');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model: model
        })
      });

      const data = await response.json();

      if (data.success) {
        const resultData = data.data;
        setResult(resultData);
        
        setHistory(prev => [{
          id: Date.now(),
          text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
          label: resultData.label,
          confidence: resultData.confidence,
          model: resultData.meta.model,
          time: resultData.meta.time_ms,
          timestamp: new Date().toLocaleTimeString()
        }, ...prev.slice(0, 4)]);
      }
    } catch (err) {
      setError('Failed to analyze sentiment. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError('');
  };

  const exampleTexts = [
    "This movie was absolutely amazing! I loved every minute of it.",
    "Terrible experience. Would not recommend to anyone.",
    "It was okay, nothing special but not bad either."
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fcd34d" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              color: 'white',
              margin: 0
            }}>
              Sentiment Analyzer
            </h1>
          </div>
          <p style={{ color: '#e9d5ff', fontSize: '1.125rem' }}>
            Analyze text sentiment using RNN or LSTM neural networks
          </p>
        </div>

        {/* Main Card */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}>
          {/* Input Section */}
          <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Enter text to analyze
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit'
                }}
                rows="6"
                maxLength="1000"
                onFocus={(e) => e.target.style.borderColor = '#a855f7'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginTop: '0.5rem'
              }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {text.length}/1000 characters
                </span>
              </div>
            </div>

            {/* Examples */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Quick examples
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {exampleTexts.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setText(example)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.875rem',
                      background: '#f3e8ff',
                      color: '#7c3aed',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#e9d5ff'}
                    onMouseLeave={(e) => e.target.style.background = '#f3e8ff'}
                  >
                    Example {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.75rem'
              }}>
                Select Model
              </label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem'
              }}>
                <button
                  onClick={() => setModel('rnn')}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: model === 'rnn' ? '2px solid #a855f7' : '2px solid #e5e7eb',
                    background: model === 'rnn' ? '#f3e8ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
                         stroke={model === 'rnn' ? '#7c3aed' : '#9ca3af'} strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    <span style={{ 
                      fontWeight: 'bold',
                      color: model === 'rnn' ? '#7c3aed' : '#6b7280'
                    }}>
                      RNN
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                    Simple Recurrent Network
                  </p>
                </button>

                <button
                  onClick={() => setModel('lstm')}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: model === 'lstm' ? '2px solid #a855f7' : '2px solid #e5e7eb',
                    background: model === 'lstm' ? '#f3e8ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
                         stroke={model === 'lstm' ? '#7c3aed' : '#9ca3af'} strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span style={{ 
                      fontWeight: 'bold',
                      color: model === 'lstm' ? '#7c3aed' : '#6b7280'
                    }}>
                      LSTM
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                    Long Short-Term Memory
                  </p>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '1rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: 0 }}>
                  {error}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleSubmit}
                disabled={loading || !text.trim()}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: loading ? '#9ca3af' : 'linear-gradient(to right, #7c3aed, #6d28d9)',
                  color: 'white',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem'
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid white',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Analyze Sentiment
                  </>
                )}
              </button>
              
              <button
                onClick={handleClear}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#f3f4f6',
                  color: '#374151',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
                onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div style={{
              borderTop: '2px solid #f3f4f6',
              padding: '2rem',
              background: 'linear-gradient(to bottom right, #f3e8ff, #dbeafe)'
            }}>
              <h3 style={{ 
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>
                Analysis Result
              </h3>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                {/* Sentiment */}
                <div style={{
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  background: result.label === 'Positive' 
                    ? 'linear-gradient(to bottom right, #34d399, #10b981)' 
                    : 'linear-gradient(to bottom right, #f87171, #ef4444)',
                  color: 'white',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.75rem'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      {result.label === 'Positive' ? (
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                      ) : (
                        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                      )}
                    </svg>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {result.label}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: '0 0 0.25rem 0' }}>
                      Confidence
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                      {(result.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Performance */}
                <div style={{
                  padding: '1.5rem',
                  background: 'white',
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.75rem'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span style={{ 
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: '#1f2937'
                    }}>
                      Performance
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>
                      Processing Time
                    </p>
                    <p style={{ 
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#7c3aed',
                      marginBottom: '0.75rem'
                    }}>
                      {result.meta.time_ms} ms
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>
                      Model Used
                    </p>
                    <p style={{ 
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: 0
                    }}>
                      {result.meta.model}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Confidence Level
                </p>
                <div style={{
                  width: '100%',
                  background: '#e5e7eb',
                  borderRadius: '9999px',
                  height: '1rem',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    background: result.label === 'Positive' ? '#10b981' : '#ef4444',
                    width: `${result.confidence * 100}%`,
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div style={{
            marginTop: '2rem',
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            padding: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Recent Analysis
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {history.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: '#f9fafb',
                    borderRadius: '0.75rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <p style={{ 
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '0.25rem'
                    }}>
                      {item.text}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      {item.timestamp}
                    </p>
                  </div>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      background: item.label === 'Positive' ? '#d1fae5' : '#fee2e2',
                      color: item.label === 'Positive' ? '#065f46' : '#991b1b'
                    }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {item.model}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {item.time}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SentimentAnalyzer;