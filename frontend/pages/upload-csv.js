import React, { useState } from 'react';

export default function UploadCSV() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a CSV file.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('csv', file);
    try {
      const res = await fetch('/api/parts/upload-csv', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Successfully uploaded! Inserted ${data.inserted} parts.`);
      } else {
        setMessage(data.error || 'Upload failed.');
      }
    } catch (err) {
      setMessage('Error uploading file.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>Upload Parts CSV</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit" disabled={loading} style={{ marginLeft: 12 }}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p style={{ marginTop: 16 }}>{message}</p>}
      <div style={{ marginTop: 24, fontSize: 14, color: '#555' }}>
        <b>CSV columns required:</b><br />
        model_number, article_number, article_name, part_name, part_pseudo_name, part_description, part_weight, part_size, image
      </div>
    </div>
  );
}
