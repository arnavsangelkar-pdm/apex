'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { 
  BarChart3, 
  TrendingUp,
  MessageSquare,
  FileText,
  Globe,
  Send,
  X,
  Settings,
  Users,
  DollarSign,
  Star,
  Eye,
  PieChart,
  Download,
  Filter,
  Calendar,
  ArrowRight,
  ExternalLink,
  Zap,
  Target,
  Award,
  Activity,
  Monitor,
  LineChart,
  BarChart
} from 'lucide-react'

// Configure axios
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Agent {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
  category: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const backendAgents: Agent[] = [
  {
    id: 'customer_experience',
    name: 'Customer Experience Agent',
    description: 'Advanced customer analytics and optimization',
    icon: Users,
    color: 'bg-blue-500',
    category: 'Customer'
  },
  {
    id: 'product_analytics',
    name: 'Product Analytics Agent',
    description: 'Deep product performance and market insights',
    icon: BarChart3,
    color: 'bg-purple-500',
    category: 'Analytics'
  },
  {
    id: 'sales_optimizer',
    name: 'Sales Optimizer Agent',
    description: 'Revenue optimization and pricing strategies',
    icon: TrendingUp,
    color: 'bg-green-500',
    category: 'Sales'
  },
  {
    id: 'review_synthesis',
    name: 'Review Synthesis Engine',
    description: 'Customer review analysis and insights',
    icon: MessageSquare,
    color: 'bg-orange-500',
    category: 'Reviews'
  },
  {
    id: 'financial_reports',
    name: 'Financial Report Generator',
    description: 'Financial analysis and reporting',
    icon: DollarSign,
    color: 'bg-emerald-500',
    category: 'Finance'
  },
  {
    id: 'landing_page_generator',
    name: 'Landing Page Generator',
    description: 'Dynamic marketing page creation',
    icon: Globe,
    color: 'bg-pink-500',
    category: 'Marketing'
  }
]

const sampleQueries = {
  'customer_experience': [
    "What are our top customer acquisition channels?",
    "How can we improve customer satisfaction?",
    "Show me customer lifetime value trends"
  ],
  'product_analytics': [
    "Which products are performing best this quarter?",
    "What are the latest supplement trends?",
    "Show me customer performance data"
  ],
  'sales_optimizer': [
    "Which bundles perform best?",
    "How should we price new products?",
    "What's our subscription retention rate?"
  ],
  'review_synthesis': [
    "Summarize customer reviews for Whey Protein",
    "What are customers saying about our service?",
    "Show me sentiment analysis for this month"
  ],
  'financial_reports': [
    "How did Q2 compare to Q1 for subscriptions?",
    "Generate revenue analysis for this quarter",
    "Show me profitability by product line"
  ],
  'landing_page_generator': [
    "Build a landing page for our best-selling collagen powder for women over 40",
    "Create a New Year transformation campaign",
    "Generate a muscle building stack page"
  ]
}

const kpiData = [
  { label: 'Monthly Revenue', value: '$2.4M', change: '+34%', trend: 'up' },
  { label: 'Active Subscribers', value: '28,547', change: '+15%', trend: 'up' },
  { label: 'Customer Satisfaction', value: '94%', change: '+2%', trend: 'up' },
  { label: 'Average Order Value', value: '$78', change: '+8%', trend: 'up' }
]

export default function AdminDashboard() {
  // Hydration fix - prevent SSR/client mismatch
  const [mounted, setMounted] = useState(false)
  
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showAgentModal, setShowAgentModal] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewContent, setPreviewContent] = useState('')
  const [chartData, setChartData] = useState<any>(null)
  const [showChart, setShowChart] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Set mounted to true after hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent)
    setShowAgentModal(true)
    setMessages([{
      role: 'assistant',
      content: `Hello! I'm the ${agent.name}. I specialize in ${agent.description.toLowerCase()}. How can I help you analyze and optimize your business today?`,
      timestamp: new Date()
    }])
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedAgent || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await axios.post('/query/backend', {
        query: inputMessage,
        agent: selectedAgent.id,
        k: 3
      })

      const assistantResponse = response.data.response || 'I apologize, I encountered an issue processing your request.'
      
      // Handle different agent types with special features
      let enhancedContent = assistantResponse
      
      if (selectedAgent.id === 'landing_page_generator' && assistantResponse.includes('landing page')) {
        enhancedContent += '\n\n---\n\n**[Preview Landing Page] [Generate HTML]**'
        // Store the content for preview
        setPreviewContent(generateMockLandingPage(inputMessage, assistantResponse))
      }
      
      if ((selectedAgent.id === 'financial_reports' || selectedAgent.id === 'product_analytics') && 
          (inputMessage.toLowerCase().includes('chart') || inputMessage.toLowerCase().includes('graph') || 
           inputMessage.toLowerCase().includes('visual') || inputMessage.toLowerCase().includes('revenue') ||
           inputMessage.toLowerCase().includes('performance'))) {
        enhancedContent += '\n\n---\n\n**[Generate Chart] [Download Data]**'
        // Generate mock chart data
        setChartData(generateMockChartData(selectedAgent.id, inputMessage))
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: enhancedContent,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the API server is running.',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockLandingPage = (query: string, aiResponse: string) => {
    const productName = query.includes('collagen') ? 'Elite Collagen Matrix' : 
                       query.includes('protein') ? 'Elite Whey Isolate' : 
                       'APEX Elite Supplement'
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productName} - APEX</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <!-- Hero Section -->
        <div class="bg-black text-white py-20">
            <div class="max-w-4xl mx-auto px-4 text-center">
                <h1 class="text-5xl font-bold mb-6">${productName}</h1>
                <p class="text-xl mb-8 text-gray-300">Elite Performance for Next Generation Athletes</p>
                <button class="bg-green-400 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-300">
                    Order Now - $69.99
                </button>
            </div>
        </div>
        
        <!-- Features -->
        <div class="py-16 px-4">
            <div class="max-w-6xl mx-auto">
                <h2 class="text-3xl font-bold text-center mb-12">Why Choose ${productName}?</h2>
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="text-center p-6">
                        <div class="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span class="text-2xl">🏆</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Premium Quality</h3>
                        <p class="text-gray-600">Third-party tested for purity and potency</p>
                    </div>
                    <div class="text-center p-6">
                        <div class="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span class="text-2xl">⚡</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Fast Results</h3>
                        <p class="text-gray-600">See improvements in just 2 weeks</p>
                    </div>
                    <div class="text-center p-6">
                        <div class="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span class="text-2xl">🛡️</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Money-Back Guarantee</h3>
                        <p class="text-gray-600">30-day satisfaction guarantee</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- CTA -->
        <div class="bg-gray-900 text-white py-16 text-center">
            <h2 class="text-3xl font-bold mb-4">Ready to Reach Your APEX?</h2>
            <p class="text-xl mb-8 text-gray-300">Join elite athletes worldwide</p>
            <button class="bg-green-400 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-300">
                Order Now - Elite Shipping
            </button>
        </div>
    </div>
</body>
</html>
    `
  }

  const generateMockChartData = (agentId: string, query: string) => {
    if (agentId === 'financial_reports') {
      return {
        type: 'line',
        title: 'Revenue Trend - Q1 vs Q2',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Revenue ($)',
            data: [180000, 190000, 210000, 230000, 250000, 280000],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          }]
        }
      }
    } else {
      return {
        type: 'bar',
        title: 'Product Performance Analysis',
        data: {
          labels: ['Whey Protein', 'Creatine', 'Pre-Workout', 'BCAA', 'Fat Burner'],
          datasets: [{
            label: 'Sales',
            data: [1200, 800, 600, 400, 350],
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
          }]
        }
      }
    }
  }

  const downloadChartData = () => {
    if (chartData) {
      const dataStr = JSON.stringify(chartData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${chartData.title.replace(/\s+/g, '_')}_data.json`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleSampleQuery = (query: string) => {
    setInputMessage(query)
  }

  const closeAgentModal = () => {
    setShowAgentModal(false)
    setSelectedAgent(null)
    setMessages([])
  }

  // Don't render until mounted to prevent hydration errors
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="animate-pulse">
          <div className="h-20 bg-white shadow-sm"></div>
          <div className="p-8">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-white rounded-lg"></div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-white rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center border border-green-400">
                <Settings className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">APEX Admin</h1>
                <p className="text-sm text-green-600">Next Generation Business Intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.open('/', '_blank')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
                <span>View Store</span>
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{kpi.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <Activity className="h-4 w-4" />
                  <span>{kpi.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Agents Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">AI Business Intelligence Agents</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Zap className="h-4 w-4" />
              <span>Real-time AI insights</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {backendAgents.map((agent) => {
              const Icon = agent.icon
              return (
                <div
                  key={agent.id}
                  onClick={() => handleAgentSelect(agent)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${agent.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{agent.name}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{agent.category}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{agent.description}</p>
                      <div className="flex items-center text-blue-600 text-sm font-medium">
                        <span>Analyze Now</span>
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Reports</h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleAgentSelect(backendAgents.find(a => a.id === 'financial_reports')!)}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Q2 vs Q1 Revenue Analysis</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleAgentSelect(backendAgents.find(a => a.id === 'review_synthesis')!)}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Customer Satisfaction Summary</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleAgentSelect(backendAgents.find(a => a.id === 'product_analytics')!)}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Product Performance Insights</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Capabilities</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Real-time Analytics</p>
                  <p className="text-sm text-gray-600">Live business intelligence and insights</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Review Synthesis</p>
                  <p className="text-sm text-gray-600">8,000+ reviews analyzed instantly</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Globe className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Dynamic Content</p>
                  <p className="text-sm text-gray-600">Auto-generated landing pages</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Filter className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Calendar className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">94%</div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
              <div className="text-xs text-green-600 mt-1">+2% from last month</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">$2.4M</div>
              <div className="text-sm text-gray-600">Quarterly Revenue</div>
              <div className="text-xs text-green-600 mt-1">+34% from Q1</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">28,547</div>
              <div className="text-sm text-gray-600">Active Subscribers</div>
              <div className="text-xs text-green-600 mt-1">+15% growth</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Agent Modal */}
      {showAgentModal && selectedAgent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${selectedAgent.color} rounded-lg flex items-center justify-center`}>
                    <selectedAgent.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedAgent.name}</h3>
                    <p className="text-gray-600 text-sm">{selectedAgent.description}</p>
                  </div>
                </div>
                <button 
                  onClick={closeAgentModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex h-[60vh]">
              {/* Sample Queries Sidebar */}
              <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
                <h4 className="font-semibold mb-3 text-gray-900">Sample Queries</h4>
                <div className="space-y-2">
                  {sampleQueries[selectedAgent.id as keyof typeof sampleQueries]?.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => handleSampleQuery(query)}
                      className="w-full text-left p-3 text-sm bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg transition-colors"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                        <div className={`max-w-[85%] px-4 py-3 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <div className="text-sm leading-relaxed break-words">
                            <ReactMarkdown 
                              components={{
                                strong: ({children}) => {
                                  const text = children?.toString() || ''
                                  if (text.includes('[Preview Landing Page]')) {
                                    return (
                                      <button 
                                        onClick={() => setShowPreview(true)}
                                        className="inline-flex items-center space-x-1 bg-blue-500 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-600 mr-2"
                                      >
                                        <Monitor className="h-3 w-3" />
                                        <span>Preview</span>
                                      </button>
                                    )
                                  }
                                  if (text.includes('[Generate HTML]')) {
                                    return (
                                      <button 
                                        onClick={() => navigator.clipboard.writeText(previewContent)}
                                        className="inline-flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs hover:bg-green-600"
                                      >
                                        <FileText className="h-3 w-3" />
                                        <span>Copy HTML</span>
                                      </button>
                                    )
                                  }
                                  if (text.includes('[Generate Chart]')) {
                                    return (
                                      <button 
                                        onClick={() => setShowChart(true)}
                                        className="inline-flex items-center space-x-1 bg-purple-500 text-white px-3 py-1 rounded-full text-xs hover:bg-purple-600 mr-2"
                                      >
                                        <BarChart className="h-3 w-3" />
                                        <span>View Chart</span>
                                      </button>
                                    )
                                  }
                                  if (text.includes('[Download Data]')) {
                                    return (
                                      <button 
                                        onClick={() => downloadChartData()}
                                        className="inline-flex items-center space-x-1 bg-orange-500 text-white px-3 py-1 rounded-full text-xs hover:bg-orange-600"
                                      >
                                        <Download className="h-3 w-3" />
                                        <span>Download</span>
                                      </button>
                                    )
                                  }
                                  return <strong>{children}</strong>
                                },
                                code: ({children, className}) => {
                                  const isInline = !className
                                  if (isInline) {
                                    return (
                                      <code className="bg-gray-800 text-gray-100 px-1 py-0.5 rounded text-xs font-mono">
                                        {children}
                                      </code>
                                    )
                                  }
                                  return (
                                    <div className="my-3 bg-gray-900 rounded-lg overflow-hidden">
                                      <div className="bg-gray-800 px-4 py-2 text-xs text-gray-300 font-semibold">
                                        HTML Code
                                      </div>
                                      <pre className="p-4 text-xs text-gray-100 overflow-x-auto max-h-64">
                                        <code className="font-mono whitespace-pre-wrap break-all">
                                          {children}
                                        </code>
                                      </pre>
                                    </div>
                                  )
                                },
                                pre: ({children}) => {
                                  return (
                                    <div className="my-3 bg-gray-900 rounded-lg overflow-hidden">
                                      <div className="bg-gray-800 px-4 py-2 text-xs text-gray-300 font-semibold">
                                        Generated Code
                                      </div>
                                      <pre className="p-4 text-xs text-gray-100 overflow-x-auto max-h-64">
                                        <code className="font-mono whitespace-pre-wrap break-all">
                                          {children}
                                        </code>
                                      </pre>
                                    </div>
                                  )
                                }
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                          <div className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 px-4 py-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Ask for business insights..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={isLoading}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Landing Page Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Landing Page Preview</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(previewContent)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Copy HTML</span>
                  </button>
                  <button onClick={() => setShowPreview(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 overflow-auto max-h-[70vh]">
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={previewContent}
                  className="w-full h-96 border-0"
                  title="Landing Page Preview"
                />
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-3">HTML Source:</h4>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-40">
                  <code>{previewContent}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Modal */}
      {showChart && chartData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{chartData.title}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={downloadChartData}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Data</span>
                  </button>
                  <button onClick={() => setShowChart(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {chartData.type === 'line' ? (
                <div className="w-full h-80 bg-gray-50 rounded-lg flex items-center justify-center relative">
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    {/* Grid lines */}
                    <defs>
                      <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* Line chart */}
                    <polyline
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="3"
                      points="40,160 100,150 160,130 220,110 280,90 340,70"
                    />
                    
                                         {/* Data points */}
                     {chartData.data.datasets[0].data.map((_: number, index: number) => (
                       <circle
                         key={index}
                         cx={40 + index * 60}
                         cy={160 - (index * 15)}
                         r="4"
                         fill="#3B82F6"
                       />
                     ))}
                  </svg>
                  
                  {/* Labels */}
                  <div className="absolute bottom-2 left-0 right-0 flex justify-around text-xs text-gray-600">
                    {chartData.data.labels.map((label: string, index: number) => (
                      <span key={index}>{label}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full h-80 bg-gray-50 rounded-lg flex items-end justify-around p-4 space-x-2">
                  {chartData.data.datasets[0].data.map((value: number, index: number) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div 
                        className="w-12 rounded-t"
                        style={{ 
                          height: `${(value / Math.max(...chartData.data.datasets[0].data)) * 200}px`,
                          backgroundColor: chartData.data.datasets[0].backgroundColor[index]
                        }}
                      />
                      <span className="text-xs text-gray-600 text-center">
                        {chartData.data.labels[index]}
                      </span>
                      <span className="text-xs font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Data Summary:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Data Points:</span>
                    <span className="ml-2 font-semibold">{chartData.data.labels.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Chart Type:</span>
                    <span className="ml-2 font-semibold capitalize">{chartData.type}</span>
                  </div>
                  {chartData.type === 'line' && (
                    <div className="col-span-2">
                      <span className="text-gray-600">Trend:</span>
                      <span className="ml-2 font-semibold text-green-600">📈 Increasing</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}