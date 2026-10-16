
import { useEffect, useState } from 'react';

function BackendTest() {
  const [message, setMessage] = useState('Loading...');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/message')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
      })
      .catch(() => {
        setError('Could not connect to the backend.');
      });
  }, []);

  return (
    <div>
      <h2>Backend Connection Test</h2>
      {error ? <p>{error}</p> : <p>{message}</p>}
    </div>
  );
}

export default BackendTest;
