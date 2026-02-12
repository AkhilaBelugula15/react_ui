# Helpdesk Ticketing System

A modern, responsive helpdesk ticketing application built with React and Express.js.

## Features

- **Dashboard**: View system statistics and KPIs
- **Ticket Management**: Create, view, update, and manage support tickets
- **Agent Management**: View support team availability and capacity
- **Real-time Updates**: Add notes and assign tickets to agents
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Pure CSS**: No framework dependencies, clean and maintainable styling

## Technology Stack

### Frontend
- React 19
- TypeScript
- Vite (Build tool)
- Pure CSS (No Tailwind or Bootstrap)

### Backend
- Express.js
- Node.js
- CORS enabled

## Local Development

### Prerequisites
- Node.js v18+ and npm v9+

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the backend server:**
   ```bash
   npm run server
   ```
   Backend will run on `http://localhost:5000`

3. **In a new terminal, start the frontend dev server:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5175`

### Available Scripts

- `npm run dev` - Start frontend dev server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build locally
- `npm run server` - Start backend server
- `npm run start` - Start both frontend and backend (requires concurrently)

## Project Structure

```
react_ui/
├── src/
│   ├── api/
│   │   └── apiService.ts      # API client
│   ├── components/
│   │   ├── Dashboard.tsx       # Dashboard view
│   │   ├── TicketList.tsx      # Ticket list & create form
│   │   ├── TicketDetails.tsx   # Ticket details modal
│   │   └── AgentPanel.tsx      # Agent management view
│   ├── types.ts                # TypeScript interfaces
│   ├── App.tsx                 # Main app component
│   ├── App.css                 # App layout styles
│   └── index.css               # Global styles
├── server.js                   # Express backend
├── package.json
└── vite.config.ts
```

## API Endpoints

### Dashboard
- `GET /api/dashboard/stats` - Get system statistics

### Tickets
- `GET /api/tickets` - List all tickets (supports filters)
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket
- `POST /api/tickets/:id/notes` - Add note to ticket
- `POST /api/tickets/:id/assign` - Assign ticket to agent

### Agents
- `GET /api/agents` - Get all agents
- `GET /api/agents/:id/stats` - Get agent statistics

### Health
- `GET /api/health` - Check backend status

## Deployment

### Frontend - Netlify

1. Push your code to GitHub
2. Connect to Netlify at https://app.netlify.com
3. Select your repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variable: `VITE_API_URL=<your-backend-url>`
7. Deploy!

### Backend - Render

1. Create account at https://render.com
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - Build command: `npm install`
   - Start command: `npm run server` (or `node server.js`)
5. Deploy!

## Demo Credentials

The application comes pre-loaded with demo data. No login is required.

### Sample Data

**Tickets:**
- TK-001 to TK-006 with various statuses and priorities

**Agents:**
- John Smith (Online)
- Sarah Johnson (Online)
- Mike Davis (Busy)
- Emily Wilson (Away)

## License

MIT
