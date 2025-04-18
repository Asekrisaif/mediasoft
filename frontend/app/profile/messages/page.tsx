"use client"

import { useState } from 'react'
import { useUserStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProfileSidebar } from '@/components/profile-sidebar'
import { Search, MessageSquare, User, Phone, Mail, Video, Image, Paperclip, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'

const messages = [
  {
    id: 1,
    user: {
      id: 'support-1',
      name: 'Sarah from Support',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      role: 'Customer Support',
      status: 'online',
    },
    messages: [
      {
        id: 1,
        content: "Hi! I'm Sarah from customer support. I understand you have a question about your recent order?",
        timestamp: '2024-03-15T10:00:00',
        type: 'received',
      },
      {
        id: 2,
        content: "Yes, I was wondering about the estimated delivery time for my Quantum X Pro laptop.",
        timestamp: '2024-03-15T10:02:00',
        type: 'sent',
      },
      {
        id: 3,
        content: "I've checked your order status and I can see that it's currently being processed. The estimated delivery time is 3-5 business days. Would you like me to send you the tracking information once it's available?",
        timestamp: '2024-03-15T10:05:00',
        type: 'received',
      },
    ],
    unread: 2,
    lastActive: '2 min ago',
  },
  {
    id: 2,
    user: {
      id: 'tech-1',
      name: 'Mike - Technical Support',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      role: 'Technical Support',
      status: 'away',
    },
    messages: [
      {
        id: 1,
        content: "Hello! How can I assist you with your Neural GPU setup today?",
        timestamp: '2024-03-14T15:30:00',
        type: 'received',
      },
    ],
    unread: 0,
    lastActive: '1 hour ago',
  },
]

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(messages[0])
  const [newMessage, setNewMessage] = useState('')
  const { user } = useUserStore()

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const updatedMessages = messages.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            {
              id: chat.messages.length + 1,
              content: newMessage,
              timestamp: new Date().toISOString(),
              type: 'sent',
            },
          ],
        }
      }
      return chat
    })

    setSelectedChat(updatedMessages.find(chat => chat.id === selectedChat.id)!)
    setNewMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSidebar />

          <div className="flex-1">
            <Card className="h-[calc(100vh-12rem)]">
              <div className="grid grid-cols-12 h-full">
                {/* Chat List */}
                <div className="col-span-4 border-r">
                  <div className="p-4 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search messages..."
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <ScrollArea className="h-[calc(100vh-16rem)]">
                    <div className="space-y-2 p-4">
                      {messages.map((chat) => (
                        <div
                          key={chat.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedChat.id === chat.id
                              ? 'bg-muted'
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedChat(chat)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar>
                                <AvatarImage src={chat.user.avatar} />
                                <AvatarFallback>{chat.user.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
                                chat.user.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium truncate">{chat.user.name}</h4>
                                <span className="text-xs text-muted-foreground">
                                  {chat.lastActive}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {chat.messages[chat.messages.length - 1].content}
                              </p>
                            </div>
                          </div>
                          {chat.unread > 0 && (
                            <div className="flex justify-end mt-2">
                              <Badge variant="secondary">
                                {chat.unread} new
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Chat Area */}
                <div className="col-span-8 flex flex-col">
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedChat.user.avatar} />
                        <AvatarFallback>{selectedChat.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{selectedChat.user.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedChat.user.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <User className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {selectedChat.messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.1 }}
                          className={`flex ${
                            message.type === 'sent' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div className={`max-w-[70%] ${
                            message.type === 'sent'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          } rounded-lg p-3`}>
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex items-end gap-4">
                      <div className="flex-1">
                        <Textarea
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="ghost" size="icon">
                          <Image className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button
                          className="bg-primary text-primary-foreground"
                          size="icon"
                          onClick={sendMessage}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}