import React, { useState } from 'react';
import type { Ticket } from '../types';
import { ticketAPI } from '../api/apiService';
import './TicketDetails.css';

interface TicketDetailsProps {
  ticket: Ticket | null;
  onClose: () => void;
  onUpdate: (ticket: Ticket) => void;
}

const TicketDetails: React.FC<TicketDetailsProps> = ({ ticket, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTicket, setEditedTicket] = useState<Ticket | null>(ticket);
  const [note, setNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  if (!ticket) {
    return null;
  }

  const handleSave = () => {
    if (editedTicket) {
      onUpdate(editedTicket);
      setIsEditing(false);
    }
  };

  const handleAddNote = async () => {
    if (note.trim() && ticket) {
      try {
        await ticketAPI.addNote(ticket.id, {
          content: note,
          author: 'Admin',
        });
        setNote('');
        setIsAddingNote(false);
        // Refresh ticket data
        if (editedTicket) {
          setEditedTicket({
            ...editedTicket,
            notes: [...(editedTicket.notes || []), {
              id: `NOTE-${Date.now()}`,
              content: note,
              author: 'Admin',
              created_at: new Date().toISOString(),
            }],
          });
        }
      } catch (error) {
        console.error('Failed to add note:', error);
      }
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (editedTicket) {
      setEditedTicket({
        ...editedTicket,
        status: newStatus as any,
        updated_at: new Date().toISOString(),
      });
    }
  };

  const handlePriorityChange = (newPriority: string) => {
    if (editedTicket) {
      setEditedTicket({
        ...editedTicket,
        priority: newPriority as any,
        updated_at: new Date().toISOString(),
      });
    }
  };

  const getStatusColor = (status: string) => {
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

  const getPriorityColor = (priority: string) => {
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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="ticket-details-overlay" onClick={onClose}>
      <div className="ticket-details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="details-header">
          <div>
            <h2>{ticket.id}</h2>
            <p className="text-gray-600">{ticket.customer_name}</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        
        <div className="details-body">
          
          <div className="details-main">
            
            <section className="detail-section">
              <h3>Description</h3>
              {isEditing ? (
                <textarea
                  value={editedTicket?.description || ''}
                  onChange={(e) =>
                    editedTicket && setEditedTicket({ ...editedTicket, description: e.target.value })
                  }
                  className="detail-textarea"
                />
              ) : (
                <p className="detail-description">{ticket.description}</p>
              )}
            </section>

            
            <section className="detail-section">
              <h3>Activity</h3>
              <div className="activity-log">
                <div className="activity-item">
                  <div className="activity-time">
                    {formatDateTime(ticket.created_at)}
                  </div>
                  <p>Ticket created by {ticket.customer_name}</p>
                </div>
                <div className="activity-item">
                  <div className="activity-time">
                    {formatDateTime(ticket.updated_at)}
                  </div>
                  <p>Last updated</p>
                </div>
              </div>
            </section>

           
            <section className="detail-section">
              <h3>Notes ({editedTicket?.notes?.length || 0})</h3>
              
              
              {editedTicket?.notes && editedTicket.notes.length > 0 && (
                <div className="notes-list">
                  {editedTicket.notes.map((n: any) => (
                    <div key={n.id} className="note-item">
                      <div className="note-header">
                        <span className="note-author">{n.author}</span>
                        <span className="note-time">{formatDateTime(n.created_at)}</span>
                      </div>
                      <p className="note-content">{n.content}</p>
                    </div>
                  ))}
                </div>
              )}

             
              <div className="note-input-group">
                <textarea
                  placeholder="Add a note or comment..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="detail-textarea"
                />
                <button 
                  className="btn btn-primary"
                  onClick={handleAddNote}
                  disabled={!note.trim()}
                >
                  {isAddingNote ? 'Adding...' : 'Add Note'}
                </button>
              </div>
            </section>
          </div>

          
          <div className="details-sidebar">
           
            <section className="card detail-card">
              <h4>Customer Information</h4>
              <div className="info-group">
                <label>Name</label>
                <p>{ticket.customer_name}</p>
              </div>
              <div className="info-group">
                <label>Email</label>
                <p>{ticket.customer_email}</p>
              </div>
            </section>

     
            <section className="card detail-card">
              <h4>Status</h4>
              {isEditing ? (
                <select
                  value={editedTicket?.status || ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="filter-select"
                >
                  <option value="open">Open</option>
                  <option value="assigned">Assigned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              ) : (
                <span className={`status-badge ${getStatusColor(ticket.status)}`}>
                  {ticket.status === 'in-progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </span>
              )}
            </section>

           
            <section className="card detail-card">
              <h4>Priority</h4>
              {isEditing ? (
                <select
                  value={editedTicket?.priority || ticket.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="filter-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              ) : (
                <span className={`badge ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </span>
              )}
            </section>

           
            <section className="card detail-card">
              <h4>Category</h4>
              <p>{ticket.category}</p>
            </section>

           
            <section className="card detail-card">
              <h4>Assigned To</h4>
              {ticket.assigned_to ? (
                <div className="assigned-agent">
                  <span className="agent-avatar-lg">{ticket.assigned_to.avatar}</span>
                  <div>
                    <p className="font-semibold">{ticket.assigned_to.name}</p>
                    <p className="text-sm text-gray-600">{ticket.assigned_to.email}</p>
                    <div className="agent-status-badge">
                      {ticket.assigned_to.status}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500" style={{ fontStyle: 'italic' }}>Not assigned</p>
              )}
            </section>

           
            <section className="card detail-card">
              <h4>Metadata</h4>
              <div className="info-group">
                <label>Created</label>
                <p className="text-sm">{formatDateTime(ticket.created_at)}</p>
              </div>
              <div className="info-group">
                <label>Updated</label>
                <p className="text-sm">{formatDateTime(ticket.updated_at)}</p>
              </div>
            </section>
          </div>
        </div>

      
        <div className="details-footer">
          {isEditing ? (
            <>
              <button className="btn btn-secondary" onClick={() => {
                setIsEditing(false);
                setEditedTicket(ticket);
              }}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => {
                setIsEditing(true);
                setEditedTicket(ticket);
              }}>
                Edit Ticket
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
