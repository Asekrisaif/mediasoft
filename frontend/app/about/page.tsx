"use client"

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Cpu, Globe, Award, Users, Zap, BarChart, Rocket, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const teamMembers = [
  {
    name: 'Alex Chen',
    role: 'CEO & Founder',
    bio: 'Tech visionary with 15+ years of experience in the industry. Founded TechVerse to bring cutting-edge technology to everyone.',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Sarah Johnson',
    role: 'CTO',
    bio: 'Former lead engineer at Quantum Computing Inc. Passionate about pushing the boundaries of what technology can achieve.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Michael Torres',
    role: 'Head of Product',
    bio: 'Product strategist with a background in UX design. Focused on creating intuitive and powerful tech products.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Emily Zhang',
    role: 'Lead Designer',
    bio: 'Award-winning designer specializing in creating beautiful and functional interfaces for complex technology products.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
  },
]

const milestones = [
  {
    year: '2018',
    title: 'Company Founded',
    description: 'TechVerse was established with a mission to democratize access to cutting-edge technology.',
    icon: <Rocket className="h-6 w-6" />,
  },
  {
    year: '2019',
    title: 'First Product Launch',
    description: 'Released our flagship Quantum series, setting new standards in computing performance.',
    icon: <Cpu className="h-6 w-6" />,
  },
  {
    year: '2021',
    title: 'Global Expansion',
    description: 'Expanded operations to 15 countries, establishing TechVerse as a global technology leader.',
    icon: <Globe className="h-6 w-6" />,
  },
  {
    year: '2023',
    title: 'Innovation Award',
    description: 'Received the prestigious Tech Innovator of the Year award for our Neural GPU technology.',
    icon: <Award className="h-6 w-6" />,
  },
  {
    year: '2024',
    title: 'Community Milestone',
    description: 'Reached 1 million active users in our TechVerse community platform.',
    icon: <Users className="h-6 w-6" />,
  },
]

const values = [
  {
    title: 'Innovation',
    description: 'We constantly push the boundaries of whats possible, embracing new ideas and technologies.',
    icon: <Zap className="h-6 w-6 text-blue-600" />,
  },
  {
    title: 'Quality',
    description: 'We re committed to excellence in everything we create, from hardware to customer experience.',
    icon: <Award className="h-6 w-6 text-purple-600" />,
  },
  {
    title: 'Accessibility',
    description: 'We believe cutting-edge technology should be accessible to everyone, not just a select few.',
    icon: <Users className="h-6 w-6 text-emerald-600" />,
  },
  {
    title: 'Sustainability',
    description: 'We design products with environmental impact in mind, from materials to energy efficiency.',
    icon: <Globe className="h-6 w-6 text-amber-600" />,
  },
]

export default function AboutPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4">About Us</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Pioneering the Future of Technology
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              At TechVerse, we're on a mission to create innovative technology that empowers people and transforms industries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4">Our Story</Badge>
              <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                From Startup to Industry Leader
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2018, TechVerse began with a simple yet ambitious vision: to make cutting-edge technology accessible to everyone. What started as a small team of passionate engineers and designers has grown into a global technology company at the forefront of innovation.
                </p>
                <p>
                  Our journey has been defined by breakthrough products that challenge conventional thinking. From our first Quantum series that redefined computing performance to our Neural GPU technology that revolutionized AI processing, we've consistently pushed the boundaries of what's possible.
                </p>
                <p>
                  Today, TechVerse stands as a leader in the tech industry, with a diverse portfolio of products that empower creators, gamers, professionals, and everyday users to achieve more with technology.
                </p>
              </div>
              <div className="mt-8">
                <Button className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                  Learn More About Our Journey
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" 
                  alt="TechVerse team" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 w-2/3">
                <p className="text-white font-medium">
                  "Our goal is to create technology that feels like magic, yet is accessible to everyone."
                </p>
                <p className="text-white/80 text-sm mt-2">
                  — Alex Chen, Founder & CEO
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-24 bg-black/5 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Our Values</Badge>
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              What Drives Us Forward
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our core values shape everything we do, from product development to customer service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full bg-white/50 backdrop-blur-xl hover:shadow-lg transition-shadow">
                  <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Our Journey</Badge>
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Key Milestones
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Significant moments that have shaped our growth and success
            </p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-600 to-purple-600"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                    <div className={`${index % 2 === 0 ? 'ml-auto' : 'mr-auto'} w-fit`}>
                      <span className="text-sm font-semibold text-primary">{milestone.year}</span>
                      <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <div className="bg-white rounded-full p-2">
                      {milestone.icon}
                    </div>
                  </div>
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-black/5 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Our Team</Badge>
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Meet the Visionaries
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The talented individuals behind TechVerse's innovation and success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden h-full bg-white/50 backdrop-blur-xl hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.bio}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Join Us on Our Journey</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Discover how TechVerse is shaping the future of technology and empowering people around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="rounded-full" asChild>
                <Link href="/store">
                  Explore Our Products
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full text-white border-white hover:bg-white/10" asChild>
                <Link href="/contact">
                  Contact Us
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}