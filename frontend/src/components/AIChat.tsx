import React, { useState } from 'react';
import { Paper, Typography, Box, TextField, Button, List, ListItem, Chip, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { aiService } from '../services/api';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const AIChat: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: 'Hello! I can help you monitor your fleet. Ask me anything like "Which vehicles need service?"' }
    ]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const res = await aiService.chat(userMsg);
            setMessages(prev => [...prev, { sender: 'ai', text: res.data.answer }]);
        } catch (e) {
            setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I encountered an error connecting to the AI service.' }]);
        } finally {
            setLoading(false);
        }
    };

    const suggestions = [
        "Which vehicles need service?",
        "Show me vehicles with low fuel",
        "What is the fleet status?"
    ];

    return (
        <Paper elevation={3} sx={{ height: '500px', display: 'flex', flexDirection: 'column', mt: 2 }}>
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                <AutoAwesomeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">VehicleIQ Assistant</Typography>
            </Box>

            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                <List>
                    {messages.map((msg, idx) => (
                        <ListItem key={idx} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                            <Paper sx={{
                                p: 2,
                                bgcolor: msg.sender === 'user' ? '#1976d2' : '#e0e0e0',
                                color: msg.sender === 'user' ? 'white' : 'black',
                                maxWidth: '80%',
                                borderRadius: 2
                            }}>
                                <Typography variant="body1">{msg.text}</Typography>
                            </Paper>
                        </ListItem>
                    ))}
                    {loading && (
                        <ListItem>
                            <CircularProgress size={20} />
                        </ListItem>
                    )}
                </List>
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid #ddd' }}>
                <Box sx={{ mb: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {suggestions.map((s, i) => (
                        <Chip key={i} label={s} onClick={() => setInput(s)} size="small" clickable />
                    ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Ask about your fleet..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button variant="contained" onClick={handleSend} endIcon={<SendIcon />}>
                        Send
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default AIChat;
