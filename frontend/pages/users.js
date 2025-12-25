import { useState, useEffect } from 'react';

export default function Users({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    password: ''
  });

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save user');

      setShowForm(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'user', password: '' });
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete user');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  if (user && user.role !== 'admin') {
    return <div className="p-8 text-center text-red-600">Access denied. Admin privileges required.</div>;
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <button
        onClick={() => {
          setEditingUser(null);
          setFormData({ name: '', email: '', role: 'user', password: '' });
          setShowForm(true);
        }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add New User
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border border-gray-300 rounded">
          <h2 className="text-xl font-semibold mb-4">{editingUser ? 'Edit User' : 'Add New User'}</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role:</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password {editingUser ? '(leave blank to keep current)' : ''}:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!editingUser}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="mr-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {editingUser ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8f9fa' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Name</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Email</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Role</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Created At</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{u.name}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{u.email}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{u.role}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{new Date(u.created_at).toLocaleDateString()}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                <button
                  onClick={() => handleEdit(u)}
                  style={{ padding: '0.25rem 0.5rem', background: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.25rem' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  style={{ padding: '0.25rem 0.5rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
