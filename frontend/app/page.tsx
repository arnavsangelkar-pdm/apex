'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
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
  Activity
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
}

interface CartItem extends Product {
  quantity: number
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Premium fitness supplement products - APEX Branded Black Bottles
const products: Product[] = [
  {
    id: '1',
    name: 'Elite Whey Isolate',
    price: 69,
    originalPrice: 79,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500',
    category: 'Protein',
    description: '25g ultra-pure whey protein isolate, zero sugar, rapid absorption',
    rating: 4.9,
    reviews: 2847,
    bestseller: true
  },
  {
    id: '2',
    name: 'Ignite Pre-Workout',
    price: 49,
    originalPrice: 59,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500',
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
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500',
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
    image: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500',
    category: 'Recovery',
    description: '2:1:1 BCAA ratio + electrolytes for optimal recovery',
    rating: 4.7,
    reviews: 978
  },
  {
    id: '5',
    name: 'Burn Elite',
    price: 59,
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500',
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
    image: 'https://images.unsplash.com/photo-1550572017-7a24be3feb1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500',
    category: 'Recovery',
    description: 'Deep sleep support, muscle recovery, growth hormone optimization',
    rating: 4.8,
    reviews: 567
  },
  {
    id: '7',
    name: 'Peak Multivitamin',
    price: 35,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500',
    category: 'Health',
    description: 'Elite athlete formulation, bioavailable nutrients',
    rating: 4.7,
    reviews: 1243
  },
  {
    id: '8',
    name: 'Collagen Matrix',
    price: 52,
    image: 'https://images.unsplash.com/photo-1556228578-dd2fa3d03b24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500',
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
                <p className="text-xs text-green-400">next generation nutrition</p>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ask AI: 'best pre-workout for energy' or search products..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      setShowSearchModal(true)
                      performIntelligentSearch(searchQuery)
                    }
                  }}
                />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Voice Search */}
              <button
                onClick={toggleVoice}
                className={`p-2 rounded-full transition-colors ${
                  isListening ? 'bg-red-900 text-red-400' : 'text-gray-400 hover:text-green-400 hover:bg-gray-800'
                }`}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              {/* AI Search */}
              <button
                onClick={() => {setShowSearchModal(true); performIntelligentSearch(searchQuery || "elite supplements")}}
                className="hidden md:flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-green-400 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Chat with Nutritionist Rachel</span>
              </button>

              {/* Cart */}
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 text-gray-400 hover:text-green-400 hover:bg-gray-800 rounded-full transition-colors"
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
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-green-400 text-black rounded-full hover:bg-green-300 transition-colors font-semibold"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </button>

              {/* Mobile Menu */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-gray-400 hover:text-green-400 hover:bg-gray-800 rounded-full"
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
                placeholder="Search elite supplements..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={() => {setShowSearchModal(true); performIntelligentSearch(searchQuery || "elite supplements")}}
                className="w-full text-left px-3 py-2 text-gray-400 hover:text-green-400 hover:bg-gray-800 rounded-lg"
              >
                🤖 Ask Apex
              </button>
              <button
                onClick={() => window.open('/admin', '_blank')}
                className="w-full text-left px-3 py-2 text-gray-400 hover:text-green-400 hover:bg-gray-800 rounded-lg"
              >
                ⚙️ Admin
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-black text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Flame className="h-6 w-6 text-green-400" />
                  <span className="text-green-400 font-semibold tracking-wide">ELITE PERFORMANCE</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Reach Your
                  <span className="block text-green-400">APEX</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Next Generation Fitness supplements engineered for elite athletes and serious performers. 
                  Unleash your potential with our scientifically-backed formulations.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-green-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-green-300 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Shop Best Sellers</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {setShowSearchModal(true); performIntelligentSearch("best supplements for athletic performance")}}
                  className="border-2 border-green-400 text-green-400 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-400 hover:text-black transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Let Apex Build Your Stack</span>
                </button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span>Lab Tested</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-400" />
                  <span>Pro Approved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-green-400" />
                  <span>Elite Grade</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-transparent rounded-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=600&fit=crop"
                alt="Elite Athlete Training"
                className="w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-2">Why Elite Athletes Choose APEX</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-green-400">
                    <div className="font-bold">99.9%</div>
                    <div className="text-gray-300">Purity Rating</div>
                  </div>
                                     <div className="text-green-400">
                     <div className="font-bold">Custom</div>
                     <div className="text-gray-300">Stacks</div>
                   </div>
                  <div className="text-green-400">
                    <div className="font-bold">Pro</div>
                    <div className="text-gray-300">Formulations</div>
                  </div>
                  <div className="text-green-400">
                    <div className="font-bold">Elite</div>
                    <div className="text-gray-300">Performance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600">Find the perfect supplements for your goals</p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6">
            {/* Proteins */}
            <div className="text-center group cursor-pointer">
              <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-black rounded-xl mb-4 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300&h=300&fit=crop"
                  alt="Protein Supplements"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Proteins</h3>
              <p className="text-gray-600 text-sm">Build lean muscle mass</p>
            </div>

            {/* Pre-workouts */}
            <div className="text-center group cursor-pointer">
              <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-black rounded-xl mb-4 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop"
                  alt="Pre-workout Supplements"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Pre-workouts</h3>
              <p className="text-gray-600 text-sm">Explosive energy & focus</p>
            </div>

            {/* Recovery */}
            <div className="text-center group cursor-pointer">
              <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-black rounded-xl mb-4 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=300&h=300&fit=crop"
                  alt="Recovery Supplements"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Recovery</h3>
              <p className="text-gray-600 text-sm">Faster muscle repair</p>
            </div>

            {/* Collagen Support */}
            <div className="text-center group cursor-pointer">
              <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-black rounded-xl mb-4 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1556228578-dd2fa3d03b24?ixlib=rb-4.0.3&w=300&h=300&fit=crop"
                  alt="Collagen Support"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Collagen Support</h3>
              <p className="text-gray-600 text-sm">Joint & skin health</p>
            </div>

            {/* Essential Vitamins & Minerals */}
            <div className="text-center group cursor-pointer">
              <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-black rounded-xl mb-4 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop"
                  alt="Vitamins & Minerals"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Essential Vitamins & Minerals</h3>
              <p className="text-gray-600 text-sm">Complete daily foundation</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Cutting Edge Nutrition Intelligence</h2>
            <p className="text-xl text-gray-400">Get personalized nutrition and supplement stacks- just ask us!</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Intelligent Search */}
            <div className="bg-black p-6 rounded-xl border border-gray-800 hover:border-green-400/50 transition-colors">
              <div className="w-12 h-12 bg-green-400/10 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Search</h3>
              <p className="text-gray-400 text-sm mb-4">Curated product recommendations based on your goals</p>
              <button
                onClick={() => {setShowSearchModal(true); performIntelligentSearch("best supplements for my fitness goals")}}
                className="w-full bg-green-400/10 text-green-400 py-2 rounded-lg hover:bg-green-400/20 transition-colors"
              >
                Ask AI
              </button>
            </div>

            {/* Customer Service */}
            <div className="bg-black p-6 rounded-xl border border-gray-800 hover:border-green-400/50 transition-colors">
              <div className="w-12 h-12 bg-green-400/10 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">24/7 Support</h3>
              <p className="text-gray-400 text-sm mb-4">Instant answers to your questions about orders and products</p>
              <button
                onClick={() => startAgentChat('customer_service', '24/7 Support')}
                className="w-full bg-green-400/10 text-green-400 py-2 rounded-lg hover:bg-green-400/20 transition-colors"
              >
                Get Help
              </button>
            </div>

            {/* Rachel Nutrition */}
            <div className="bg-black p-6 rounded-xl border border-gray-800 hover:border-green-400/50 transition-colors">
              <div className="w-12 h-12 bg-green-400/10 rounded-lg flex items-center justify-center mb-4">
                <ChefHat className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Meet Rachel - Nutrition Expert</h3>
              <p className="text-gray-400 text-sm mb-4">Personalized nutrition guidance for peak performance</p>
              <button
                onClick={() => startAgentChat('rachel_nutrition', 'Rachel - Nutrition Expert')}
                className="w-full bg-green-400/10 text-green-400 py-2 rounded-lg hover:bg-green-400/20 transition-colors"
              >
                Get Advice
              </button>
            </div>

            {/* Ramy Lifestyle */}
            <div className="bg-black p-6 rounded-xl border border-gray-800 hover:border-green-400/50 transition-colors">
              <div className="w-12 h-12 bg-green-400/10 rounded-lg flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Ramy - Lifestyle Coach</h3>
              <p className="text-gray-400 text-sm mb-4">Holistic fitness and lifestyle optimization strategies</p>
              <button
                onClick={() => startAgentChat('ramy_lifestyle', 'Ramy - Lifestyle Coach')}
                className="w-full bg-green-400/10 text-green-400 py-2 rounded-lg hover:bg-green-400/20 transition-colors"
              >
                Start Coaching
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Elite Performance Supplements</h2>
            <p className="text-xl text-gray-600">Scientifically formulated for serious athletes</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {product.bestseller && (
                    <span className="absolute top-2 left-2 bg-green-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                      BESTSELLER
                    </span>
                  )}
                  {product.new && (
                    <span className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded-full text-xs font-bold">
                      NEW
                    </span>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-green-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors flex items-center space-x-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Why Elite Athletes Choose APEX</h3>
            <p className="text-xl text-gray-400">Uncompromising quality for peak performance</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-400" />
              </div>
              <h4 className="font-semibold mb-2 text-white">Lab Tested</h4>
              <p className="text-gray-400 text-sm">Independently verified for elite purity standards</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-400" />
              </div>
              <h4 className="font-semibold mb-2 text-white">AI-Powered</h4>
              <p className="text-gray-400 text-sm">Next-gen personalization for your goals</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-400" />
              </div>
              <h4 className="font-semibold mb-2 text-white">Elite Delivery</h4>
              <p className="text-gray-400 text-sm">Free expedited shipping on orders over $99</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-400" />
              </div>
              <h4 className="font-semibold mb-2 text-white">Performance Guarantee</h4>
              <p className="text-gray-400 text-sm">Elite-level results or your money back</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center border border-green-400">
                  <Dumbbell className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">APEX</h3>
                  <p className="text-sm text-green-400">next generation nutrition</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Elite performance supplements engineered for serious athletes. 
                Trusted by 100,000+ elite performers worldwide.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
                <Twitter className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
                <Youtube className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Elite Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Elite Protein</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Ignite Pre-Workout</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Creatine HCL Pro</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Recovery Stack</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Burn Elite</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Peak Vitamins</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Elite Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Elite Support</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">AI Assistant</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Performance Guide</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact APEX</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>1-800-APEX-PRO</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>elite@apex-fitness.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Los Angeles, CA 90210</span>
                </div>
              </div>
              <div className="mt-6">
                <h5 className="font-semibold mb-2">Elite Updates</h5>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Enter email"
                    className="px-3 py-2 bg-gray-800 text-white rounded-l-lg flex-1 focus:outline-none border border-gray-700"
                  />
                  <button className="bg-green-400 text-black px-4 py-2 rounded-r-lg hover:bg-green-300 transition-colors">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 APEX Fitness. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Shopping Cart ({cartItemCount})</h3>
                <button onClick={() => setShowCart(false)}>
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
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-green-600 font-semibold">${item.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total: ${cartTotal.toFixed(2)}</span>
                    </div>
                    <button className="w-full bg-green-400 text-black py-3 rounded-lg hover:bg-green-300 transition-colors font-semibold">
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
                  <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                    <Search className="h-5 w-5 text-black" />
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">AI Assistant</h3>
                <button onClick={() => setShowAgent(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="h-96 overflow-y-auto p-6">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <ReactMarkdown className="text-sm">{message.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
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
            
            <div className="p-6 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 