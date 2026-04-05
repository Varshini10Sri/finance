import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Terminal, 
  Database, 
  Lock, 
  BarChart3, 
  Users, 
  Server,
  Cpu,
  Globe
} from 'lucide-react';

const Documentation = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '1000px', margin: '0 auto', color: 'white' }}
    >
      {/* Hero Section */}
      <div className="glass" style={{ padding: '4rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(88, 103, 221, 0.1) 0%, rgba(0, 0, 0, 0) 100%)' }}>
        <h1 className="glass-title" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>System Documentation</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
          Detailed technical blueprint for the FintechAI enterprise financial intelligence platform.
        </p>
      </div>

      <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
        {/* Core Architecture */}
        <div className="glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Cpu size={32} color="var(--primary)" />
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Core Architecture</h2>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '1rem' }}>
              <strong>Frontend:</strong> React.js, Vite, Framer Motion, Recharts
            </li>
            <li style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '1rem' }}>
              <strong>Backend:</strong> Node.js, Express.js (RESTful API)
            </li>
            <li style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '1rem' }}>
              <strong>Database:</strong> MySQL (Relational Schema)
            </li>
            <li style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '1rem' }}>
              <strong>Security:</strong> JWT auth, bcrypt hashing, CORS protection
            </li>
          </ul>
        </div>

        {/* Access Levels */}
        <div className="glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Lock size={32} color="var(--secondary)" />
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Access Control Matrix</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass" style={{ background: 'rgba(0,255,0,0.05)', padding: '1rem' }}>
              <strong>Administrator:</strong> Unrestricted system control. User allocation, database purification, and global analytics.
            </div>
            <div className="glass" style={{ background: 'rgba(0,180,255,0.05)', padding: '1rem' }}>
              <strong>Analyst:</strong> Log event entry and insight reading. Limited record removal capabilities.
            </div>
            <div className="glass" style={{ background: 'rgba(150,150,150,0.05)', padding: '1rem' }}>
              <strong>Viewer:</strong> Strictly read-only access to ledger and basic analytics.
            </div>
          </div>
        </div>
      </div>

      {/* API Reference */}
      <div className="glass" style={{ padding: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Terminal size={32} color="var(--primary)" />
          <h2 style={{ fontSize: '2rem', margin: 0 }}>API Protocol Specification</h2>
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {[
            { method: 'POST', endpoint: '/login', desc: 'Secure authorization endpoint', scope: 'Public' },
            { method: 'POST', endpoint: '/register', desc: 'New entity registration', scope: 'Public' },
            { method: 'GET', endpoint: '/summary', desc: 'Global financial aggregation', scope: 'Analyst+' },
            { method: 'GET', endpoint: '/transactions', desc: 'Ledger retrieval', scope: 'All' },
            { method: 'POST', endpoint: '/transactions', desc: 'New event logging', scope: 'Analyst+' },
            { method: 'PUT', endpoint: '/users/:id', desc: 'Authorization status update', scope: 'Admin Only' },
            { method: 'DELETE', endpoint: '/users/:id', desc: 'Entity revocation', scope: 'Admin Only' },
          ].map((api, i) => (
            <div key={i} className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <span style={{ 
                  background: api.method === 'GET' ? 'var(--secondary)' : api.method === 'POST' ? 'var(--primary)' : 'var(--danger)', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '4px', 
                  fontSize: '0.8rem', 
                  fontWeight: '900' 
                }}>{api.method}</span>
                <code style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{api.endpoint}</code>
              </div>
              <span style={{ color: 'var(--text-secondary)' }}>{api.desc}</span>
              <span className="glass" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', color: 'var(--primary)' }}>{api.scope}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deployment & Ops */}
      <div className="glass" style={{ padding: '3rem', marginBottom: '5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Globe size={32} color="var(--secondary)" />
          <h2 style={{ fontSize: '2rem', margin: 0 }}>Operational Deployment</h2>
        </div>
        
        <p style={{ color: 'var(--text-secondary)' }}>
          Standard initialization protocols:
        </p>
        <div className="glass" style={{ background: '#000', padding: '1.5rem', marginTop: '1rem' }}>
          <pre style={{ margin: 0, color: 'var(--secondary)' }}>
            <code>
              {`# Backend\ncd backend && npm start\n\n# Frontend\ncd frontend && npm run dev`}
            </code>
          </pre>
        </div>

        <p style={{ color: 'var(--text-secondary)', marginTop: '2rem' }}>
          Environment configuration (<code>backend/.env</code>):
        </p>
        <div className="glass" style={{ background: '#000', padding: '1.5rem', marginTop: '1rem' }}>
          <pre style={{ margin: 0, color: 'var(--primary)' }}>
            <code>
              {`PORT=5000\nDB_HOST=localhost\nDB_USER=root\nDB_PASSWORD=root\nDB_NAME=fintech\nJWT_SECRET=your_secure_secret_key`}
            </code>
          </pre>
        </div>
      </div>
    </motion.div>
  );
};

export default Documentation;
