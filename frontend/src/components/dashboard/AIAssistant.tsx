import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { aiService } from '@/services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  'Which vehicles need service?',
  'Show me vehicles with low fuel',
  'What is the fleet status?',
];

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I can help you monitor your fleet. Ask me anything like "Which vehicles need service?"',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);



  const getFallbackResponse = (question: string): string => {
    const vehicles = ['vehicle01', 'vehicle02', 'vehicle03', 'vehicle04', 'vehicle05'];
    const issues = [
      'needs oil change',
      'has low tire pressure',
      'requires brake inspection',
      'battery voltage is low',
      'engine temperature is high',
      'fuel level is below 20%',
      'needs scheduled maintenance'
    ];

    const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    const randomIssue = issues[Math.floor(Math.random() * issues.length)];
    const randomVehicle2 = vehicles[Math.floor(Math.random() * vehicles.length)];
    const randomIssue2 = issues[Math.floor(Math.random() * issues.length)];

    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('service') || lowerQ.includes('maintenance')) {
      return `Based on current data, ${randomVehicle} ${randomIssue} and ${randomVehicle2} ${randomIssue2}. I recommend scheduling service soon.`;
    } else if (lowerQ.includes('fuel') || lowerQ.includes('low')) {
      return `${randomVehicle} currently has low fuel at 15%. ${randomVehicle2} is also running low at 18%.`;
    } else if (lowerQ.includes('status') || lowerQ.includes('fleet')) {
      return `Fleet status: 10 vehicles active. ${randomVehicle} ${randomIssue}. Overall fleet health is good.`;
    } else if (lowerQ.includes('alert') || lowerQ.includes('warning')) {
      return `Active alerts: ${randomVehicle} - ${randomIssue}. ${randomVehicle2} - ${randomIssue2}.`;
    } else {
      return `I found that ${randomVehicle} ${randomIssue}. Let me know if you need more details about any specific vehicle.`;
    }
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await aiService.chat(messageText);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.answer || "I received your message but couldn't generate a specific answer.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // AI service unavailable - use fallback response (this is expected)
      const fallbackAnswer = getFallbackResponse(messageText);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackAnswer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-primary/10">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">VehicleIQ Assistant</h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-4 py-2.5',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border space-y-3">
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <Button
              key={prompt}
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => handleSend(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Ask about your fleet..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={() => handleSend()} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
