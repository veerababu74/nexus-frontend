import express from 'express';
import cors from 'cors';

const app = express();
const port = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock responses for different endpoints
const mockResponses = [
    "Hello! I'm a mock AI assistant. How can I help you today?",
    "That's an interesting question! Let me think about that...",
    "I understand what you're asking. Here's my response based on the information provided.",
    "Thank you for your message! I'm here to assist you with any questions you may have.",
    "Based on your input, I can provide some insights on that topic.",
    "That's a great point! Let me elaborate on that for you.",
    "I see what you mean. Here's how I would approach this situation.",
    "Excellent question! Let me break this down for you step by step."
];

// Regular chat endpoint
app.post('/nexusai/conversation/chat', (req, res) => {
    console.log('Regular chat request received:', req.body);

    const { index, query, history } = req.body;

    if (!query) {
        return res.status(400).json({
            error: 'Query is required'
        });
    }

    // Simulate AI processing delay
    setTimeout(() => {
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

        res.json({
            response: `${randomResponse} You asked: "${query}" (Index: ${index})`,
            source: [],
            status: 'success',
            timestamp: new Date().toISOString()
        });
    }, 500); // 500ms delay to simulate processing
});// Improved chat endpoint
app.post('/nexus/ai/v3/chat', (req, res) => {
    console.log('Improved chat request received:', req.body);

    const { message, session_id, index_name } = req.body;

    if (!message) {
        return res.status(400).json({
            error: 'Message is required'
        });
    }

    // Simulate AI processing delay
    setTimeout(() => {
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

        res.json({
            response: `Enhanced AI Response: ${randomResponse} (Session: ${session_id}, Index: ${index_name})`,
            analysis: {
                intent: "information_seeking",
                topic: "general_conversation",
                stage: "exploration",
                tone: "friendly"
            },
            followUpQuestions: [
                "Would you like to know more about this topic?",
                "Is there a specific aspect you'd like me to focus on?",
                "How can I better assist you with this?"
            ],
            suggestedTopics: [
                "Related concepts",
                "Best practices",
                "Common questions"
            ],
            userInterest: {
                engagement: "high",
                curiosity: "moderate",
                expertise: "beginner"
            },
            bioResponse: {
                tone: "conversational",
                formality: "casual",
                enthusiasm: "moderate"
            },
            metadata: {
                processingTime: "0.5s",
                confidence: 0.85,
                sessionId: session_id,
                indexName: index_name
            }
        });
    }, 800); // 800ms delay to simulate enhanced processing
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Mock API server is running' });
});

// Start server
app.listen(port, () => {
    console.log(`Mock API server running on http://localhost:${port}`);
    console.log('Available endpoints:');
    console.log('- POST /nexusai/conversation/chat (Regular chat)');
    console.log('- POST /nexus/ai/v3/chat (Improved chat)');
    console.log('- GET /health (Health check)');
});

export default app;
