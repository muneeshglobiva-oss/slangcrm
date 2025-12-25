import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PartManagement() {
  const [parts, setParts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    model_number: '',
    article_number: '',
    article_name: '',
    part_name: '',
    part_pseudo_name: '',
    part_description: '',
    part_weight: '',
    part_size: '',
    image: null,
  });
  const [refresh, setRefresh] = useState(0);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const params = { page, limit: 10 };
    if (search) params.q = search;
    axios.get('/api/parts', { params }).then(res => {
      setParts(res.data.parts || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    }).catch(err => {
      console.error('Error fetching parts:', err);
      setParts([]);
      setTotal(0);
      setTotalPages(1);
    });
  }, [page, search, refresh]);

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  }

  function handleEdit(part) {
    setEditing(part.id);
    setForm({ ...part, image: null });
  }

  function handleCancel() {
    setEditing(null);
    setForm({
      model_number: '',
      article_number: '',
      article_name: '',
      part_name: '',
      part_pseudo_name: '',
      part_description: '',
      part_weight: '',
      part_size: '',
      image: null,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== undefined) data.append(k, v);
    });
    if (editing) {
      await axios.put(`/api/parts/${editing}`, data);
    } else {
      await axios.post('/api/parts', data);
    }
    setRefresh(r => r + 1);
    handleCancel();
  }

  async function handleDelete(id) {
    if (confirm('Delete this part?')) {
      await axios.delete(`/api/parts/${id}`);
      setRefresh(r => r + 1);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Add / Edit Product Part</h1>
      <form className="bg-white rounded-lg shadow-md p-6 mb-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="model_number" className="block text-sm font-medium text-gray-700 mb-2">Model Number</label>
            <input id="model_number" name="model_number" value={form.model_number} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="article_number" className="block text-sm font-medium text-gray-700 mb-2">Article Number</label>
            <input id="article_number" name="article_number" value={form.article_number} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="article_name" className="block text-sm font-medium text-gray-700 mb-2">Article Name</label>
            <input id="article_name" name="article_name" value={form.article_name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="part_name" className="block text-sm font-medium text-gray-700 mb-2">Part Number</label>
            <input id="part_name" name="part_name" value={form.part_name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <label htmlFor="part_pseudo_name" className="block text-sm font-medium text-gray-700 mb-2">Part Pseudo Name</label>
            <textarea id="part_pseudo_name" name="part_pseudo_name" value={form.part_pseudo_name} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical" />
          </div>
          <div>
            <label htmlFor="part_weight" className="block text-sm font-medium text-gray-700 mb-2">Part Weight</label>
            <input id="part_weight" name="part_weight" value={form.part_weight} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="part_size" className="block text-sm font-medium text-gray-700 mb-2">Part Size</label>
            <input id="part_size" name="part_size" value={form.part_size} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="part_description" className="block text-sm font-medium text-gray-700 mb-2">Part Description</label>
          <textarea id="part_description" name="part_description" value={form.part_description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical" />
        </div>
        <div className="mb-6">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Image</label>
          <input type="file" id="image" name="image" accept="image/*" onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex gap-4">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">{editing ? 'Update' : 'Add'} Part</button>
          {editing && <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-semibold">Cancel</button>}
        </div>
      </form>
      <div className="part-list">
        <h2>All Parts</h2>
        <div className="search-paging">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search parts..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '300px' }}
            />
          </div>
          <div className="paging">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
            <span>Page {page} of {totalPages} ({total} total)</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-300 rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Model #</th>
                <th className="px-4 py-2 text-left">Article #</th>
                <th className="px-4 py-2 text-left">Article Name</th>
                <th className="px-4 py-2 text-left">Part Number</th>
                <th className="px-4 py-2 text-left">Pseudo Name</th>
                <th className="px-4 py-2 text-left">Weight</th>
                <th className="px-4 py-2 text-left">Size</th>
                <th className="px-4 py-2 text-left">Image</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parts.map(part => (
                <tr key={part.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setModal(part)}>
                  <td className="px-4 py-2 text-blue-600 underline">{part.model_number}</td>
                  <td className="px-4 py-2">{part.article_number}</td>
                  <td className="px-4 py-2">{part.article_name}</td>
                  <td className="px-4 py-2">{part.part_name}</td>
                  <td className="px-4 py-2">{part.part_pseudo_name}</td>
                  <td className="px-4 py-2">{part.part_weight}</td>
                  <td className="px-4 py-2">{part.part_size}</td>
                  <td className="px-4 py-2">
                    {part.image && <img src={`/uploads/${part.image}`} alt="part" className="w-10 h-10 object-cover rounded" />}
                  </td>
                  <td className="px-4 py-2">{part.part_description}</td>
                  <td className="px-4 py-2" onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleEdit(part)} className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</button>
                    <button onClick={() => handleDelete(part.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {modal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setModal(null)}>
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-4">{modal.model_number}</h2>
              {modal.image && <img src={`/uploads/${modal.image}`} alt="part" className="w-48 h-48 object-contain mb-4 mx-auto" />}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <div><span className="font-semibold">Model Number:</span> {modal.model_number}</div>
                  <div><span className="font-semibold">Article Number:</span> {modal.article_number}</div>
                  <div><span className="font-semibold">Article Name:</span> {modal.article_name}</div>
                  <div><span className="font-semibold">Part Weight:</span> {modal.part_weight}</div>
                  <div><span className="font-semibold">Part Size:</span> {modal.part_size}</div>
                  <div><span className="font-semibold">Part Description:</span> {modal.part_description}</div>
                </div>
                <div className="space-y-2">
                  <div><span className="font-semibold">Part Number:</span> {modal.part_name}</div>
                  <div><span className="font-semibold">Part Pseudo Name:</span> {modal.part_pseudo_name}</div>
                </div>
              </div>
              <button onClick={() => setModal(null)} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
