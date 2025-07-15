import { useEffect, useState } from 'react';
import axios from 'axios';
import UserFormModal from '../../components/user/UserFormModal';
import ConfirmDeleteModal from '../../components/user/ConfirmDeleteModal';
import UserList from '../../components/user/UserList';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = () => {
    fetchUsers();
    setShowForm(false);
    setEditingUser(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/users/${userToDelete.id}`);
      fetchUsers();
    } catch (err) {
      console.error("❌ Error deleting user:", err);
    } finally {
      setShowConfirm(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-4">

      <UserList
        users={users}
        loading={loading}
        error={error}
        onEdit={(user) => {
          setEditingUser(user);
          setShowForm(true);
        }}
        onDelete={(user) => {
          setUserToDelete(user);
          setShowConfirm(true);
        }}
      />

      <UserFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingUser(null);
        }}
        onSave={handleSave}
        initialData={editingUser}
      />

      <ConfirmDeleteModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        message={`Are you sure you want to delete user "${userToDelete?.name}"?`}
      />
    </div>
  );
}
