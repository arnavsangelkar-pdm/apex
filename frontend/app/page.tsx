'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import { 
  Dumbbell, 
  Search,
  Send,
  Mic,
  MicOff,
  MessageCircle,
  X,
  Star,
  ShoppingCart,
  User,
  Menu,
  Settings,
  Package,
  Truck,
  Shield,
  Award,
  Zap,
  Target,
  Heart,
  Eye,
  Plus,
  Minus,
  ChefHat,
  ShoppingBag,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Flame,
  Activity,
  Filter,
  Sparkles,
  TrendingUp,
  Brain,
  UserCheck,
  FileText,
  BarChart3,
  Users,
  Globe,
  Headphones,
  Clock,
  CheckCircle
} from 'lucide-react'

// Configure axios
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Types
interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  description: string
  rating: number
  reviews: number
  bestseller?: boolean
  new?: boolean
  link?: string
}

interface CartItem extends Product {
  quantity: number
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Premium fitness supplement products
const products: Product[] = [
  {
    id: '1',
    name: 'Elite Whey Isolate',
    price: 69,
    originalPrice: 79,
    image: '/images/elite-whey-isolate.png',
    category: 'Protein',
    description: '25g ultra-pure whey protein isolate, zero sugar, rapid absorption',
    rating: 4.9,
    reviews: 2847,
    bestseller: true,
    link: '/products/whey-protein'
  },
  {
    id: '2',
    name: 'Ignite Pre-Workout',
    price: 49,
    originalPrice: 59,
    image: '/images/ignite-pre-workout.png',
    category: 'Pre-Workout',
    description: 'Clean energy, laser focus, explosive pumps. No crash.',
    rating: 4.8,
    reviews: 1892,
    bestseller: true
  },
  {
    id: '3',
    name: 'Creatine HCL Pro',
    price: 39,
    image: '/images/creatine-hcl-pro.png',
    category: 'Performance',
    description: 'Superior absorption, strength gains, no bloating',
    rating: 4.9,
    reviews: 1634,
    new: true
  },
  {
    id: '4',
    name: 'Recovery BCAA+',
    price: 42,
    image: '/images/recovery-bcaa-pro.png',
    category: 'Recovery',
    description: '2:1:1 BCAA ratio + electrolytes for optimal recovery',
    rating: 4.7,
    reviews: 978
  },
  {
    id: '5',
    name: 'Burn Elite',
    price: 59,
    image: '/images/burn-elite.png',
    category: 'Fat Loss',
    description: 'Advanced thermogenic formula, appetite control, energy boost',
    rating: 4.6,
    reviews: 756,
    new: true
  },
  {
    id: '6',
    name: 'Night Recovery Pro',
    price: 45,
    image: '/images/night-recovery-pro.png',
    category: 'Recovery',
    description: 'Deep sleep support, muscle recovery, growth hormone optimization',
    rating: 4.8,
    reviews: 567
  },
  {
    id: '7',
    name: 'Peak Multivitamin',
    price: 35,
    image: '/images/peak-multivitamin.png',
    category: 'Health',
    description: 'Elite athlete formulation, bioavailable nutrients',
    rating: 4.7,
    reviews: 1243
  },
  {
    id: '8',
    name: 'Collagen Matrix',
    price: 52,
    image: '/images/collagen-matrix.png',
    category: 'Recovery',
    description: 'Type I, II, III collagen for joints, skin, and recovery',
    rating: 4.6,
    reviews: 823
  }
]

const categories = ['All', 'Protein', 'Pre-Workout', 'Performance', 'Recovery', 'Fat Loss', 'Health']

export default function Home() {
  // Hydration fix - prevent SSR/client mismatch
  const [mounted, setMounted] = useState(false)
  
  // State management
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showAgent, setShowAgent] = useState(false)
  const [activeAgent, setActiveAgent] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Set mounted to true after hydration
  useEffect(() => {
    setMounted(true)
    // Check for voice support
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      setVoiceSupported(true)
    }
  }, [])

  // Filtered products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Cart functions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCart(prev => prev.filter(item => item.id !== id))
    } else {
      setCart(prev => prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      ))
    }
  }

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  // Agent functions
  const startAgentChat = (agentId: string, agentName: string) => {
    setActiveAgent(agentId)
    setShowAgent(true)
    setMessages([{
      role: 'assistant',
      content: `Hi! I'm ${agentName}. How can I help you today?`,
      timestamp: new Date()
    }])
  }

  // New search function for intelligent search
  const performIntelligentSearch = async (query: string) => {
    setIsSearching(true)
    try {
      const response = await axios.post('/query/frontend', {
        query: query,
        agent: 'intelligent_search',
        k: 5
      })

      // Parse the response to extract product recommendations
      const aiResponse = response.data.response
      
      // Create mock search results based on AI response
      const results = [
        {
          type: 'ai_recommendation',
          title: 'AI Recommendation',
          description: aiResponse,
          relevance: 100
        },
        ...filteredProducts.slice(0, 4).map(product => ({
          type: 'product',
          ...product,
          relevance: Math.floor(Math.random() * 30) + 70
        }))
      ]

      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([{
        type: 'error',
        title: 'Search Error',
        description: 'Sorry, we encountered an error. Please try again.',
        relevance: 0
      }])
    } finally {
      setIsSearching(false)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await axios.post('/query/frontend', {
        query: inputMessage,
        agent: activeAgent,
        k: 3
      })

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response || 'Sorry, I encountered an issue.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleVoice = () => {
    if (!voiceSupported) {
      alert('Voice recognition is not supported in your browser')
      return
    }

    if (isListening) {
      setIsListening(false)
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setSearchQuery(transcript)
      setShowSearchModal(true)
      performIntelligentSearch(transcript)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Don't render until mounted to prevent hydration errors
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-900"></div>
          <div className="h-96 bg-gray-800"></div>
          <div className="h-64 bg-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black shadow-lg sticky top-0 z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center border border-green-400">
                <Dumbbell className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  APEX
                </h1>
                <p className="text-xs text-green-400 font-medium">Next Generation Fitness</p>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ask AI: 'best stack for muscle gain' or search products..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      setShowSearchModal(true)
                      performIntelligentSearch(searchQuery)
                    }
                  }}
                />
                {voiceSupported && (
                  <button
                    onClick={toggleVoice}
                    className={`absolute right-3 top-2 p-1 rounded-full ${
                      isListening ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-green-400'
                    }`}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Voice Search */}
              <button
                onClick={toggleVoice}
                className={`p-2 rounded-full transition-colors ${
                  isListening ? 'bg-red-900 text-red-400' : 'hover:bg-gray-800 text-gray-400 hover:text-green-400'
                }`}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              {/* AI Search */}
              <button
                onClick={() => {setShowSearchModal(true); performIntelligentSearch(searchQuery || "general supplements")}}
                className="hidden md:flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-green-400 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>AI Search</span>
              </button>

              {/* Cart */}
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-green-400"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-400 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Admin Button */}
              <button
                onClick={() => window.open('/admin', '_blank')}
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-green-400 text-black rounded-full hover:bg-green-300 transition-colors font-bold"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </button>

              {/* Mobile Menu */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-green-400"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-800 bg-black">
            <div className="px-4 py-2 space-y-2">
              <input
                type="text"
                placeholder="Search supplements..."
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={() => {setShowSearchModal(true); performIntelligentSearch(searchQuery || "general supplements")}}
                className="w-full text-left px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-green-400 rounded-lg"
              >
                🤖 AI Search
              </button>
              <button
                onClick={() => window.open('/admin', '_blank')}
                className="w-full text-left px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-green-400 rounded-lg"
              >
                ⚙️ Admin
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop&crop=center" 
            alt="Athletes training"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-green-400 text-black px-4 py-2 rounded-full font-bold text-sm">
                  <Flame className="h-4 w-4" />
                  <span>AI-POWERED NUTRITION</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Next Generation
                  <span className="block text-green-400">Fitness</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Scientifically formulated supplements powered by AI recommendations. 
                  Unlock your genetic potential with precision nutrition.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {setShowSearchModal(true); performIntelligentSearch("muscle building stack recommendations")}}
                  className="bg-green-400 text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-green-300 transition-colors flex items-center justify-center space-x-2 group"
                >
                  <Zap className="h-5 w-5" />
                  <span>Shop Best Sellers</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => startAgentChat('rachel_nutrition', 'Rachel - Nutrition Expert')}
                  className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-black transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Let Apex build your stack</span>
                </button>
              </div>

              <div className="flex items-center space-x-8 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Lab Tested</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Custom Stacks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Performance Proven</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1549476464-37392f717541?w=800&h=600&fit=crop&crop=center" 
                  alt="Athlete with supplements"
                  className="w-full h-96 object-cover"
                />
                {/* Opaque black overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                
                {/* Value propositions overlay */}
                <div className="absolute inset-0 flex flex-col justify-center p-8 text-center">
                  <div className="space-y-6">
                    <div className="flex items-center justify-center space-x-3 mb-6">
                      <Award className="h-8 w-8 text-green-400" />
                      <h3 className="text-2xl font-bold text-white">Performance Proven</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 space-y-3">
                      <div className="flex items-center justify-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                        <span className="text-white font-semibold">Third-Party Lab Tested</span>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-3">
                        <Brain className="h-6 w-6 text-green-400 flex-shrink-0" />
                        <span className="text-white font-semibold">AI-Powered Recommendations</span>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-3">
                        <TrendingUp className="h-6 w-6 text-green-400 flex-shrink-0" />
                        <span className="text-white font-semibold">Clinically Dosed Formulas</span>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-3">
                        <Users className="h-6 w-6 text-green-400 flex-shrink-0" />
                        <span className="text-white font-semibold">50,000+ Satisfied Athletes</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-600">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400">94%</div>
                        <div className="text-gray-300 text-sm">Satisfaction Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400">4.8★</div>
                        <div className="text-gray-300 text-sm">Average Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Shop by Category</h2>
            <p className="text-gray-700 text-lg">Find the perfect supplements for your goals</p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-12">
            <div className="text-center group cursor-pointer">
              <div className="transition-all duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop&crop=center" 
                  alt="Proteins"
                  className="w-56 h-56 mx-auto object-cover rounded-3xl mb-6 group-hover:scale-105 transition-all duration-300"
                />
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 mb-2 transition-colors">Proteins</h3>
                <p className="text-gray-600 text-lg">Build lean muscle mass</p>
              </div>
            </div>
            
            <div className="text-center group cursor-pointer">
              <div className="transition-all duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop&crop=center" 
                  alt="Pre-workouts"
                  className="w-56 h-56 mx-auto object-cover rounded-3xl mb-6 group-hover:scale-105 transition-all duration-300"
                />
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 mb-2 transition-colors">Pre-workouts</h3>
                <p className="text-gray-600 text-lg">Fuel your training</p>
              </div>
            </div>
            
            <div className="text-center group cursor-pointer">
              <div className="transition-all duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=800&fit=crop&crop=center" 
                  alt="Recovery"
                  className="w-56 h-56 mx-auto object-cover rounded-3xl mb-6 group-hover:scale-105 transition-all duration-300"
                />
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 mb-2 transition-colors">Recovery</h3>
                <p className="text-gray-600 text-lg">Optimize muscle repair</p>
              </div>
            </div>
            
            <div className="text-center group cursor-pointer">
              <div className="transition-all duration-300">
                <img 
                  src="/images/collagen-support.png" 
                  alt="Collagen support"
                  className="w-56 h-56 mx-auto object-cover rounded-3xl mb-6 group-hover:scale-105 transition-all duration-300"
                />
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 mb-2 transition-colors">Collagen Support</h3>
                <p className="text-gray-600 text-lg">Joint & skin health</p>
              </div>
            </div>
            
            <div className="text-center group cursor-pointer">
              <div className="transition-all duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&h=800&fit=crop&crop=center" 
                  alt="Essential Vitamins & Minerals"
                  className="w-56 h-56 mx-auto object-cover rounded-3xl mb-6 group-hover:scale-105 transition-all duration-300"
                />
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-teal-600 mb-2 transition-colors">Essential Vitamins & Minerals</h3>
                <p className="text-gray-600 text-lg">Complete nutrition foundation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistants Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-black mb-4">Cutting edge nutrition intelligence</h3>
            <p className="text-gray-700 text-lg">Get personalized nutrition and supplement stacks- just ask us!</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              onClick={() => {setShowSearchModal(true); performIntelligentSearch("smart product recommendations")}}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-green-400 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4 group-hover:bg-green-400 transition-colors">
                <Search className="h-6 w-6 text-white group-hover:text-black" />
              </div>
              <h4 className="text-lg font-bold mb-2 text-black">Smart Search</h4>
              <p className="text-gray-700 text-sm mb-3">Curated product recommendations based on your goals</p>
              <div className="text-green-400 text-sm font-bold">Try: "Stack for muscle and fat loss" →</div>
            </div>

            <div 
              onClick={() => startAgentChat('customer_service', 'Customer Service')}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-green-400 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4 group-hover:bg-green-400 transition-colors">
                <MessageCircle className="h-6 w-6 text-white group-hover:text-black" />
              </div>
              <h4 className="text-lg font-bold mb-2 text-black">Customer Support</h4>
              <p className="text-gray-700 text-sm mb-3">Order tracking, returns, and support</p>
              <div className="text-green-400 text-sm font-bold">Order #1439221 status →</div>
            </div>

            <div 
              onClick={() => startAgentChat('rachel_nutrition', 'Rachel - Nutrition Expert')}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-green-400 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4 group-hover:bg-green-400 transition-colors">
                <Target className="h-6 w-6 text-white group-hover:text-black" />
              </div>
              <h4 className="text-lg font-bold mb-2 text-black">Meet Rachel - nutrition expert</h4>
              <p className="text-gray-700 text-sm mb-3">Nutrition and supplement guidance</p>
              <div className="text-green-400 text-sm font-bold">"What should I eat for muscle gain?" →</div>
            </div>

            <div 
              onClick={() => startAgentChat('ramy_lifestyle', 'Ramy - Lifestyle Coach')}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-green-400 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4 group-hover:bg-green-400 transition-colors">
                <Activity className="h-6 w-6 text-white group-hover:text-black" />
              </div>
              <h4 className="text-lg font-bold mb-2 text-black">Hey Ramy</h4>
              <p className="text-gray-700 text-sm mb-3">Training and lifestyle optimization</p>
              <div className="text-green-400 text-sm font-bold">"Best workout split for me?" →</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-black mb-4">Elite Performance Supplements</h3>
            <p className="text-gray-700 text-lg">Third-party tested, science-backed nutrition</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-400 text-black'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const ProductCard = (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.bestseller && (
                      <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                        Bestseller
                      </span>
                    )}
                    {product.new && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-1">{product.category}</div>
                    <h4 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">{product.name}</h4>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">({product.reviews})</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-blue-600">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-1"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );

              return product.link ? (
                <Link key={product.id} href={product.link} className="block">
                  {ProductCard}
                </Link>
              ) : (
                ProductCard
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Why Athletes Trust NutraFuel</h3>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Third-Party Tested</h4>
              <p className="text-gray-600 text-sm">Independently verified for purity and potency</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">AI-Powered</h4>
              <p className="text-gray-600 text-sm">Personalized recommendations for your goals</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold mb-2">Free Shipping</h4>
              <p className="text-gray-600 text-sm">Free delivery on orders over $75</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">30-Day Guarantee</h4>
              <p className="text-gray-600 text-sm">Money-back guarantee on all products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center border border-green-400">
                  <Dumbbell className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">APEX</h3>
                  <p className="text-sm text-green-400 font-medium">Next Generation Fitness</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Elite performance supplements powered by AI technology. 
                Trusted by 50,000+ athletes worldwide.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Youtube className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-white">Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Protein Supplements</a></li>
                <li><a href="#" className="hover:text-white">Pre-Workout</a></li>
                <li><a href="#" className="hover:text-white">Creatine</a></li>
                <li><a href="#" className="hover:text-white">Recovery</a></li>
                <li><a href="#" className="hover:text-white">Fat Burners</a></li>
                <li><a href="#" className="hover:text-white">Vitamins</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Track Order</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">AI Assistant</a></li>
                <li><a href="#" className="hover:text-white">Nutrition Guide</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-white">Contact Info</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>1-800-NUTRAFUEL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>support@nutrafuel.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Austin, TX 78701</span>
                </div>
              </div>
              <div className="mt-6">
                <h5 className="font-semibold mb-2">Subscribe to Updates</h5>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Enter email"
                    className="px-3 py-2 bg-gray-800 text-white rounded-l-lg flex-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <button className="bg-green-400 text-black px-4 py-2 rounded-r-lg hover:bg-green-300 font-bold transition-colors">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 NutraFuel. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-black">Shopping Cart ({cartItemCount})</h3>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-green-400 transition-colors">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-black">{item.name}</h4>
                        <p className="text-black font-bold">${item.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-lg text-black">Total: ${cartTotal.toFixed(2)}</span>
                    </div>
                    <button className="w-full bg-green-400 text-black py-3 rounded-lg font-bold hover:bg-green-300 transition-colors">
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Search className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">AI-Powered Search</h3>
                    <p className="text-gray-600 text-sm">Smart recommendations for "{searchQuery}"</p>
                  </div>
                </div>
                <button onClick={() => setShowSearchModal(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {searchResults.map((result, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      {result.type === 'ai_recommendation' && (
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <Zap className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Recommendation</h3>
                              <div className="text-gray-700 leading-relaxed">
                                {result.description}
                              </div>
                              <div className="mt-4 flex items-center text-sm text-blue-600">
                                <Target className="h-4 w-4 mr-1" />
                                <span>Personalized for your goals</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {result.type === 'product' && (
                        <div className="p-6">
                          <div className="flex items-start space-x-4">
                            <img 
                              src={result.image} 
                              alt={result.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">{result.name}</h3>
                                  <p className="text-sm text-gray-500 mb-2">{result.category}</p>
                                  <p className="text-gray-700 text-sm mb-3">{result.description}</p>
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center">
                                      {[...Array(5)].map((_, i) => (
                                        <Star 
                                          key={i} 
                                          className={`h-4 w-4 ${i < Math.floor(result.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-500">({result.reviews})</span>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-auto">
                                      {result.relevance}% match
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-bold text-blue-600">${result.price}</div>
                                  {result.originalPrice && (
                                    <div className="text-sm text-gray-500 line-through">${result.originalPrice}</div>
                                  )}
                                  <button
                                    onClick={() => addToCart(result)}
                                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                  >
                                    Add to Cart
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {result.type === 'error' && (
                        <div className="p-6 text-center">
                          <div className="text-red-600 mb-2">⚠️ {result.title}</div>
                          <p className="text-gray-600">{result.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {searchResults.length === 0 && !isSearching && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <Search className="h-12 w-12 mx-auto" />
                      </div>
                      <p className="text-gray-600">No results found. Try a different search term.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t bg-gray-50">
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Ask AI anything about supplements..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && performIntelligentSearch(searchQuery)}
                />
                <button
                  onClick={() => performIntelligentSearch(searchQuery)}
                  disabled={isSearching}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Search className="h-4 w-4" />
                </button>
                {voiceSupported && (
                  <button
                    onClick={toggleVoice}
                    className={`p-2 rounded-lg transition-colors ${
                      isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Agent Modal */}
      {showAgent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-700">
            {/* Header */}
            <div className="p-8 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">AI Assistant</h3>
                    <p className="text-gray-400">Powered by advanced AI technology</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAgent(false)}
                  className="p-3 hover:bg-gray-700 rounded-xl transition-colors text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {/* Messages Area */}
            <div className="h-[600px] overflow-y-auto p-8 bg-gray-900 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-2xl px-6 py-4 rounded-2xl ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-br from-green-500 to-blue-600 text-white shadow-lg' 
                        : 'bg-gray-800 text-gray-100 border border-gray-700 shadow-lg'
                    }`}>
                      <ReactMarkdown className="text-base leading-relaxed prose prose-invert max-w-none">
                        {message.content}
                      </ReactMarkdown>
                      <div className="text-xs mt-2 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 px-6 py-4 rounded-2xl border border-gray-700">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-gray-400 text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Input Area */}
            <div className="p-8 border-t border-gray-700 bg-gray-800">
              <div className="max-w-4xl mx-auto">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Ask me anything about supplements, nutrition, or fitness..."
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
                    <span>AI Ready</span>
                  </div>
                  <div>Press Enter to send</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 