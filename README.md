# Nexus AI Chat Platform

A modern, dual-interface chat application built with React and Vite, featuring both regular and advanced AI chat capabilities.

## Features

### 🤖 Dual Chat Interface
- **Regular Chat**: Standard AI conversation interface
- **Advanced Chat**: Enhanced AI with intelligence analytics and context awareness

### 🚀 Advanced AI Capabilities
- Intent analysis and topic detection
- Conversation stage tracking
- Context-aware responses
- Interactive follow-up questions
- Suggested topics and user interest tracking
- Bio-response detection with tone analysis

### 🎨 Modern UI/UX
- Gradient backgrounds with glass morphism effects
- Smooth animations and transitions
- Mobile-responsive design
- Real-time session statistics
- Interactive elements and visual feedback

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## API Configuration

The application uses environment variables for API configuration:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

### API Endpoints

#### Regular Chat
- **Endpoint**: `POST /nexusai/conversation/chat`
- **Format**: Standard chat request/response

#### Advanced Chat
- **Endpoint**: `POST /improved-chat`
- **Request**: 
```json
{
  "message": "string",
  "session_id": "veera1234",
  "index_name": "veera"
}
```
- **Response**: Enhanced response with analytics data

## Project Structure

```
src/
├── api/
│   ├── chatAPI.js           # Regular chat API
│   └── improvedChatAPI.js   # Advanced chat API
├── components/
│   └── Chat/
│       ├── Chat.jsx         # Regular chat component
│       ├── Chat.css         # Regular chat styles
│       ├── ImprovedChat.jsx # Advanced chat component
│       └── ImprovedChat.css # Advanced chat styles
└── App.jsx                  # Main app with navigation
```

## Documentation

See [IMPROVED_CHAT_DOCS.md](./IMPROVED_CHAT_DOCS.md) for detailed documentation on the advanced chat features.

## Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: CSS3 with modern features
- **Build Tool**: Vite
- **Linting**: ESLint

## Development

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
