import React, { useState } from 'react';
import type { Ticket } from '../types';
import './TicketList.css';

interface TicketListProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  onCreateTicket?: (ticket: any) => void;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, onSelectTicket, onCreateTicket }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'General',
    customer_name: '',
    customer_email: '',
  });

  
  const filteredTickets = tickets.filter((ticket) => {
    const statusMatch = filterStatus === 'all' || ticket.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || ticket.priority === filterPriority;
    const searchMatch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer_name.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && priorityMatch && searchMatch;
  });

  
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'badge-danger';
      case 'high':
        return 'badge-warning';
      case 'medium':
        return 'badge-info';
      case 'low':
        return 'badge-success';
      default:
        return 'badge-info';
    }
  };

 
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'status-open';
      case 'assigned':
        return 'status-assigned';
      case 'in-progress':
        return 'status-in-progress';
      case 'resolved':
        return 'status-resolved';
      case 'closed':
        return 'status-closed';
      default:
        return 'status-closed';
    }
  };

 
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="ticket-list">
      
      <div className="ticket-list-header">
        <div>
          <h2>Tickets</h2>
          <p className="text-gray-600">Manage and track all support tickets</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ New Ticket'}
        </button>
      </div>

      
      {showCreateForm && (
        <div className="card create-ticket-form">
          <h3>Create New Ticket</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Customer Name"
              value={createFormData.customer_name}
              onChange={(e) => setCreateFormData({ ...createFormData, customer_name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Customer Email"
              value={createFormData.customer_email}
              onChange={(e) => setCreateFormData({ ...createFormData, customer_email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Ticket Title"
              value={createFormData.title}
              onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
            />
            <select
              value={createFormData.priority}
              onChange={(e) => setCreateFormData({ ...createFormData, priority: e.target.value })}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent Priority</option>
            </select>
            <select
              value={createFormData.category}
              onChange={(e) => setCreateFormData({ ...createFormData, category: e.target.value })}
            >
              <option value="General">General</option>
              <option value="Account">Account</option>
              <option value="Billing">Billing</option>
              <option value="Bug">Bug</option>
              <option value="Feature Request">Feature Request</option>
            </select>
            <textarea
              placeholder="Description"
              value={createFormData.description}
              onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
              style={{ gridColumn: '1 / -1' }}
            />
            <button
              className="btn btn-secondary"
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (onCreateTicket && createFormData.title && createFormData.customer_name && createFormData.customer_email) {
                  onCreateTicket(createFormData);
                  setCreateFormData({
                    title: '',
                    description: '',
                    priority: 'medium',
                    category: 'General',
                    customer_name: '',
                    customer_email: '',
                  });
                  setShowCreateForm(false);
                }
              }}
            >
              Create Ticket
            </button>
          </div>
        </div>
      )}

      
      <div className="card filter-container">
        <div className="search-row">
         
          <input
            type="text"
            placeholder="Search by ticket ID, title, or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        
        <div className="filter-row">
          
          <div className="filter-group">
            <label>Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

         
          <div className="filter-group">
            <label>Priority:</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

         
          <div className="results-count">
            Showing {filteredTickets.length} of {tickets.length} tickets
          </div>
        </div>
      </div>

     
      <div className="tickets-container">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => onSelectTicket(ticket)}
              className="card card-clickable ticket-row"
            >
              <div className="ticket-row-content">
           
                <div className="ticket-id-section">
                  <p className="ticket-id">{ticket.id}</p>
                  <p className="ticket-date text-xs text-gray-500">
                    {formatDate(ticket.created_at)}
                  </p>
                </div>

                
                <div className="ticket-info-section">
                  <p className="ticket-title truncate">
                    {ticket.title}
                  </p>
                  <p className="ticket-customer truncate">
                    {ticket.customer_name}
                  </p>
                </div>

                
                <div className="ticket-category">
                  <p className="text-sm text-gray-600">{ticket.category}</p>
                </div>

              
                <div className="ticket-priority">
                  <span className={`badge ${getPriorityBadgeClass(ticket.priority)}`}>
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                  </span>
                </div>

               
                <div className="ticket-status">
                  <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                    {ticket.status === 'in-progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </span>
                </div>

                
                <div className="ticket-agent">
                  {ticket.assigned_to ? (
                    <div className="agent-info">
                      <span className="agent-avatar">{ticket.assigned_to.avatar}</span>
                      <div>
                        <p className="agent-name">
                          {ticket.assigned_to.name}
                        </p>
                        <p className="agent-status text-xs text-gray-500">
                          {ticket.assigned_to.status}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm" style={{ fontStyle: 'italic' }}>
                      Unassigned
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card empty-state">
            <p className="empty-icon">🔍</p>
            <p className="empty-title">No tickets found</p>
            <p className="empty-description">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketList;
