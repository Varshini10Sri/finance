import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate, 
  useLocation,
  Navigate
} from 'react-router-dom';
import { 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  LogOut, 
  User, 
  Users,
  LayoutDashboard,
  Calendar,
  DollarSign,
  ArrowRight,
  Filter,
  Trash2,
  ShieldCheck,
  Search,
  FileText
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import Documentation from './document/Documentation';

const API_BASE = 'http://localhost:5000/api';

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  
  const handleLoginSuccess = (userData, userToken) => {
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLoginSuccess} /> : <Navigate to="/dashboard" />} />
        <Route path="/*" element={user ? <DashboardLayout user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

// --- Components ---

const Login = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(true);
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '', role_id: 3 });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/login`, {
        email: authForm.email,
        password: authForm.password
      });
      onLogin(res.data.user, res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass" style={{ padding: '3.5rem', width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="glass-title" style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>FintechAI</h1>
          <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Enterprise Financial Control System</p>
        </div>
        <form onSubmit={showLogin ? handleLogin : async (e) => {
          e.preventDefault();
          try { await axios.post(`${API_BASE}/register`, authForm); alert('Verification sent. Please login.'); setShowLogin(true); } 
          catch (err) { alert(err.response?.data?.message); }
        }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!showLogin && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="stat-label">System Username</label>
                <input type="text" className="glass" style={{ padding: '1rem', color: 'white' }} required onChange={e => setAuthForm({ ...authForm, username: e.target.value })} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="stat-label">Initial Access Level</label>
                <select 
                  className="glass" 
                  style={{ padding: '1rem', color: 'white', background: 'var(--bg-card)' }}
                  onChange={(e) => setAuthForm({ ...authForm, role_id: parseInt(e.target.value) })}
                >
                  <option value="3">Viewer (Read Only)</option>
                  <option value="2">Analyst (Insights & Logs)</option>
                  <option value="1">Admin (Full Control)</option>
                </select>
              </div>
            </>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="stat-label">Email Address</label>
            <input type="email" className="glass" style={{ padding: '1rem', color: 'white' }} required onChange={e => setAuthForm({ ...authForm, email: e.target.value })} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="stat-label">Access Password</label>
            <input type="password" className="glass" style={{ padding: '1rem', color: 'white' }} required onChange={e => setAuthForm({ ...authForm, password: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', justifyContent: 'center', fontSize: '1.1rem' }}>
            {showLogin ? <><ShieldCheck size={20} /> Authorize Access</> : 'Initialize Profile'}
          </button>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            {showLogin ? "No access key? " : "Authorized user? "}
            <span onClick={() => setShowLogin(!showLogin)} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '700' }}>
              {showLogin ? 'Register' : 'Login'}
            </span>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

const DashboardLayout = ({ user, token, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const api = axios.create({
    baseURL: API_BASE,
    headers: { Authorization: `Bearer ${token}` }
  });

  return (
    <div className="container" style={{ padding: '7rem 2rem 5rem' }}>
      <nav className="glass" style={{ position: 'fixed', top: '1.5rem', left: '2rem', right: '2rem', padding: '1rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <h2 className="glass-title" style={{ fontSize: '1.75rem' }} onClick={() => navigate('/dashboard')}>FintechAI</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/dashboard">
              <button className={location.pathname === '/dashboard' ? 'btn-primary' : 'btn-icon'} style={{ padding: '0.5rem 1rem' }}>
                <LayoutDashboard size={18} /> Dashboard
              </button>
            </Link>
            {user.role === 'Admin' && (
              <Link to="/users">
                <button className={location.pathname === '/users' ? 'btn-primary' : 'btn-icon'} style={{ padding: '0.5rem 1rem' }}>
                  <Users size={18} /> User Control
                </button>
              </Link>
            )}
            <Link to="/documentation">
              <button className={location.pathname === '/documentation' ? 'btn-primary' : 'btn-icon'} style={{ padding: '0.5rem 1rem' }}>
                <FileText size={18} /> Documentation
              </button>
            </Link>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: '700' }}>{user.username}</p>
            <span className="glass" style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', color: 'var(--primary)', textTransform: 'uppercase' }}>{user.role}</span>
          </div>
          <button className="btn-icon" onClick={onLogout}><LogOut size={20} /></button>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/dashboard" element={<Dashboard api={api} user={user} onLogout={onLogout} />} />
          <Route path="/users" element={user.role === 'Admin' ? <UserManagement api={api} user={user} /> : <Navigate to="/dashboard" />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

const Dashboard = ({ api, user, onLogout }) => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ income: 0, expense: 0, net: 0 });
  const [loading, setLoading] = useState(false);
  const [showAddTx, setShowAddTx] = useState(false);
  const [filters, setFilters] = useState({ category: '', type: '', search: '' });
  const [txForm, setTxForm] = useState({ amount: '', type: 'Expense', category: 'General', notes: '', date: format(new Date(), 'yyyy-MM-dd') });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [txRes, summaryRes] = await Promise.all([
        api.get('/transactions', { params: { category: filters.category, type: filters.type } }),
        api.get('/summary')
      ]);
      setTransactions(txRes.data);
      setStats({
        income: summaryRes.data.totalIncome,
        expense: summaryRes.data.totalExpense,
        net: summaryRes.data.netBalance
      });
    } catch (err) {
      if (err.response?.status === 401) onLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filters.category, filters.type]);

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Erase this record from intelligence history?')) {
      await api.delete(`/transactions/${id}`);
      fetchData();
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', { ...txForm, amount: parseFloat(txForm.amount), transaction_date: txForm.date });
      setShowAddTx(false);
      fetchData();
    } catch (err) { alert('Failed to log event'); }
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.category.toLowerCase().includes(filters.search.toLowerCase()) || 
    (tx.username && tx.username.toLowerCase().includes(filters.search.toLowerCase()))
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      {/* Stats Summary */}
      <div className="grid grid-cols-3" style={{ marginBottom: '3rem' }}>
        <div className="glass stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <span className="stat-label">Intelligence Balance</span>
          <span className="stat-value" style={{ color: stats.net >= 0 ? 'var(--secondary)' : 'var(--danger)' }}>
            {stats.net < 0 ? '-' : ''}${Math.abs(stats.net).toLocaleString()}
          </span>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>System-wide aggregation active</p>
        </div>
        <div className="glass stat-card">
          <span className="stat-label">Revenue Flux (30d)</span>
          <span className="stat-value" style={{ color: 'var(--secondary)' }}>+${stats.income.toLocaleString()}</span>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><TrendingUp size={16} color="var(--secondary)" /> <span style={{ fontSize: '0.8rem' }}>14 incoming streams</span></div>
        </div>
        <div className="glass stat-card">
          <span className="stat-label">Expense Vectors</span>
          <span className="stat-value" style={{ color: 'var(--danger)' }}>-${stats.expense.toLocaleString()}</span>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><TrendingDown size={16} color="var(--danger)" /> <span style={{ fontSize: '0.8rem' }}>Optimized budget targets</span></div>
        </div>
      </div>

      {/* Records Browser */}
      <div className="glass" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flex: 1 }}>
            <h3>Financial Logs</h3>
            <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', flex: 0.5, gap: '0.75rem' }}>
              <Search size={18} color="var(--text-secondary)" />
              <input 
                type="text" 
                placeholder="Search category or user..." 
                style={{ background: 'none', border: 'none', color: 'white', flex: 1, outline: 'none' }}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
          {user.role !== 'Viewer' && (
            <button className="btn-primary" onClick={() => setShowAddTx(true)}><PlusCircle size={20} /> Log Event</button>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Date</th>
                <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>User</th>
                <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Category</th>
                <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Notes</th>
                <th style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>Amount</th>
                {user.role === 'Admin' && <th style={{ padding: '1rem', textAlign: 'center', whiteSpace: 'nowrap' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="transaction-item" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1.25rem 1rem', whiteSpace: 'nowrap' }}>{format(new Date(tx.transaction_date), 'MMM dd, yyyy')}</td>
                  <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}><span className="glass" style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}>{tx.username}</span></td>
                  <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}><span style={{ fontWeight: '600' }}>{tx.category}</span></td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{tx.notes}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }} className={tx.type === 'Income' ? 'amount-income' : 'amount-expense'}>
                    {tx.type === 'Income' ? '+' : '-'}${parseFloat(tx.amount).toLocaleString()}
                  </td>
                  {user.role === 'Admin' && (
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button className="btn-icon" onClick={() => handleDeleteTransaction(tx.id)} style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showAddTx && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
               initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
               className="glass" style={{ padding: '3rem', width: '90%', maxWidth: '550px' }}
            >
              <h3 style={{ marginBottom: '2rem' }}>Log Intelligence Event</h3>
              <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                   <div style={{ flex: 1 }}>
                     <label className="stat-label">Flux Amount</label>
                     <input type="number" step="0.01" className="glass" style={{ width: '100%', padding: '0.85rem', color: 'white', marginTop: '0.5rem' }} required onChange={e => setTxForm({...txForm, amount: e.target.value})} />
                   </div>
                   <div style={{ flex: 1 }}>
                     <label className="stat-label">Vector Type</label>
                     <select className="glass" style={{ width: '100%', padding: '0.85rem', color: 'white', marginTop: '0.5rem' }} onChange={e => setTxForm({...txForm, type: e.target.value})}>
                        <option value="Expense">Expense</option>
                        <option value="Income">Income</option>
                     </select>
                   </div>
                </div>
                <div>
                   <label className="stat-label">Event Category</label>
                   <input type="text" className="glass" style={{ width: '100%', padding: '0.85rem', color: 'white', marginTop: '0.5rem' }} placeholder="Infrastructure, Revenue, etc." required onChange={e => setTxForm({...txForm, category: e.target.value})} />
                </div>
                <div>
                   <label className="stat-label">Event Timestamp</label>
                   <input type="date" className="glass" style={{ width: '100%', padding: '0.85rem', color: 'white', marginTop: '0.5rem' }} value={txForm.date} onChange={e => setTxForm({...txForm, date: e.target.value})} />
                </div>
                <div>
                   <label className="stat-label">Intelligence Notes</label>
                   <textarea className="glass" style={{ width: '100%', padding: '0.85rem', color: 'white', marginTop: '0.5rem', resize: 'none' }} rows="3" onChange={e => setTxForm({...txForm, notes: e.target.value})}></textarea>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="btn-icon" style={{ flex: 0.3 }} onClick={() => setShowAddTx(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Commit to Database</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const UserManagement = ({ api }) => {
  const [systemUsers, setSystemUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setSystemUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleUpdateUserStatus = async (userId, status) => {
    try {
      await api.put(`/users/${userId}`, { status });
      fetchUsers();
    } catch (err) {
      alert('Failed to update user');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="glass" style={{ padding: '2.5rem' }}>
        <h3 style={{ marginBottom: '2.5rem' }}>System User Management</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Entity</th>
              <th style={{ padding: '1rem' }}>Authorization Role</th>
              <th style={{ padding: '1rem' }}>Operational Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {systemUsers.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1.5rem 1rem' }}>
                  <p style={{ fontWeight: '700' }}>{u.username}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{u.email}</p>
                </td>
                <td style={{ padding: '1rem' }}>
                  <select 
                    className="glass" 
                    style={{ padding: '0.4rem', color: 'white' }}
                    value={u.role_name}
                    onChange={async (e) => {
                      const rolesMap = { 'Admin': 1, 'Analyst': 2, 'Viewer': 3 };
                      await api.put(`/users/${u.id}`, { role_id: rolesMap[e.target.value] });
                      fetchUsers();
                    }}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button 
                    onClick={() => handleUpdateUserStatus(u.id, u.status === 'Active' ? 'Inactive' : 'Active')}
                    className="glass" 
                    style={{ padding: '0.4rem 1rem', color: u.status === 'Active' ? 'var(--secondary)' : 'var(--danger)', fontSize: '0.8rem', fontWeight: '700' }}
                  >
                    {u.status}
                  </button>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                   <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={async () => {
                     if(window.confirm('Revoke access for this entity?')){
                       await api.delete(`/users/${u.id}`);
                       fetchUsers();
                     }
                   }}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default App;
