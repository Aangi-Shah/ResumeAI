import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications/stats/dashboard`);
        setStats(data);
      } catch (error) {
        toast.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  const statusData = stats?.applications ? Object.entries(
    stats.applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value })) : [];

  const followUpCount = stats?.applications?.filter(app => 
    app.status === 'Applied' && 
    (new Date() - new Date(app.dateApplied)) / (1000 * 60 * 60 * 24) > 7
  ).length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {followUpCount > 0 && (
          <div className="flex items-center space-x-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full border border-red-500/50">
            <AlertCircle size={18} />
            <span className="font-medium">{followUpCount} Follow-up Reminders</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Applied" value={stats?.total} icon={<Briefcase className="text-blue-400" />} />
        <StatCard title="Interview Rate" value={`${stats?.interviewRate}%`} icon={<CheckCircle className="text-green-400" />} />
        <StatCard title="Rejection Rate" value={`${stats?.rejectionRate}%`} icon={<XCircle className="text-red-400" />} />
        <StatCard title="Offers Received" value={stats?.offers} icon={<Clock className="text-purple-400" />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-6">Application Status</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#112240', border: 'none', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {stats?.applications?.slice(0, 5).map((app) => (
              <div key={app._id} className="flex items-center justify-between p-3 bg-navy-700/50 rounded-lg">
                <div>
                  <p className="font-medium">{app.company}</p>
                  <p className="text-sm text-gray-400">{app.jobTitle}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  app.status === 'Offer Received' ? 'bg-green-500/20 text-green-400' :
                  app.status === 'Rejected' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="glass-card p-6 flex items-center space-x-4">
    <div className="p-3 bg-navy-700 rounded-lg">{icon}</div>
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default Dashboard;
