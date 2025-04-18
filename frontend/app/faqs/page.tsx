"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, MessageCircle, Mail, Phone } from 'lucide-react'

const faqs = {
  'Orders & Shipping': [
    {
      question: "What are your shipping options?",
      answer: "We offer standard shipping (5-7 business days), express shipping (2-3 business days), and next-day delivery for select locations. Free shipping is available for orders over $100.",
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can use this number to track your package on our website or the carrier's website.",
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries worldwide. International shipping times and costs vary by location.",
    },
  ],
  'Returns & Refunds': [
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be in original condition with all packaging and accessories. Some items may have specific return restrictions.",
    },
    {
      question: "How do I initiate a return?",
      answer: "Log into your account, go to your orders, and select 'Return Item'. Follow the instructions to generate a return label. You can also contact our customer service for assistance.",
    },
    {
      question: "When will I receive my refund?",
      answer: "Refunds are processed within 3-5 business days after we receive and inspect the returned item. The funds may take additional time to appear in your account depending on your payment method.",
    },
  ],
  'Product Information': [
    {
      question: "Are your products covered by warranty?",
      answer: "Yes, all our products come with a minimum 1-year manufacturer's warranty. Some products have extended warranty options available for purchase.",
    },
    {
      question: "Can I purchase replacement parts?",
      answer: "Yes, replacement parts are available for most products. Contact our customer service with your product model number for assistance.",
    },
    {
      question: "Do you offer technical support?",
      answer: "Yes, we provide technical support via phone, email, and live chat. Our support team is available 24/7 to assist you with any product-related issues.",
    },
  ],
  'Account & Security': [
    {
      question: "How do I reset my password?",
      answer: "Click the 'Forgot Password' link on the login page. Enter your email address to receive password reset instructions.",
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your payment information. We are PCI compliant and never store your full credit card details.",
    },
    {
      question: "Can I manage multiple shipping addresses?",
      answer: "Yes, you can save and manage multiple shipping addresses in your account settings.",
    },
  ],
}

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Object.keys(faqs)

  const filteredFaqs = selectedCategory
    ? { [selectedCategory]: faqs[selectedCategory as keyof typeof faqs] }
    : faqs

  const searchResults = Object.entries(filteredFaqs).reduce((acc, [category, questions]) => {
    const filteredQuestions = questions.filter(
      q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (filteredQuestions.length > 0) {
      acc[category] = filteredQuestions
    }
    return acc
  }, {} as typeof faqs)

  return (
    <div className="min-h-screen py-16">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1920)',
              filter: 'brightness(0.3)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              How Can We Help?
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">
              Find answers to frequently asked questions about our products and services
            </p>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-black/5 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="whitespace-nowrap"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {Object.entries(searchResults).length > 0 ? (
                Object.entries(searchResults).map(([category, questions]) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mb-8"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-2xl font-bold">{category}</h2>
                      <Badge variant="secondary">
                        {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
                      </Badge>
                    </div>
                    <Accordion type="single" collapsible className="space-y-4">
                      {questions.map((faq, index) => (
                        <AccordionItem key={index} value={`${category}-${index}`}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-muted-foreground">
                              {faq.answer}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    No results found for "{searchQuery}"
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </div>
              )}
            </div>

            {/* Contact Support */}
            <div>
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-xl p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold mb-4">Still Need Help?</h3>
                  <p className="text-muted-foreground mb-6">
                    Can't find what you're looking for? Our support team is here to help.
                  </p>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Live Chat
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="mr-2 h-4 w-4" />
                      Email Support
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Us
                    </Button>
                  </div>
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-2">Support Hours</h4>
                    <p className="text-sm text-muted-foreground">
                      Monday - Friday: 24/7<br />
                      Saturday - Sunday: 9:00 AM - 6:00 PM
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}