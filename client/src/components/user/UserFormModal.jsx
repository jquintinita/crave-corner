import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserFormModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Cashier',
  });
  const [notification, setNotification] = useState({ message: '', type: '' });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        role: initialData.role || 'Cashier',
      });
    } else {
      setFormData({ name: '', email: '', role: 'Cashier' });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const isEditing = Boolean(initialData);
    const endpoint = isEditing
      ? `${API_BASE_URL}/api/users/${initialData.id}`
      : `${API_BASE_URL}/api/users`;
    const method = isEditing ? 'put' : 'post';

    try {
      await axios({ method, url: endpoint, data: formData });
      setNotification({ message: '✅ User saved successfully!', type: 'success' });
      setTimeout(() => {
        setNotification({ message: '', type: '' });
        onSave();
      }, 1500);
    } catch (err) {
      console.error('❌ Failed to save user:', err);
      setNotification({ message: '❌ Failed to save user.', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {initialData ? 'Edit User' : 'Add New User'}
        </h2>

        {notification.message && (
          <div
            className={`p-2 mb-4 rounded text-sm ${
              notification.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className="space-y-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
          >
            <option value="Admin">Admin</option>
            <option value="Cashier">Cashier</option>
            <option value="Inventory Manager">Inventory Manager</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {initialData ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
