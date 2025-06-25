import { useState, useEffect } from 'react';
import { User } from '../types';
import { storage } from '../utils/storage';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storage.initializeDemoData();
    const currentUser = storage.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = (username: string): User | null => {
    const users = storage.getUsers();
    const foundUser = users.find(u => u.username === username);
    
    if (foundUser) {
      storage.setCurrentUser(foundUser);
      setUser(foundUser);
      return foundUser;
    }
    
    return null;
  };

  const logout = () => {
    storage.setCurrentUser(null);
    setUser(null);
  };

  const hasPermission = (action: 'read' | 'write' | 'admin'): boolean => {
    if (!user) return false;
    
    switch (action) {
      case 'read':
        return ['admin', 'hr', 'viewer'].includes(user.role);
      case 'write':
        return ['admin', 'hr'].includes(user.role);
      case 'admin':
        return user.role === 'admin';
      default:
        return false;
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    hasPermission
  };
};