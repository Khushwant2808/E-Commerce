import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Search, Shield, ShieldOff, Store, StoreIcon,
    Trash2, ChevronDown, X, AlertTriangle
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await adminAPI.getUsers();
            setUsers(data.users || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        setActionLoading(userId);
        try {
            await adminAPI.updateUserRole(userId, newRole);
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            toast.success(`User role updated to ${newRole}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update role');
        } finally {
            setActionLoading(null);
        }
    };

    const handleToggleSeller = async (userId, currentStatus) => {
        setActionLoading(userId);
        try {
            await adminAPI.toggleUserSeller(userId, !currentStatus);
            setUsers(users.map(u => u.id === userId ? { ...u, canSell: !currentStatus } : u));
            toast.success(`Seller status ${!currentStatus ? 'enabled' : 'disabled'}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update seller status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        setActionLoading(userToDelete.id);
        try {
            await adminAPI.deleteUser(userToDelete.id);
            setUsers(users.filter(u => u.id !== userToDelete.id));
            toast.success('User deleted successfully');
            setShowDeleteModal(false);
            setUserToDelete(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === 'all' ||
            (filterRole === 'admin' && user.role === 'admin') ||
            (filterRole === 'seller' && user.canSell) ||
            (filterRole === 'user' && user.role === 'user' && !user.canSell);
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-12 w-64 bg-white/5 rounded-xl animate-pulse" />
                <div className="glass-card">
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold">
                        <span className="gradient-text">User Management</span>
                    </h1>
                    <p className="text-gray-400 mt-1">{users.length} users registered</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-12"
                    />
                </div>
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="input-field w-full sm:w-48"
                >
                    <option value="all">All Users</option>
                    <option value="admin">Admins</option>
                    <option value="seller">Sellers</option>
                    <option value="user">Regular Users</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left p-4 text-gray-400 font-medium">User</th>
                                <th className="text-left p-4 text-gray-400 font-medium">Role</th>
                                <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                                <th className="text-left p-4 text-gray-400 font-medium">Joined</th>
                                <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold">
                                                    {user.name?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-sm text-gray-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                                                    ? 'bg-purple-500/20 text-purple-400'
                                                    : 'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-2">
                                                {user.canSell && (
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                                        Seller
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Toggle Admin */}
                                                <button
                                                    onClick={() => handleToggleRole(user.id, user.role)}
                                                    disabled={actionLoading === user.id}
                                                    className={`p-2 rounded-lg transition-colors ${user.role === 'admin'
                                                            ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                        }`}
                                                    title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                                >
                                                    {user.role === 'admin' ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                                                </button>

                                                {/* Toggle Seller */}
                                                <button
                                                    onClick={() => handleToggleSeller(user.id, user.canSell)}
                                                    disabled={actionLoading === user.id}
                                                    className={`p-2 rounded-lg transition-colors ${user.canSell
                                                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                        }`}
                                                    title={user.canSell ? 'Revoke Seller' : 'Grant Seller'}
                                                >
                                                    {user.canSell ? <Store className="w-4 h-4" /> : <StoreIcon className="w-4 h-4" />}
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => {
                                                        setUserToDelete(user);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    disabled={actionLoading === user.id}
                                                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0f0f0f] rounded-2xl p-6 max-w-md w-full border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Delete User</h3>
                                    <p className="text-gray-400 text-sm">This action cannot be undone</p>
                                </div>
                            </div>
                            <p className="text-gray-300 mb-6">
                                Are you sure you want to delete <strong>{userToDelete?.name}</strong>?
                                All their data will be permanently removed.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteUser}
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-semibold transition-colors"
                                >
                                    {actionLoading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsers;
