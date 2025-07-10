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
    "Show cohort chart",
    "Q3 retention rates",
    "Customer satisfaction summary",
    "Subscription churn analysis",
    "Generate cohort analysis"
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
  const [loadingMessage, setLoadingMessage] = useState('')
  const [cancelRequest, setCancelRequest] = useState<() => void>(() => {})
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

    // Set loading message based on agent type
    const agentLoadingMessages = {
      'customer_experience': 'Analyzing customer data (15s max)...',
      'product_analytics': 'Processing product metrics...',
      'financial_reports': 'Generating financial analysis...',
      'review_synthesis': 'Synthesizing customer reviews...',
      'landing_page_generator': 'Creating landing page...',
      'sales_optimizer': 'Optimizing sales strategy...'
    }
    setLoadingMessage(agentLoadingMessages[selectedAgent.id as keyof typeof agentLoadingMessages] || 'Processing your request...')

    // Create cancel token for this request
    const cancelTokenSource = axios.CancelToken.source()
    setCancelRequest(() => () => {
      cancelTokenSource.cancel('Request cancelled by user')
      setIsLoading(false)
      setLoadingMessage('')
    })

    try {
      // Configure axios with timeout and optimized parameters for faster responses
      const timeoutMs = selectedAgent.id === 'customer_experience' ? 12000 : 18000; // 12s for customer experience, 18s for others (further reduced)
      const kValue = 1; // Use only 1 document for maximum speed on all agents
      
      const response = await axios.post('/query/backend', {
        query: inputMessage,
        agent: selectedAgent.id,
        k: kValue
      }, {
        timeout: timeoutMs,
        cancelToken: cancelTokenSource.token,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const assistantResponse = response.data.response || 'I apologize, I encountered an issue processing your request.'
      
      // Handle different agent types with special features
      let enhancedContent = assistantResponse
      
      // Landing page generator gets preview functionality
      if (selectedAgent.id === 'landing_page_generator' && assistantResponse.includes('landing page')) {
        enhancedContent += '\n\n---\n\n**[Preview Landing Page] [Generate HTML]**'
        // Store the content for preview
        setPreviewContent(generateMockLandingPage(inputMessage, assistantResponse))
      }
      
      // ALL agents get chart generation capability
      enhancedContent += '\n\n---\n\n**[View Chart] [Download Data]**'
      // Generate chart data for all agents
      setChartData(generateChartDataForAgent(selectedAgent.id, inputMessage, assistantResponse))

      const assistantMessage: Message = {
        role: 'assistant',
        content: enhancedContent,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('Error sending message:', error)
      
      // Don't show error message if request was cancelled
      if (axios.isCancel(error)) {
        console.log('Request cancelled by user')
        return
      }
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.'
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'The request timed out. The AI agent is processing too much data. Please try a simpler, more specific question.'
      } else if (error.response?.status === 404) {
        errorMessage = 'API server not found. Please make sure the backend server is running on port 8000.'
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. The AI agent may be overloaded. Please try again in a moment.'
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
      setLoadingMessage('')
      setCancelRequest(() => {})
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



  const generateCohortChartData = (query: string) => {
    return {
      type: 'cohort',
      title: 'Q3 2025 Subscription Cohort Analysis',
      data: {
        cohorts: [
          { month: 'Jan 2025', signups: 24, retention: [100, 83, 75, 71, 63, 58, 54, 51, 48, 45, 42, 39, 36] },
          { month: 'Feb 2025', signups: 27, retention: [100, 81, 74, 70, 61, 56, 52, 49, 46, 43, 40, 37] },
          { month: 'Mar 2025', signups: 33, retention: [100, 85, 79, 73, 67, 62, 58, 55, 52, 49, 46] },
          { month: 'Apr 2025', signups: 30, retention: [100, 87, 80, 76, 69, 64, 60, 57, 54, 51] },
          { month: 'May 2025', signups: 34, retention: [100, 85, 79, 74, 68, 63, 59, 56, 53] },
          { month: 'Jun 2025', signups: 28, retention: [100, 82, 75, 71, 67, 62, 58, 55] },
          { month: 'Jul 2025', signups: 34, retention: [100, 84, 79, 74, 69, 64, 60] },
          { month: 'Aug 2025', signups: 26, retention: [100, 85, 77, 72, 67, 62] },
          { month: 'Sep 2025', signups: 31, retention: [100, 81, 76, 71, 66] },
          { month: 'Oct 2025', signups: 29, retention: [100, 83, 78, 73] }
        ],
        timeLabels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
      }
    }
  }

  // Generate chart data for any agent based on agent type
  const generateChartDataForAgent = (agentId: string, query: string, aiResponse: string) => {
    switch (agentId) {
      case 'customer_experience':
        return {
          type: 'cohort',
          title: 'Customer Retention Analysis',
          data: {
            cohorts: [
              { month: 'Jan 2025', signups: 24, retention: [100, 83, 75, 71, 63, 58, 54, 51, 48, 45, 42, 39, 36] },
              { month: 'Feb 2025', signups: 27, retention: [100, 81, 74, 70, 61, 56, 52, 49, 46, 43, 40, 37] },
              { month: 'Mar 2025', signups: 33, retention: [100, 85, 79, 73, 67, 62, 58, 55, 52, 49, 46] },
              { month: 'Apr 2025', signups: 30, retention: [100, 87, 80, 76, 69, 64, 60, 57, 54, 51] },
              { month: 'May 2025', signups: 34, retention: [100, 85, 79, 74, 68, 63, 59, 56, 53] },
              { month: 'Jun 2025', signups: 28, retention: [100, 82, 75, 71, 67, 62, 58, 55] }
            ],
            timeLabels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
          }
        }

      case 'financial_reports':
        return {
          type: 'line',
          title: 'Revenue Growth Analysis',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Revenue ($)',
              data: [180000, 190000, 210000, 230000, 250000, 280000],
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
            }]
          }
        }

      case 'product_analytics':
        return {
          type: 'bar',
          title: 'Product Performance Metrics',
          data: {
            labels: ['Whey Protein', 'Creatine', 'Pre-Workout', 'BCAA', 'Fat Burner'],
            datasets: [{
              label: 'Sales Volume',
              data: [1200, 800, 600, 400, 350],
              backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
            }]
          }
        }

      case 'sales_optimizer':
        return {
          type: 'bar',
          title: 'Sales Optimization Insights',
          data: {
            labels: ['Q1 Sales', 'Q2 Sales', 'Q3 Forecast', 'Q4 Target'],
            datasets: [{
              label: 'Revenue ($)',
              data: [450000, 520000, 580000, 650000],
              backgroundColor: ['#10b981', '#22c55e', '#84cc16', '#eab308'],
            }]
          }
        }

      case 'review_synthesis':
        return {
          type: 'bar',
          title: 'Customer Sentiment Analysis',
          data: {
            labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
            datasets: [{
              label: 'Review Count',
              data: [3200, 1800, 400, 150, 50],
              backgroundColor: ['#10b981', '#22c55e', '#fbbf24', '#f59e0b', '#ef4444'],
            }]
          }
        }

      case 'landing_page_generator':
        return {
          type: 'line',
          title: 'Landing Page Performance',
          data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
              label: 'Conversion Rate (%)',
              data: [2.1, 2.8, 3.2, 3.9],
              borderColor: 'rgb(168, 85, 247)',
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
            }]
          }
        }

      default:
        // Default chart for any other agents
        return {
          type: 'bar',
          title: 'Business Intelligence Overview',
          data: {
            labels: ['Customers', 'Revenue', 'Products', 'Growth'],
            datasets: [{
              label: 'Performance Metrics',
              data: [28547, 2400000, 8, 34],
              backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
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
      <div className="min-h-screen bg-black">
        <div className="animate-pulse">
          <div className="h-20 bg-gray-900 shadow-2xl border-b border-gray-800"></div>
          <div className="p-8">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-900/50 rounded-xl border border-gray-800"></div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-900/50 rounded-xl border border-gray-800"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-sm shadow-2xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">APEX Admin</h1>
                <p className="text-sm text-green-400 font-medium">Next Generation Business Intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.open('/', '_blank')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-green-400 transition-colors rounded-lg hover:bg-gray-800"
              >
                <ExternalLink className="h-5 w-5" />
                <span>View Store</span>
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
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
            <div key={index} className="bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-800 hover:border-green-400/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-medium">{kpi.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{kpi.value}</p>
                </div>
                <div className={`flex items-center space-x-1 text-sm font-semibold ${
                  kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'
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
            <h2 className="text-2xl font-bold text-white">AI Business Intelligence Agents</h2>
            <div className="flex items-center space-x-2 text-sm text-green-400 font-medium">
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
                  className="bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-2xl hover:shadow-green-400/10 border border-gray-800 hover:border-green-400/30 transition-all duration-300 cursor-pointer group p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${agent.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">{agent.name}</h3>
                        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full border border-gray-700">{agent.category}</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{agent.description}</p>
                      <div className="flex items-center text-green-400 text-sm font-medium">
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
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Reports</h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleAgentSelect(backendAgents.find(a => a.id === 'financial_reports')!)}
                className="w-full text-left p-3 hover:bg-gray-800/50 rounded-lg transition-colors flex items-center justify-between text-gray-300 hover:text-green-400 border border-gray-800 hover:border-green-400/30"
              >
                <span>Q2 vs Q1 Revenue Analysis</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleAgentSelect(backendAgents.find(a => a.id === 'review_synthesis')!)}
                className="w-full text-left p-3 hover:bg-gray-800/50 rounded-lg transition-colors flex items-center justify-between text-gray-300 hover:text-green-400 border border-gray-800 hover:border-green-400/30"
              >
                <span>Customer Satisfaction Summary</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleAgentSelect(backendAgents.find(a => a.id === 'product_analytics')!)}
                className="w-full text-left p-3 hover:bg-gray-800/50 rounded-lg transition-colors flex items-center justify-between text-gray-300 hover:text-green-400 border border-gray-800 hover:border-green-400/30"
              >
                <span>Product Performance Insights</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">AI Capabilities</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-400/30">
                  <BarChart3 className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Real-time Analytics</p>
                  <p className="text-sm text-gray-400">Live business intelligence and insights</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center border border-green-400/30">
                  <MessageSquare className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Review Synthesis</p>
                  <p className="text-sm text-gray-400">8,000+ reviews analyzed instantly</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-400/30">
                  <Globe className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Dynamic Content</p>
                  <p className="text-sm text-gray-400">Auto-generated landing pages</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Performance Overview</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-green-400 transition-colors">
                <Filter className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-green-400 transition-colors">
                <Calendar className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-green-400 transition-colors">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 border border-gray-800 rounded-xl bg-gray-800/30 hover:border-blue-400/30 transition-colors">
              <div className="text-2xl font-bold text-blue-400 mb-1">94%</div>
              <div className="text-sm text-gray-400">Customer Satisfaction</div>
              <div className="text-xs text-green-400 mt-1 font-medium">+2% from last month</div>
            </div>
            <div className="text-center p-4 border border-gray-800 rounded-xl bg-gray-800/30 hover:border-green-400/30 transition-colors">
              <div className="text-2xl font-bold text-green-400 mb-1">$2.4M</div>
              <div className="text-sm text-gray-400">Quarterly Revenue</div>
              <div className="text-xs text-green-400 mt-1 font-medium">+34% from Q1</div>
            </div>
            <div className="text-center p-4 border border-gray-800 rounded-xl bg-gray-800/30 hover:border-purple-400/30 transition-colors">
              <div className="text-2xl font-bold text-purple-400 mb-1">28,547</div>
              <div className="text-sm text-gray-400">Active Subscribers</div>
              <div className="text-xs text-green-400 mt-1 font-medium">+15% growth</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Agent Modal */}
      {showAgentModal && selectedAgent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-3xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-700 flex flex-col">
            {/* Header - Always visible */}
            <div className="flex-shrink-0 p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${selectedAgent.color} rounded-xl flex items-center justify-center`}>
                    <selectedAgent.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedAgent.name}</h3>
                    <p className="text-gray-400">{selectedAgent.description}</p>
                  </div>
                </div>
                <button 
                  onClick={closeAgentModal}
                  className="p-3 hover:bg-gray-700 rounded-xl transition-colors text-gray-400 hover:text-white flex items-center justify-center"
                  title="Close"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="flex flex-1 min-h-0">
              {/* Sample Queries Sidebar */}
              <div className="w-80 border-r border-gray-700 bg-gray-800 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <h4 className="font-semibold mb-4 text-white text-lg">Sample Queries</h4>
                <div className="space-y-3">
                  {sampleQueries[selectedAgent.id as keyof typeof sampleQueries]?.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => handleSampleQuery(query)}
                      className="w-full text-left p-4 text-sm bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-green-400 rounded-xl transition-all duration-300 text-gray-200 hover:text-white shadow-lg hover:shadow-xl"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col bg-gray-900 min-h-0">
                <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                  <div className="space-y-6 max-w-5xl mx-auto">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
                        <div className={`max-w-[80%] px-6 py-4 rounded-2xl ${
                          message.role === 'user' 
                            ? 'bg-gradient-to-br from-green-500 to-blue-600 text-white shadow-lg' 
                            : 'bg-gray-800 text-gray-100 border border-gray-700 shadow-lg'
                        }`}>
                          <div className="text-base leading-relaxed break-words">
                            <ReactMarkdown 
                              className="prose prose-invert max-w-none"
                              components={{
                                strong: ({children}) => {
                                  const text = children?.toString() || ''
                                  if (text.includes('[Preview Landing Page]')) {
                                    return (
                                      <button 
                                        onClick={() => setShowPreview(true)}
                                        className="inline-flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:from-blue-600 hover:to-blue-700 mr-2 shadow-lg"
                                      >
                                        <Monitor className="h-4 w-4" />
                                        <span>Preview</span>
                                      </button>
                                    )
                                  }
                                  if (text.includes('[Generate HTML]')) {
                                    return (
                                      <button 
                                        onClick={() => navigator.clipboard.writeText(previewContent)}
                                        className="inline-flex items-center space-x-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg text-sm hover:from-green-600 hover:to-green-700 shadow-lg"
                                      >
                                        <FileText className="h-4 w-4" />
                                        <span>Copy HTML</span>
                                      </button>
                                    )
                                  }
                                  if (text.includes('[View Chart]')) {
                                    return (
                                      <button 
                                        onClick={() => setShowChart(true)}
                                        className="inline-flex items-center space-x-1 bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:from-green-600 hover:to-blue-700 mr-2 shadow-lg"
                                      >
                                        <BarChart3 className="h-4 w-4" />
                                        <span>View Chart</span>
                                      </button>
                                    )
                                  }
                                  if (text.includes('[Download Data]')) {
                                    return (
                                      <button 
                                        onClick={() => downloadChartData()}
                                        className="inline-flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:from-orange-600 hover:to-orange-700 shadow-lg"
                                      >
                                        <Download className="h-4 w-4" />
                                        <span>Download</span>
                                      </button>
                                    )
                                  }
                                  return <strong className="text-green-400">{children}</strong>
                                },
                                code: ({children, className}) => {
                                  const isInline = !className
                                  if (isInline) {
                                    return (
                                      <code className="bg-gray-700 text-green-400 px-2 py-1 rounded text-sm font-mono">
                                        {children}
                                      </code>
                                    )
                                  }
                                  return (
                                    <div className="my-4 bg-gray-800 rounded-xl overflow-hidden border border-gray-600">
                                      <div className="bg-gray-700 px-4 py-3 text-sm text-gray-300 font-semibold border-b border-gray-600">
                                        HTML Code
                                      </div>
                                      <pre className="p-4 text-sm text-gray-100 overflow-x-auto max-h-64">
                                        <code className="font-mono whitespace-pre-wrap break-all">
                                          {children}
                                        </code>
                                      </pre>
                                    </div>
                                  )
                                },
                                pre: ({children}) => {
                                  return (
                                    <div className="my-4 bg-gray-800 rounded-xl overflow-hidden border border-gray-600">
                                      <div className="bg-gray-700 px-4 py-3 text-sm text-gray-300 font-semibold border-b border-gray-600">
                                        Generated Code
                                      </div>
                                      <pre className="p-4 text-sm text-gray-100 overflow-x-auto max-h-64">
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
                          <div className="text-xs opacity-70 mt-3">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-800 px-6 py-4 rounded-2xl max-w-[80%] border border-gray-700">
                          <div className="flex items-center space-x-4">
                            <div className="flex space-x-1">
                              <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
                              <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <div className="flex-1">
                              <div className="text-base text-gray-100 font-medium">{loadingMessage}</div>
                              {selectedAgent?.id === 'customer_experience' && (
                                <div className="text-sm text-gray-400 mt-1">Optimized for faster response</div>
                              )}
                            </div>
                            <button
                              onClick={cancelRequest}
                              className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors shadow-lg"
                              title="Cancel request"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* Input Area */}
                <div className="flex-shrink-0 p-6 border-t border-gray-700 bg-gray-800">
                  <div className="max-w-5xl mx-auto">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        placeholder="Ask for business insights and analytics..."
                        className="flex-1 px-6 py-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-lg"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={isLoading || !inputMessage.trim()}
                        className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg"
                      >
                        <Send className="h-5 w-5" />
                        <span className="font-semibold">Send</span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Admin AI Ready</span>
                      </div>
                      <div>Press Enter to send</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Landing Page Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl">
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Landing Page Preview</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(previewContent)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Copy HTML</span>
                  </button>
                  <button 
                    onClick={() => setShowPreview(false)}
                    className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 overflow-auto max-h-[70vh] bg-gray-900">
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <iframe
                  srcDoc={previewContent}
                  className="w-full h-96 border-0"
                  title="Landing Page Preview"
                />
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-3 text-white">HTML Source:</h4>
                <pre className="bg-gray-800 border border-gray-700 p-4 rounded-lg text-sm overflow-auto max-h-40">
                  <code className="text-gray-300">{previewContent}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Modal */}
      {showChart && chartData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-gray-700 shadow-2xl">
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">{chartData.title}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={downloadChartData}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Data</span>
                  </button>
                  <button 
                    onClick={() => setShowChart(false)}
                    className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gray-900">
              {chartData.type === 'line' ? (
                <div className="w-full h-80 bg-gray-800 rounded-lg flex items-center justify-center relative border border-gray-700">
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    {/* Grid lines */}
                    <defs>
                      <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* Line chart */}
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      points="40,160 100,150 160,130 220,110 280,90 340,70"
                    />
                    
                    {/* Data points */}
                    {chartData.data.datasets && chartData.data.datasets[0] && chartData.data.datasets[0].data.map((_: number, index: number) => (
                      <circle
                        key={index}
                        cx={40 + index * 60}
                        cy={160 - (index * 15)}
                        r="4"
                        fill="#10b981"
                      />
                    ))}
                  </svg>
                  
                  {/* Labels */}
                  <div className="absolute bottom-2 left-0 right-0 flex justify-around text-xs text-gray-400">
                    {chartData.data.labels && chartData.data.labels.map((label: string, index: number) => (
                      <span key={index}>{label}</span>
                    ))}
                  </div>
                </div>
              ) : chartData.type === 'cohort' ? (
                <div className="w-full bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="p-3 text-left font-semibold border-b border-gray-600 text-white">Subscription Cohorts</th>
                        {chartData.data.timeLabels.map((label: string) => (
                          <th key={label} className="p-3 text-center font-semibold border-b border-gray-600 text-xs text-gray-300">
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.data.cohorts.map((cohort: any, rowIndex: number) => (
                        <tr key={cohort.month} className="hover:bg-gray-700/50">
                          <td className="p-3 font-medium border-b border-gray-600 text-white">{cohort.month}</td>
                          {cohort.retention.map((percentage: number, colIndex: number) => {
                            const bgColor = percentage >= 90 ? '#1e40af' :
                                           percentage >= 80 ? '#3b82f6' :
                                           percentage >= 70 ? '#60a5fa' :
                                           percentage >= 60 ? '#93c5fd' :
                                           percentage >= 50 ? '#dbeafe' : '#374151'
                            const textColor = percentage >= 70 ? 'white' : '#d1d5db'
                            
                            return (
                              <td 
                                key={colIndex} 
                                className="p-3 text-center text-xs font-semibold border-b border-gray-600 cursor-pointer hover:scale-105 transition-transform"
                                style={{ 
                                  backgroundColor: bgColor,
                                  color: textColor
                                }}
                                title={`${cohort.month}: ${percentage}% retention at month ${colIndex}`}
                              >
                                {percentage}%
                              </td>
                            )
                          })}
                          {/* Fill empty cells for incomplete cohorts */}
                          {Array.from({ length: chartData.data.timeLabels.length - cohort.retention.length }).map((_, emptyIndex) => (
                            <td key={`empty-${emptyIndex}`} className="p-3 border-b border-gray-600 bg-gray-800"></td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="p-4 bg-gray-700 border-t border-gray-600">
                    <h4 className="font-semibold mb-2 text-sm text-white">Color Legend:</h4>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 rounded" style={{backgroundColor: '#1e40af'}}></div>
                        <span>90-100%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 rounded" style={{backgroundColor: '#3b82f6'}}></div>
                        <span>80-89%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 rounded" style={{backgroundColor: '#60a5fa'}}></div>
                        <span>70-79%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 rounded" style={{backgroundColor: '#93c5fd'}}></div>
                        <span>60-69%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 rounded" style={{backgroundColor: '#dbeafe'}}></div>
                        <span>50-59%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 rounded border border-gray-600" style={{backgroundColor: '#374151'}}></div>
                        <span>&lt;50%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-80 bg-gray-800 rounded-lg flex items-end justify-around p-4 space-x-2 border border-gray-700">
                  {chartData.data.datasets && chartData.data.datasets[0] && chartData.data.datasets[0].data.map((value: number, index: number) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div 
                        className="w-12 rounded-t"
                        style={{ 
                          height: `${(value / Math.max(...chartData.data.datasets[0].data)) * 200}px`,
                          backgroundColor: chartData.data.datasets[0].backgroundColor[index]
                        }}
                      />
                      <span className="text-xs text-gray-400 text-center">
                        {chartData.data.labels[index]}
                      </span>
                      <span className="text-xs font-semibold text-white">{value}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h4 className="font-semibold mb-2 text-white">Data Summary:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Total Data Points:</span>
                    <span className="ml-2 font-semibold text-white">
                      {chartData.type === 'cohort' 
                        ? chartData.data.cohorts?.length || 0
                        : chartData.data.labels?.length || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Chart Type:</span>
                    <span className="ml-2 font-semibold capitalize text-white">{chartData.type}</span>
                  </div>
                  {chartData.type === 'line' && (
                    <div className="col-span-2">
                      <span className="text-gray-400">Trend:</span>
                      <span className="ml-2 font-semibold text-green-400">📈 Increasing</span>
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