import { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import TicketList from './components/TicketList';
import TicketDetails from './components/TicketDetails';
import AgentPanel from './components/AgentPanel';
import type { Ticket, Agent, DashboardStats } from './types';
import { dashboardAPI, ticketAPI, agentAPI } from './api/apiService';

type ViewType = 'dashboard' | 'tickets' | 'agents';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const stats = await dashboardAPI.getStats();
        setDashboardStats(stats);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    if (currentView === 'dashboard') {
      fetchStats();
    }
  }, [currentView]);

  
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await ticketAPI.getAll();
        setTickets(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
        setError('Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };

    if (currentView === 'tickets') {
      fetchTickets();
    }
  }, [currentView]);


  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await agentAPI.getAll();
        setAgents(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch agents:', err);
        setError('Failed to fetch agents');
      }
    };

    fetchAgents();
  }, []);

  const handleUpdateTicket = async (updatedTicket: Ticket) => {
    try {
      const result = await ticketAPI.update(updatedTicket.id, {
        status: updatedTicket.status,
        priority: updatedTicket.priority,
        description: updatedTicket.description,
        assigned_to: updatedTicket.assigned_to,
      });
      setTickets(tickets.map((t) => (t.id === result.id ? result : t)));
      setSelectedTicket(null);
      setError(null);
    } catch (err) {
      console.error('Failed to update ticket:', err);
      setError('Failed to update ticket');
    }
  };

  const handleCreateTicket = async (newTicketData: any) => {
    try {
      const newTicket = await ticketAPI.create(newTicketData);
      setTickets([newTicket, ...tickets]);
      setError(null);
    } catch (err) {
      console.error('Failed to create ticket:', err);
      setError('Failed to create ticket');
    }
  };

  return (
    <div className="app-container">
    
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="app-title">🎫 HelpDesk</h1>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </button>

          <button
            className={`nav-item ${currentView === 'tickets' ? 'active' : ''}`}
            onClick={() => setCurrentView('tickets')}
          >
            <span className="nav-icon">🎫</span>
            <span className="nav-label">Tickets</span>
            {tickets.length > 0 && (
              <span className="nav-badge">{tickets.filter((t) => t.status === 'open').length}</span>
            )}
          </button>

          <button
            className={`nav-item ${currentView === 'agents' ? 'active' : ''}`}
            onClick={() => setCurrentView('agents')}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-label">Agents</span>
            <span className="nav-badge">{agents.length}</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">👤</div>
            <div>
              <p className="user-name">Admin</p>
              <p className="user-status">Online</p>
            </div>
          </div>
        </div>
      </aside>

   
      <main className="main-content">
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        <div className="content-wrapper">
          {loading && currentView === 'dashboard' && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading dashboard...</p>
            </div>
          )}

          {currentView === 'dashboard' && dashboardStats && (
            <Dashboard stats={dashboardStats} />
          )}

          {loading && currentView === 'tickets' && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading tickets...</p>
            </div>
          )}

          {currentView === 'tickets' && (
            <TicketList
              tickets={tickets}
              onSelectTicket={setSelectedTicket}
              onCreateTicket={handleCreateTicket}
            />
          )}

          {currentView === 'agents' && (
            <AgentPanel agents={agents} />
          )}
        </div>

        
        {currentView === 'tickets' && (
          <aside className="right-sidebar">
            <AgentPanel agents={agents} />
          </aside>
        )}
      </main>

      {selectedTicket && (
        <TicketDetails
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={handleUpdateTicket}
        />
      )}
    </div>
  );
}

export default App;
