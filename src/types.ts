

export interface Note {
  id: string;
  content: string;
  author: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'assigned' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created_at: string;
  updated_at: string;
  assigned_to: Agent | null;
  customer_name: string;
  customer_email: string;
  resolution_time?: number;
  notes?: Note[];
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  tickets_assigned: number;
  tickets_resolved: number;
  avatar?: string;
}

export interface DashboardStats {
  total_tickets: number;
  open_tickets: number;
  pending_tickets: number;
  resolved_tickets: number;
  average_resolution_time: number;
  agent_capacity: number;
}
