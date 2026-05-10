import {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({
  children
}) => {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const token =
      localStorage.getItem('token');

    const userData =
      localStorage.getItem('user');

    if (token && userData) {

      setUser(
        JSON.parse(userData)
      );

      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;
    }

    setLoading(false);

  }, []);

  const login = (data) => {

    // Save token
    localStorage.setItem(
      'token',
      data.token
    );

    // Save COMPLETE user object
    localStorage.setItem(
      'user',
      JSON.stringify({
        name: data.name,
        email: data.email,
        userId: data.userId
      })
    );

    // Update state
    setUser({
      name: data.name,
      email: data.email,
      userId: data.userId
    });

    // Set axios auth header
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${data.token}`;
  };

  const logout = () => {

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'user'
    );

    setUser(null);

    delete axios.defaults.headers.common[
      'Authorization'
    ];
  };

  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading
      }}
    >

      {children}

    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);