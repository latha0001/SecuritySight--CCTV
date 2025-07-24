import React, { useState } from 'react';
import { Users as UsersIcon, Plus, Shield, User, Mail, Calendar, Settings, Trash2 } from 'lucide-react';
interface UserData {id: string; name: string; email: string; role: 'admin' | 'operator' | 'viewer'; status: 'active' | 'inactive'; lastLogin: string; createdAt: string; avatar?: string;}
const Users: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const filteredUsers = users.filter(user => {if (selectedRole === 'all') return true; return user.role === selectedRole;});
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'operator':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'viewer':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };
  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30';
    };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-slate-400">Manage system users and permissions</p>
        </div>
        <button  onClick={() => setShowAddUser(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{users.length}</div>
              <div className="text-slate-400 text-sm">Total Users</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {users.filter(u => u.status === 'active').length}
              </div>
              <div className="text-slate-400 text-sm">Active Users</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {users.filter(u => u.role === 'admin').length}
              </div>
              <div className="text-slate-400 text-sm">Administrators</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {users.filter(u => {
                  const lastLogin = new Date(u.lastLogin);
                  const today = new Date();
                  return lastLogin.toDateString() === today.toDateString();
                }).length}
              </div>
              <div className="text-slate-400 text-sm">Active Today</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4 mb-8">
        <span className="text-slate-400 text-sm">Filter by role:</span>
        {['all', 'admin', 'operator', 'viewer'].map((role) => (
          <button key={role} onClick={() => setSelectedRole(role)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedRole === role ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="text-left p-4 text-slate-300 font-medium">User</th>
                <th className="text-left p-4 text-slate-300 font-medium">Role</th>
                <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                <th className="text-left p-4 text-slate-300 font-medium">Last Login</th>
                <th className="text-left p-4 text-slate-300 font-medium">Created</th>
                <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <UsersIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-300 text-lg font-medium">No users found</p>
          <p className="text-slate-500 text-sm">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};
interface UserRowProps { user: UserData;}
const UserRow: React.FC<UserRowProps> = ({ user }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'operator':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'viewer':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };
  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-500/10 text-green-400 border-green-500/30'
      : 'bg-red-500/10 text-red-400 border-red-500/30';
  };
  return (
    <tr className="border-t border-slate-700 hover:bg-slate-700/50 transition-colors">
      <td className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-slate-300" />
            )}
          </div>
          <div>
            <div className="text-white font-medium">{user.name}</div>
            <div className="text-slate-400 text-sm flex items-center space-x-1">
              <Mail className="w-3 h-3" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
          <Shield className="w-3 h-3 mr-1" />
          {user.role.toUpperCase()}
        </div>
      </td>
      <td className="p-4">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
          <div className={`w-2 h-2 rounded-full mr-1 ${user.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`}></div>
          {user.status.toUpperCase()}
        </div>
      </td>
      <td className="p-4 text-slate-300 text-sm">
        {new Date(user.lastLogin).toLocaleDateString()} at{' '}
        {new Date(user.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </td>
      <td className="p-4 text-slate-300 text-sm">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <button className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors">
            <Settings className="w-4 h-4 text-slate-300" />
          </button>
          <button className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors">
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </td>
    </tr>
  );
};
const mockUsers: UserData[] = [
  {
    id: '1',
    name: 'Mohammed Ajhas',
    email: 'ajhas@mandlac.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-07-22T14:30:00Z',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@securesight.com',
    role: 'operator',
    status: 'active',
    lastLogin: '2025-07-22T13:45:00Z',
    createdAt: '2025-02-20T09:30:00Z',
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@securesight.com',
    role: 'operator',
    status: 'active',
    lastLogin: '2025-07-22T12:15:00Z',
    createdAt: '2025-03-10T14:20:00Z',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@securesight.com',
    role: 'viewer',
    status: 'active',
    lastLogin: '2025-07-21T16:30:00Z',
    createdAt: '2025-04-05T11:45:00Z',
  },
  {
    id: '5',
    name: 'John Smith',
    email: 'john.smith@securesight.com',
    role: 'viewer',
    status: 'inactive',
    lastLogin: '2025-07-18T09:20:00Z',
    createdAt: '2025-05-12T08:15:00Z',
  },
  {
    id: '6',
    name: 'Lisa Wang',
    email: 'lisa.wang@securesight.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-07-22T11:00:00Z',
    createdAt: '2025-01-28T13:30:00Z',
  },
];
export default Users;
