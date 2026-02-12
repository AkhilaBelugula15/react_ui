// API service for frontend to communicate with backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ==================== DASHBOARD ENDPOINTS ====================
export const dashboardAPI = {
  getStats: async () => {
    return apiCall('/dashboard/stats');
  },
};

// ==================== TICKET ENDPOINTS ====================
export const ticketAPI = {
  // Get all tickets with filters
  getAll: async (filters?: { status?: string; priority?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const endpoint = queryString ? `/tickets?${queryString}` : '/tickets';
    return apiCall(endpoint);
  },

  // Get single ticket
  getById: async (id: string) => {
    return apiCall(`/tickets/${id}`);
  },

  // Create new ticket
  create: async (ticket: {
    title: string;
    description: string;
    priority: string;
    category: string;
    customer_name: string;
    customer_email: string;
  }) => {
    return apiCall('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticket),
    });
  },

  // Update ticket
  update: async (
    id: string,
    updates: {
      status?: string;
      priority?: string;
      assigned_to?: any;
      description?: string;
    }
  ) => {
    return apiCall(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Add note to ticket
  addNote: async (id: string, note: { content: string; author?: string }) => {
    return apiCall(`/tickets/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify(note),
    });
  },

  // Assign ticket to agent
  assign: async (id: string, agentId: string | null) => {
    return apiCall(`/tickets/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ agent_id: agentId }),
    });
  },

  // Delete ticket
  delete: async (id: string) => {
    return apiCall(`/tickets/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== AGENT ENDPOINTS ====================
export const agentAPI = {
  // Get all agents
  getAll: async () => {
    return apiCall('/agents');
  },

  // Get single agent
  getById: async (id: string) => {
    return apiCall(`/agents/${id}`);
  },

  // Update agent status
  updateStatus: async (id: string, status: string) => {
    return apiCall(`/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Get agent statistics
  getStats: async (id: string) => {
    return apiCall(`/agents/${id}/stats`);
  },
};

// ==================== HEALTH CHECK ====================
export const healthAPI = {
  check: async () => {
    return apiCall('/health');
  },
};
