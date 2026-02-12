import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


let tickets = [
  {
    id: 'TK-001',
    title: 'Login issue with two-factor authentication',
    description: 'Cannot login to account even with correct credentials. Two-factor authentication code is not being sent.',
    status: 'open',
    priority: 'high',
    category: 'Account',
    created_at: '2026-02-12T10:30:00',
    updated_at: '2026-02-12T10:30:00',
    assigned_to: null,
    customer_name: 'Alex Chen',
    customer_email: 'alex@customer.com',
    notes: [],
  },
  {
    id: 'TK-002',
    title: 'Payment processing error',
    description: 'Getting error code 403 when trying to process payment. Order ID: ORD-12345',
    status: 'assigned',
    priority: 'urgent',
    category: 'Billing',
    created_at: '2026-02-12T09:15:00',
    updated_at: '2026-02-12T11:00:00',
    assigned_to: {
      id: 'agent-1',
      name: 'John Smith',
      email: 'john@helpdesk.com',
      status: 'online',
      avatar: '👨‍💼',
    },
    customer_name: 'Maria Rodriguez',
    customer_email: 'maria@customer.com',
    notes: [],
  },
  {
    id: 'TK-003',
    title: 'Feature request: Dark mode',
    description: 'Would like to have a dark mode option in the application for better usability at night.',
    status: 'in-progress',
    priority: 'low',
    category: 'Feature Request',
    created_at: '2026-02-11T14:20:00',
    updated_at: '2026-02-12T08:00:00',
    assigned_to: {
      id: 'agent-2',
      name: 'Sarah Johnson',
      email: 'sarah@helpdesk.com',
      status: 'online',
      avatar: '👩‍💼',
    },
    customer_name: 'James Patterson',
    customer_email: 'james@customer.com',
    notes: [],
  },
  {
    id: 'TK-004',
    title: 'Account deletion request',
    description: 'Customer wants to permanently delete their account and all associated data.',
    status: 'in-progress',
    priority: 'medium',
    category: 'Account',
    created_at: '2026-02-10T16:45:00',
    updated_at: '2026-02-12T07:30:00',
    assigned_to: {
      id: 'agent-3',
      name: 'Mike Davis',
      email: 'mike@helpdesk.com',
      status: 'busy',
      avatar: '👨‍💼',
    },
    customer_name: 'David Thompson',
    customer_email: 'david@customer.com',
    notes: [],
  },
  {
    id: 'TK-005',
    title: 'Refund confirmation not received',
    description: 'Processed refund on 2026-02-08 but customer has not received confirmation email.',
    status: 'resolved',
    priority: 'high',
    category: 'Billing',
    created_at: '2026-02-08T11:00:00',
    updated_at: '2026-02-12T12:00:00',
    assigned_to: {
      id: 'agent-1',
      name: 'John Smith',
      email: 'john@helpdesk.com',
      status: 'online',
      avatar: '👨‍💼',
    },
    customer_name: 'Lisa Anderson',
    customer_email: 'lisa@customer.com',
    notes: [],
  },
  {
    id: 'TK-006',
    title: 'Mobile app crashes on startup',
    description: 'Application crashes immediately upon launching on iOS 18. Verified on iPhone 15 Pro.',
    status: 'open',
    priority: 'urgent',
    category: 'Bug',
    created_at: '2026-02-12T12:30:00',
    updated_at: '2026-02-12T12:30:00',
    assigned_to: null,
    customer_name: 'Robert Kumar',
    customer_email: 'robert@customer.com',
    notes: [],
  },
];

let agents = [
  {
    id: 'agent-1',
    name: 'John Smith',
    email: 'john@helpdesk.com',
    status: 'online',
    tickets_assigned: 5,
    tickets_resolved: 142,
    avatar: '👨‍💼',
  },
  {
    id: 'agent-2',
    name: 'Sarah Johnson',
    email: 'sarah@helpdesk.com',
    status: 'online',
    tickets_assigned: 4,
    tickets_resolved: 156,
    avatar: '👩‍💼',
  },
  {
    id: 'agent-3',
    name: 'Mike Davis',
    email: 'mike@helpdesk.com',
    status: 'busy',
    tickets_assigned: 8,
    tickets_resolved: 128,
    avatar: '👨‍💼',
  },
  {
    id: 'agent-4',
    name: 'Emma Wilson',
    email: 'emma@helpdesk.com',
    status: 'away',
    tickets_assigned: 0,
    tickets_resolved: 134,
    avatar: '👩‍💼',
  },
];


function calculateStats() {
  const total = tickets.length;
  const open = tickets.filter(t => t.status === 'open').length;
  const pending = tickets.filter(t => t.status === 'assigned' || t.status === 'in-progress').length;
  const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  
  const totalAssigned = agents.reduce((sum, a) => sum + a.tickets_assigned, 0);
  const maxCapacity = agents.length * 10;
  const capacity = Math.round((totalAssigned / maxCapacity) * 100);
  
  return {
    total_tickets: total,
    open_tickets: open,
    pending_tickets: pending,
    resolved_tickets: resolved,
    average_resolution_time: 18,
    agent_capacity: capacity,
  };
}


app.get('/api/dashboard/stats', (req, res) => {
  try {
    const stats = calculateStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});


app.get('/api/tickets', (req, res) => {
  try {
    const { status, priority, search } = req.query;
    
    let filtered = [...tickets];
    
    if (status && status !== 'all') {
      filtered = filtered.filter(t => t.status === status);
    }
    
    if (priority && priority !== 'all') {
      filtered = filtered.filter(t => t.priority === priority);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchLower) ||
        t.id.toLowerCase().includes(searchLower) ||
        t.customer_name.toLowerCase().includes(searchLower)
      );
    }
    
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});


app.get('/api/tickets/:id', (req, res) => {
  try {
    const ticket = tickets.find(t => t.id === req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});


app.post('/api/tickets', (req, res) => {
  try {
    const { title, description, priority, category, customer_name, customer_email } = req.body;
    
    if (!title || !customer_name || !customer_email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newTicket = {
      id: `TK-${String(tickets.length + 1).padStart(3, '0')}`,
      title,
      description: description || '',
      status: 'open',
      priority: priority || 'medium',
      category: category || 'General',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assigned_to: null,
      customer_name,
      customer_email,
      notes: [],
    };
    
    tickets.push(newTicket);
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});


app.put('/api/tickets/:id', (req, res) => {
  try {
    const { status, priority, assigned_to, description } = req.body;
    
    const ticket = tickets.find(t => t.id === req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    if (assigned_to !== undefined) ticket.assigned_to = assigned_to;
    if (description) ticket.description = description;
    ticket.updated_at = new Date().toISOString();
    
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// ==================== ADD NOTE ====================
app.post('/api/tickets/:id/notes', (req, res) => {
  try {
    const { content, author } = req.body;
    
    const ticket = tickets.find(t => t.id === req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    if (!ticket.notes) {
      ticket.notes = [];
    }
    
    const note = {
      id: `NOTE-${Date.now()}`,
      content,
      author: author || 'System',
      created_at: new Date().toISOString(),
    };
    
    ticket.notes.push(note);
    ticket.updated_at = new Date().toISOString();
    
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add note' });
  }
});


app.delete('/api/tickets/:id', (req, res) => {
  try {
    const index = tickets.findIndex(t => t.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    const deletedTicket = tickets.splice(index, 1);
    res.json({ message: 'Ticket deleted', ticket: deletedTicket[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});


app.post('/api/tickets/:id/assign', (req, res) => {
  try {
    const { agent_id } = req.body;
    
    const ticket = tickets.find(t => t.id === req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    if (agent_id) {
      const agent = agents.find(a => a.id === agent_id);
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      
      
      if (ticket.assigned_to) {
        const prevAgent = agents.find(a => a.id === ticket.assigned_to.id);
        if (prevAgent) prevAgent.tickets_assigned--;
      }
      
      ticket.assigned_to = {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        status: agent.status,
        avatar: agent.avatar,
      };
      
      agent.tickets_assigned++;
      ticket.status = 'assigned';
    } else {
      if (ticket.assigned_to) {
        const prevAgent = agents.find(a => a.id === ticket.assigned_to.id);
        if (prevAgent) prevAgent.tickets_assigned--;
      }
      ticket.assigned_to = null;
      ticket.status = 'open';
    }
    
    ticket.updated_at = new Date().toISOString();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign ticket' });
  }
});


app.get('/api/agents', (req, res) => {
  try {
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});


app.get('/api/agents/:id', (req, res) => {
  try {
    const agent = agents.find(a => a.id === req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});


app.put('/api/agents/:id', (req, res) => {
  try {
    const { status } = req.body;
    
    const agent = agents.find(a => a.id === req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    if (status) agent.status = status;
    
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update agent' });
  }
});


app.get('/api/agents/:id/stats', (req, res) => {
  try {
    const agent = agents.find(a => a.id === req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    const agentTickets = tickets.filter(t => t.assigned_to?.id === req.params.id);
    
    const stats = {
      agent_id: agent.id,
      agent_name: agent.name,
      total_assigned: agent.tickets_assigned,
      total_resolved: agent.tickets_resolved,
      open_tickets: agentTickets.filter(t => t.status === 'open').length,
      in_progress: agentTickets.filter(t => t.status === 'in-progress').length,
      resolution_rate: agent.tickets_resolved > 0 
        ? Math.round((agent.tickets_resolved / (agent.tickets_resolved + agent.tickets_assigned)) * 100)
        : 0,
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agent stats' });
  }
});


app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend server is running!' });
});


app.listen(PORT, () => {
  console.log(`✅ Backend server is running on http://localhost:${PORT}`);
  console.log(`📋 API Documentation:`);
  console.log(`   Dashboard: GET /api/dashboard/stats`);
  console.log(`   Tickets: GET /api/tickets, POST /api/tickets, PUT /api/tickets/:id`);
  console.log(`   Agents: GET /api/agents`);
  console.log(`   Health: GET /api/health`);
});
