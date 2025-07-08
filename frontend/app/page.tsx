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
  Youtube
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

// Mock products with realistic supplement images
const products: Product[] = [
  {
    id: '1',
    name: 'Whey Protein Isolate',
    price: 49,
    originalPrice: 59,
    image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400',
    category: 'Protein',
    description: '25g high-quality protein per serving, fast absorption',
    rating: 4.8,
    reviews: 1247,
    bestseller: true
  },
  {
    id: '2',
    name: 'Creatine Monohydrate',
    price: 29,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    category: 'Performance',
    description: '5g pure creatine for strength and power',
    rating: 4.9,
    reviews: 892,
    bestseller: true
  },
  {
    id: '3',
    name: 'Pre-Workout Complex',
    price: 39,
    originalPrice: 45,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    category: 'Energy',
    description: 'Energy, focus, and pump formula',
    rating: 4.7,
    reviews: 634,
    new: true
  },
  {
    id: '4',
    name: 'BCAA Recovery',
    price: 35,
    image: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=400',
    category: 'Recovery',
    description: '2:1:1 ratio for muscle preservation',
    rating: 4.6,
    reviews: 478
  },
  {
    id: '5',
    name: 'Fat Burner Pro',
    price: 42,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    category: 'Weight Loss',
    description: 'Thermogenic fat burning formula',
    rating: 4.5,
    reviews: 356,
    new: true
  },
  {
    id: '6',
    name: 'Sleep Recovery',
    price: 38,
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400',
    category: 'Recovery',
    description: 'Melatonin and ZMA for better sleep',
    rating: 4.7,
    reviews: 267
  },
  {
    id: '7',
    name: 'Multivitamin Elite',
    price: 25,
    image: 'https://images.unsplash.com/photo-1550572017-7a24be3feb1e?w=400',
    category: 'Health',
    description: 'Athlete-formulated daily foundation',
    rating: 4.8,
    reviews: 543
  },
  {
    id: '8',
    name: 'Collagen Protein',
    price: 45,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    category: 'Recovery',
    description: 'Joint health and skin support',
    rating: 4.6,
    reviews: 423
  }
]

const categories = ['All', 'Protein', 'Performance', 'Energy', 'Recovery', 'Weight Loss', 'Health']

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
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-16 bg-white shadow-sm"></div>
          <div className="h-96 bg-gradient-to-br from-blue-600 to-green-600"></div>
          <div className="h-64 bg-white"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  NutraFuel
                </h1>
                <p className="text-xs text-gray-500">Fuel Your Potential</p>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ask AI: 'protein for muscle building' or search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  isListening ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'
                }`}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              {/* AI Search */}
              <button
                onClick={() => {setShowSearchModal(true); performIntelligentSearch(searchQuery || "general supplements")}}
                className="hidden md:flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>AI Search</span>
              </button>

              {/* Cart */}
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Admin Button */}
              <button
                onClick={() => window.open('/admin', '_blank')}
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </button>

              {/* Mobile Menu */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-2">
              <input
                type="text"
                placeholder="Search supplements..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={() => {setShowSearchModal(true); performIntelligentSearch(searchQuery || "general supplements")}}
                className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                🤖 AI Search
              </button>
              <button
                onClick={() => window.open('/admin', '_blank')}
                className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                ⚙️ Admin
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-green-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                Fuel Your
                <br />
                <span className="text-yellow-300">Potential</span>
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-lg">
                Premium sports nutrition powered by AI. Get personalized supplement recommendations 
                and achieve your performance goals faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {setShowSearchModal(true); performIntelligentSearch("supplement stack recommendations")}}
                  className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                >
                  <Search className="h-5 w-5" />
                  <span>Find My Stack</span>
                </button>
                <button
                  onClick={() => document.getElementById('products')?.scrollIntoView()}
                  className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Package className="h-5 w-5" />
                  <span>Shop Now</span>
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
                <Award className="h-24 w-24 mx-auto mb-4 text-yellow-300" />
                <h3 className="text-2xl font-bold mb-2">Performance Proven</h3>
                <p className="text-blue-100">Join 50,000+ athletes achieving their goals</p>
                <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                  <div>
                    <div className="text-2xl font-bold text-yellow-300">94%</div>
                    <div className="text-blue-200">Satisfaction Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-300">4.8★</div>
                    <div className="text-blue-200">Average Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistants Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Your AI-Powered Nutrition Team</h3>
            <p className="text-gray-600 text-lg">Expert guidance whenever you need it</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              onClick={() => {setShowSearchModal(true); performIntelligentSearch("smart product recommendations")}}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Smart Search</h4>
              <p className="text-gray-600 text-sm mb-3">Find the perfect supplement stack for your goals</p>
              <div className="text-blue-600 text-sm font-medium">Try: "Stack for muscle and fat loss" →</div>
            </div>

            <div 
              onClick={() => startAgentChat('customer_service', 'Customer Service')}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Customer Support</h4>
              <p className="text-gray-600 text-sm mb-3">Order tracking, returns, and support</p>
              <div className="text-green-600 text-sm font-medium">Order #1439221 status →</div>
            </div>

            <div 
              onClick={() => startAgentChat('rachel_nutrition', 'Rachel - Nutrition Coach')}
              className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Hey Rachel</h4>
              <p className="text-gray-600 text-sm mb-3">Nutrition and meal planning guidance</p>
              <div className="text-pink-600 text-sm font-medium">"What should I eat tonight?" →</div>
            </div>

            <div 
              onClick={() => startAgentChat('ramy_lifestyle', 'Ramy - Lifestyle Coach')}
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Hey Ramy</h4>
              <p className="text-gray-600 text-sm mb-3">Style and lifestyle advice</p>
              <div className="text-purple-600 text-sm font-medium">"What to wear this weekend?" →</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Premium Supplements</h3>
            <p className="text-gray-600 text-lg">Third-party tested, science-backed nutrition</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-blue-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
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
                      onClick={() => addToCart(product)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">NutraFuel</h3>
                  <p className="text-sm text-gray-400">Fuel Your Potential</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Premium sports nutrition powered by AI technology. 
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
              <h4 className="font-semibold mb-4">Products</h4>
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
              <h4 className="font-semibold mb-4">Support</h4>
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
              <h4 className="font-semibold mb-4">Contact Info</h4>
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
                    className="px-3 py-2 bg-gray-800 text-white rounded-l-lg flex-1 focus:outline-none"
                  />
                  <button className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700">
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
                        <p className="text-blue-600 font-semibold">${item.price}</p>
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
                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
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