import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Filter, Edit2, Trash2, ExternalLink, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [formData, setFormData] = useState({
    company: '', jobTitle: '', jobUrl: '', status: 'Applied', priority: 'Medium', notes: ''
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications`);
      setApplications(data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingApp) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/applications/${editingApp._id}`, formData);
        toast.success('Application updated');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/applications`, formData);
        toast.success('Application added');
      }
      setShowModal(false);
      setEditingApp(null);
      setFormData({ company: '', jobTitle: '', jobUrl: '', status: 'Applied', priority: 'Medium', notes: '' });
      fetchApplications();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/applications/${id}`);
      toast.success('Deleted');
      fetchApplications();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const openEdit = (app) => {
    setEditingApp(app);
    setFormData({
      company: app.company,
      jobTitle: app.jobTitle,
      jobUrl: app.jobUrl || '',
      status: app.status,
      priority: app.priority,
      notes: app.notes || ''
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <button 
          onClick={() => { setEditingApp(null); setShowModal(true); }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Application</span>
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-navy-700/50 border-b border-white/10">
              <tr>
                <th className="p-4 font-semibold">Company & Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Priority</th>
                <th className="p-4 font-semibold">Date Applied</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="font-bold">{app.company}</div>
                    <div className="text-sm text-gray-400">{app.jobTitle}</div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      app.status === 'Offer Received' ? 'bg-green-500/20 text-green-400' :
                      app.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                      app.status === 'Interview Scheduled' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs ${
                      app.priority === 'High' ? 'text-red-400' :
                      app.priority === 'Medium' ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      ● {app.priority}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    {new Date(app.dateApplied).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end space-x-2">
                      {app.jobUrl && (
                        <a href={app.jobUrl} target="_blank" rel="noreferrer" className="p-2 hover:bg-navy-700 rounded-lg text-gray-400">
                          <ExternalLink size={18} />
                        </a>
                      )}
                      <button onClick={() => openEdit(app)} className="p-2 hover:bg-navy-700 rounded-lg text-blue-400">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(app._id)} className="p-2 hover:bg-navy-700 rounded-lg text-red-400">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6">{editingApp ? 'Edit Application' : 'Add New Application'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Company</label>
                  <input required className="input-field" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Job Title</label>
                  <input required className="input-field" value={formData.jobTitle} onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Job URL</label>
                <input className="input-field" value={formData.jobUrl} onChange={(e) => setFormData({...formData, jobUrl: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select className="input-field" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option>Applied</option>
                    <option>Interview Scheduled</option>
                    <option>Interview Done</option>
                    <option>Offer Received</option>
                    <option>Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Priority</label>
                  <select className="input-field" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Notes</label>
                <textarea className="input-field h-24 resize-none" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
              </div>
              <div className="flex space-x-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 rounded-lg bg-navy-700 hover:bg-navy-600 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Save Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
