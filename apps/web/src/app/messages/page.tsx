'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, LoadingSpinner, EmptyState, Card } from '@/components/ui';

interface Message {
  message_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  created_at: string;
  is_read: boolean;
  attachments?: Attachment[];
}

interface Attachment {
  id: string;
  type: 'image' | 'file' | 'contract';
  url: string;
  name: string;
}

interface Thread {
  thread_id: string;
  participant_ids: string[];
  participants: Array<{ user_id: string; name: string; avatar?: string }>;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  is_active: boolean;
}

export default function MessagesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    loadThreads();
    initializeSocket();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadThreads() {
    try {
      setLoading(true);
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/threads`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('Failed to load threads');

      const data = await res.json();
      setThreads(data.data || []);

      // Auto-select first thread
      if (data.data && data.data.length > 0) {
        setSelectedThreadId(data.data[0].thread_id);
        loadMessages(data.data[0].thread_id);
      }
    } catch (err) {
      console.error('Load threads error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(threadId: string) {
    try {
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/${threadId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('Failed to load messages');

      const data = await res.json();
      setMessages(data.data || []);
    } catch (err) {
      console.error('Load messages error:', err);
    }
  }

  function initializeSocket() {
    const token = localStorage.getItem('veritas_token');
    if (!token) return;

    // Connect to WebSocket (backend must provide this)
    const wsUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws')}/socket.io`;
    
    try {
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        console.log('WebSocket connected');
        socketRef.current?.send(JSON.stringify({
          type: 'auth',
          token,
        }));
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'new_message') {
          // Add message if in current thread
          if (data.thread_id === selectedThreadId) {
            setMessages((prev) => [...prev, data.message]);
          }

          // Update thread list
          setThreads((prev) =>
            prev.map((t) =>
              t.thread_id === data.thread_id
                ? {
                    ...t,
                    last_message: data.message.content,
                    last_message_time: data.message.created_at,
                  }
                : t
            )
          );
        }

        if (data.type === 'typing') {
          // Show typing indicator (you can add a component for this)
          console.log(`${data.user_name} is typing...`);
        }

        if (data.type === 'message_read') {
          // Update message read status
          setMessages((prev) =>
            prev.map((m) =>
              m.message_id === data.message_id ? { ...m, is_read: true } : m
            )
          );
        }
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socketRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        // Reconnect after 3 seconds
        setTimeout(initializeSocket, 3000);
      };
    } catch (err) {
      console.error('WebSocket connection error:', err);
    }
  }

  async function handleSendMessage() {
    if (!messageInput.trim() || !selectedThreadId) return;

    try {
      setSending(true);
      const token = localStorage.getItem('veritas_token');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/send`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            thread_id: selectedThreadId,
            content: messageInput,
          }),
        }
      );

      if (!res.ok) throw new Error('Failed to send message');

      setMessageInput('');
      // Message will be added via WebSocket
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading messages..." />;
  }

  const selectedThread = threads.find((t) => t.thread_id === selectedThreadId);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white flex flex-col lg:flex-row">
        {/* Threads List (Sidebar) */}
        <div className="w-full lg:w-72 bg-gray-900/50 border-b lg:border-b-0 lg:border-r border-gray-800 overflow-y-auto">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold mb-4">💬 Messages</h2>
            <Button
              variant="primary"
              fullWidth
              size="sm"
              onClick={() => router.push('/messages/new')}
            >
              + New Message
            </Button>
          </div>

          {threads.length === 0 ? (
            <div className="p-4">
              <EmptyState
                icon="💬"
                title="No messages"
                description="Start a conversation"
                variant="compact"
              />
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {threads.map((thread) => (
                <button
                  key={thread.thread_id}
                  onClick={() => {
                    setSelectedThreadId(thread.thread_id);
                    loadMessages(thread.thread_id);
                  }}
                  className={`w-full p-4 text-left transition-all ${
                    selectedThreadId === thread.thread_id
                      ? 'bg-blue-900/30 border-l-2 border-l-blue-500'
                      : 'hover:bg-gray-800/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-bold text-sm">
                      {thread.participants
                        .map((p) => p.name)
                        .slice(0, 2)
                        .join(', ')}
                    </p>
                    {thread.unread_count > 0 && (
                      <span className="px-2 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">
                        {thread.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {thread.last_message || 'No messages yet'}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        {selectedThread ? (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-gray-900/50 border-b border-gray-800 p-4">
              <h3 className="font-bold text-lg">
                {selectedThread.participants.map((p) => p.name).join(', ')}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {selectedThread.is_active ? '🟢 Active' : '⚫ Offline'}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <EmptyState
                    icon="💬"
                    title="No messages yet"
                    description="Start the conversation"
                    variant="compact"
                  />
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <MessageBubble key={msg.message_id} message={msg} />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="bg-gray-900/50 border-t border-gray-800 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message... (Shift+Enter for new line)"
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                />
                <Button
                  variant="primary"
                  onClick={handleSendMessage}
                  loading={sending}
                  disabled={!messageInput.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon="💬"
              title="Select a conversation"
              description="Choose a thread to view messages"
              variant="compact"
            />
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isCurrentUser = localStorage.getItem('veritas_user_id') === message.sender_id;

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
          isCurrentUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-800 text-gray-100 rounded-bl-none'
        }`}
      >
        {!isCurrentUser && (
          <p className="text-xs font-bold text-gray-400 mb-1">
            {message.sender_name}
          </p>
        )}
        <p className="break-words text-sm">{message.content}</p>
        <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}
