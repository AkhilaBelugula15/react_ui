import React from 'react';
import type { Agent } from '../types';
import './AgentPanel.css';

interface AgentPanelProps {
  agents: Agent[];
}

const AgentPanel: React.FC<AgentPanelProps> = ({ agents }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#10b981';
      case 'busy':
        return '#f59e0b';
      case 'away':
        return '#6b7280';
      case 'offline':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const sortedAgents = [...agents].sort((a, b) => {
    const statusOrder = { online: 0, busy: 1, away: 2, offline: 3 };
    return (statusOrder[a.status as keyof typeof statusOrder] || 99) -
           (statusOrder[b.status as keyof typeof statusOrder] || 99);
  });

  return (
    <div className="agent-panel">
      
      <div className="agent-panel-header">
        <h3>Support Team</h3>
        <span className="agent-count">{agents.length}</span>
      </div>

      
      <div className="agents-list">
        {sortedAgents.map((agent) => (
          <div key={agent.id} className="agent-card card">
            <div className="agent-card-top">
              <div className="agent-avatar-section">
                <span className="agent-avatar">{agent.avatar}</span>
                <div
                  className="status-indicator"
                  style={{
                    backgroundColor: getStatusColor(agent.status),
                  }}
                  title={agent.status}
                />
              </div>
              <div className="agent-info">
                <p className="agent-name">{agent.name}</p>
                <p className="agent-status-text">{agent.status}</p>
              </div>
            </div>

            <div className="agent-stats">
              <div className="stat-item">
                <label>Assigned</label>
                <span className="stat-number">{agent.tickets_assigned}</span>
              </div>
              <div className="stat-item">
                <label>Resolved</label>
                <span className="stat-number">{agent.tickets_resolved}</span>
              </div>
            </div>

           
            <div className="agent-email">
              <p className="text-xs text-gray-600">{agent.email}</p>
            </div>

            
            <button
              className="btn btn-small"
              style={{
                width: '100%',
                backgroundColor: '#f3f4f6',
                color: '#374151',
              }}
            >
              Assign Ticket
            </button>
          </div>
        ))}
      </div>

      
      <div className="agent-summary card">
        <h4>Team Summary</h4>
        <div className="summary-items">
          <div className="summary-item">
            <div
              className="summary-color"
              style={{ backgroundColor: '#10b981' }}
            />
            <span>
              Online: {agents.filter((a) => a.status === 'online').length}
            </span>
          </div>
          <div className="summary-item">
            <div
              className="summary-color"
              style={{ backgroundColor: '#f59e0b' }}
            />
            <span>
              Busy: {agents.filter((a) => a.status === 'busy').length}
            </span>
          </div>
          <div className="summary-item">
            <div
              className="summary-color"
              style={{ backgroundColor: '#6b7280' }}
            />
            <span>
              Away: {agents.filter((a) => a.status === 'away').length}
            </span>
          </div>
          <div className="summary-item">
            <div
              className="summary-color"
              style={{ backgroundColor: '#ef4444' }}
            />
            <span>
              Offline: {agents.filter((a) => a.status === 'offline').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPanel;
