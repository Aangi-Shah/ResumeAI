import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import {
  User,
  Mail,
  Shield,
  Edit,
  Save,
  X
} from 'lucide-react';

import toast from 'react-hot-toast';

const Profile = () => {

  const { user, login } = useAuth();

  const [isEditing, setIsEditing] =
    useState(false);

  const [name, setName] = useState(
    user?.name || ''
  );

  const [email, setEmail] = useState(
    user?.email || ''
  );

  const [loading, setLoading] =
    useState(false);

  const handleSave = async () => {

  try {

    setLoading(true);

    const token =
      localStorage.getItem('token');

    const { data } = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/auth/profile`,
      {
        name,
        email
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const updatedUser = {
      ...user,
      name: data.user.name,
      email: data.user.email
    };

    localStorage.setItem(
      'user',
      JSON.stringify(updatedUser)
    );

    login({
      ...updatedUser,
      token
    });

    setIsEditing(false);

    toast.success(
      'Profile updated successfully!'
    );

  } catch (error) {

    toast.error(
      'Failed to update profile'
    );

  } finally {

    setLoading(false);
  }
};

  const handleCancel = () => {

    setName(user?.name || '');

    setEmail(user?.email || '');

    setIsEditing(false);
  };

  return (

    <div className="max-w-2xl mx-auto space-y-6">

      <h1 className="text-3xl font-bold">
        Your Profile
      </h1>

      <div className="glass-card p-8">

        {/* Profile Header */}

        <div className="flex items-center space-x-6 mb-6">

          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold">

            {name?.charAt(0)?.toUpperCase()}

          </div>

          <div>

            <h2 className="text-2xl font-bold">
              {name}
            </h2>

            <p className="text-gray-400">
              ResumeAI User
            </p>

          </div>

        </div>

        {/* Profile Info */}

        <div className="space-y-3">

          {/* Name */}

          <div className="flex items-center space-x-4 p-3 bg-navy-700/50 rounded-lg">

            <User className="text-blue-400" />

            <div className="flex-1">

              <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                Full Name
              </p>

              {!isEditing ? (

                <p className="text-gray-200 text-lg">
                  {name}
                </p>

              ) : (

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="input-field"
                />
              )}

            </div>

          </div>

          {/* Email */}

          <div className="flex items-center space-x-4 p-3 bg-navy-700/50 rounded-lg">

            <Mail className="text-blue-400" />

            <div className="flex-1">

              <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                Email Address
              </p>

              {!isEditing ? (

                <p className="text-gray-200 text-lg">
                  {email}
                </p>

              ) : (

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="input-field"
                />
              )}

            </div>

          </div>

          {/* Account Status */}

          <div className="flex items-center space-x-4 p-3 bg-navy-700/50 rounded-lg">

            <Shield className="text-green-400" />

            <div>

              <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                Account Status
              </p>

              <p className="text-gray-200 text-lg">
                Verified Account
              </p>

            </div>

          </div>

        </div>

        {/* Bottom Buttons */}

        <div className="mt-6 pt-6 border-t border-white/10">

          {!isEditing ? (

            <button
              onClick={() =>
                setIsEditing(true)
              }
              className="w-full py-3 rounded-lg border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 transition-colors flex items-center justify-center space-x-2"
            >

              <Edit size={18} />

              <span>Edit Profile</span>

            </button>

          ) : (

            <div className="flex flex-col md:flex-row gap-4">

              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
              >

                <Save size={18} />

                <span>
                  {loading
                    ? 'Saving...'
                    : 'Save Changes'}
                </span>

              </button>

              <button
                onClick={handleCancel}
                className="w-full py-3 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center space-x-2"
              >

                <X size={18} />

                <span>Cancel</span>

              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Profile;