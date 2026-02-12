import React from 'react';
import type { DashboardStats } from '../types';
import './Dashboard.css';

interface DashboardProps {
  stats: DashboardStats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  
  const getCapacityColor = (capacity: number): string => {
    if (capacity >= 80) return '#dc2626';
    if (capacity >= 60) return '#ca8a04';
    return '#16a34a';
  };

  return (
    <div className="dashboard">
      
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="text-gray-600">Welcome to Ticketing System</p>
        </div>
        <button className="btn btn-primary">
          Create Ticket
        </button>
      </div>

     
      <div className="stats-grid">
        
        <div className="card stat-card">
          <div className="stat-card-header">
            <div>
              <p className="stat-label">Total Tickets</p>
              <p className="stat-value">
                {stats.total_tickets}
              </p>
            </div>
            <div className="stat-icon">🎫</div>
          </div>
          <p className="text-gray-500 text-xs">All time tickets</p>
        </div>

      
        <div className="card stat-card">
          <div className="stat-card-header">
            <div>
              <p className="stat-label">Open Tickets</p>
              <p className="stat-value text-blue-600">
                {stats.open_tickets}
              </p>
            </div>
            <div className="stat-icon">🔴</div>
          </div>
          <p className="text-gray-500 text-xs">Needs attention</p>
        </div>

       
        <div className="card stat-card">
          <div className="stat-card-header">
            <div>
              <p className="stat-label">Pending Tickets</p>
              <p className="stat-value text-yellow-600">
                {stats.pending_tickets}
              </p>
            </div>
            <div className="stat-icon">⏳</div>
          </div>
          <p className="text-gray-500 text-xs">Assigned & awaiting update</p>
        </div>

       
        <div className="card stat-card">
          <div className="stat-card-header">
            <div>
              <p className="stat-label">Resolved Tickets</p>
              <p className="stat-value text-green-600">
                {stats.resolved_tickets}
              </p>
            </div>
            <div className="stat-icon">✅</div>
          </div>
          <p className="text-gray-500 text-xs">Completed successfully</p>
        </div>
      </div>

   
      <div className="metrics-grid">
       
        <div className="card metric-card">
          <h3>Average Resolution Time</h3>
          <div className="metric-content">
            <div>
              <p className="metric-value text-blue-600">
                {stats.average_resolution_time}
              </p>
              <p className="text-gray-600 text-sm">Hours average</p>
            </div>
            <div className="metric-icon">⏱️</div>
          </div>
        </div>

      
        <div className="card metric-card">
          <h3>Agent Capacity</h3>
          <div className="capacity-content">
            <div className="flex items-center justify-between">
              <span className="capacity-value" style={{ color: getCapacityColor(stats.agent_capacity) }}>
                {stats.agent_capacity}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ 
                  width: `${stats.agent_capacity}%`,
                  backgroundColor: getCapacityColor(stats.agent_capacity)
                }}
              />
            </div>
            <p className="text-gray-600 text-sm" style={{ marginTop: '0.75rem' }}>
              {stats.agent_capacity < 70
                ? '✓ Capacity is good'
                : stats.agent_capacity < 85
                ? '⚠️ Capacity is high'
                : '⚠️ Agents are overloaded'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
