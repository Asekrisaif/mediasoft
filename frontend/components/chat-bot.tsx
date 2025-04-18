"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  Send,
  X,
  ExternalLink,
  Bot,
  User as UserIcon,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useChatStore } from "@/lib/store";
import { generateResponse } from "@/lib/chatbot";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function Chatbot() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, isOpen, addMessage, toggleChat } = useChatStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    addMessage({ type: "user", content: input });

    // Generate and add bot response
    const response = generateResponse(input);
    addMessage({
      type: "bot",
      content: response.content,
      suggestions: response.suggestions,
      productLinks: response.productLinks,
    });

    setInput("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    addMessage({ type: "user", content: suggestion });
    const response = generateResponse(suggestion);
    addMessage({
      type: "bot",
      content: response.content,
      suggestions: response.suggestions,
      productLinks: response.productLinks,
    });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={toggleChat}
          className="group relative size-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:opacity-90"
        >
          <div className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-10" />
          <MessageCircle className="size-6 text-white" />
        </Button>
      </motion.div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 overflow-hidden rounded-2xl border-0 bg-white/80 shadow-lg backdrop-blur-xl dark:bg-gray-900/80 sm:w-96">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-600 to-purple-600 p-4">
          <div className="flex items-center gap-2 text-white">
            <Bot className="size-5" />
            <h2 className="font-semibold">AI Assistant</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleChat}
            className="text-white hover:bg-white/20"
          >
            <X className="size-4" />
          </Button>
        </div>

        <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                  <Sparkles className="size-8 text-white" />
                </div>
                <p className="mb-2 text-lg font-medium">
                  Welcome to TechVerse AI
                </p>
                <p className="mb-6 text-muted-foreground">
                  How can I assist you today?
                </p>
                <div className="grid gap-2">
                  {[
                    "Find gaming laptops",
                    "Compare graphics cards",
                    "Check product availability",
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      className="group w-full justify-between hover:border-primary/50"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                      <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      } mb-4`}
                    >
                      {message.type === "bot" && (
                        <div className="mr-2 flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                          <Bot className="size-4 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[80%]`}>
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            message.type === "user"
                              ? "ml-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        {message.type === "bot" && message.suggestions && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                        {message.type === "bot" && message.productLinks && (
                          <div className="mt-2 space-y-2">
                            {message.productLinks.map((link, index) => (
                              <Link
                                key={index}
                                href={link.url}
                                className="group flex items-center gap-2 rounded-lg bg-gray-50 p-2 transition-colors hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800"
                              >
                                <span className="flex-1 text-sm">
                                  {link.name}
                                </span>
                                <ExternalLink className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                      {message.type === "user" && (
                        <div className="ml-2 flex size-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                          <UserIcon className="size-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>

        <form
          onSubmit={handleSubmit}
          className="border-t bg-white/50 p-4 backdrop-blur-sm dark:bg-gray-900/50"
        >
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, specs, or stock..."
              className="flex-1 border-0 bg-gray-100 focus-visible:ring-1 focus-visible:ring-primary dark:bg-gray-800"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
            >
              <Send className="size-4 text-white" />
            </Button>
          </div>
        </form>
      </motion.div>
    </Card>
  );
}
