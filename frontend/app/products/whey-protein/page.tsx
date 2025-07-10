'use client'

import React, { useState, useEffect } from 'react'
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Check, 
  Zap, 
  Award, 
  Shield, 
  Truck, 
  RotateCcw, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Filter,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface Review {
  id: string
  name: string
  rating: number
  date: string
  title: string
  content: string
  verified: boolean
  helpful: number
  flavor: string
  bodyType: string
  goal: string
}

const productImages = [
  '/images/elite-whey-isolate.png',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=800&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&h=800&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?w=800&h=800&fit=crop&crop=center'
]

const flavors = [
  { name: 'Vanilla Ice Cream', price: 69, available: true },
  { name: 'Chocolate Fudge', price: 69, available: true },
  { name: 'Strawberry Cream', price: 69, available: true },
  { name: 'Cookies & Cream', price: 72, available: true },
  { name: 'Salted Caramel', price: 72, available: true },
  { name: 'Unflavored', price: 65, available: true }
]

const reviews: Review[] = [
  {
    id: '1',
    name: 'Marcus Johnson',
    rating: 5,
    date: '2024-01-15',
    title: 'Best whey protein I\'ve ever used',
    content: 'This protein mixes incredibly well with no clumps. The vanilla flavor is spot-on and not overly sweet. I\'ve seen noticeable muscle gains since switching to APEX. The 25g of protein per serving is perfect for my post-workout needs.',
    verified: true,
    helpful: 24,
    flavor: 'Vanilla Ice Cream',
    bodyType: 'Mesomorph',
    goal: 'Muscle Building'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    rating: 5,
    date: '2024-01-12',
    title: 'Perfect for my fitness goals',
    content: 'As a competitive athlete, I need high-quality protein that digests easily. APEX Elite Whey delivers exactly that. Zero sugar, fast absorption, and it tastes amazing. I\'ve been using it for 3 months and my recovery has improved significantly.',
    verified: true,
    helpful: 18,
    flavor: 'Chocolate Fudge',
    bodyType: 'Ectomorph',
    goal: 'Performance'
  },
  {
    id: '3',
    name: 'David Rodriguez',
    rating: 4,
    date: '2024-01-10',
    title: 'Great quality, fast results',
    content: 'Excellent protein powder. The chocolate flavor is rich and satisfying. I\'ve noticed faster recovery times and better muscle definition since starting. Only downside is the price point, but the quality justifies it.',
    verified: true,
    helpful: 15,
    flavor: 'Chocolate Fudge',
    bodyType: 'Endomorph',
    goal: 'Fat Loss'
  },
  {
    id: '4',
    name: 'Jennifer Kim',
    rating: 5,
    date: '2024-01-08',
    title: 'Clean ingredients, amazing taste',
    content: 'I love that this protein is so clean - no artificial fillers or unnecessary additives. The cookies & cream flavor is incredible, tastes like a milkshake. Perfect for my morning smoothies and post-workout shakes.',
    verified: true,
    helpful: 22,
    flavor: 'Cookies & Cream',
    bodyType: 'Mesomorph',
    goal: 'Lean Muscle'
  },
  {
    id: '5',
    name: 'Ryan Thompson',
    rating: 5,
    date: '2024-01-05',
    title: 'Exceptional quality and purity',
    content: 'Third-party tested and it shows. This is the cleanest protein I\'ve used. Mixes perfectly, tastes great, and my stomach tolerates it well. I\'ve tried many brands and APEX is by far the best.',
    verified: true,
    helpful: 19,
    flavor: 'Unflavored',
    bodyType: 'Ectomorph',
    goal: 'Muscle Building'
  }
]

const nutritionalInfo = [
  { label: 'Protein', value: '25g', percentage: '50%' },
  { label: 'Calories', value: '110', percentage: '5%' },
  { label: 'Total Fat', value: '1g', percentage: '1%' },
  { label: 'Saturated Fat', value: '0.5g', percentage: '3%' },
  { label: 'Cholesterol', value: '5mg', percentage: '2%' },
  { label: 'Sodium', value: '60mg', percentage: '3%' },
  { label: 'Total Carbohydrates', value: '2g', percentage: '1%' },
  { label: 'Sugars', value: '0g', percentage: '0%' },
  { label: 'Calcium', value: '80mg', percentage: '6%' },
  { label: 'Phosphorus', value: '60mg', percentage: '5%' }
]

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Fast Absorption',
    description: 'Rapidly absorbed within 30 minutes post-workout for optimal muscle recovery'
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: 'Third-Party Tested',
    description: 'Independently verified for purity, potency, and banned substance screening'
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'NSF Certified',
    description: 'Certified by NSF International for sport and quality assurance'
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Trusted by Athletes',
    description: 'Used by professional athletes and fitness enthusiasts worldwide'
  }
]

const specifications = [
  { label: 'Protein Source', value: 'Whey Protein Isolate' },
  { label: 'Protein Content', value: '25g per serving' },
  { label: 'Servings per Container', value: '30' },
  { label: 'Serving Size', value: '32g (1 scoop)' },
  { label: 'Biological Value', value: '104 (highest available)' },
  { label: 'Amino Acid Profile', value: 'Complete - All 9 Essential Amino Acids' },
  { label: 'Leucine Content', value: '2.7g per serving' },
  { label: 'Lactose Content', value: '<1g (virtually lactose-free)' },
  { label: 'Artificial Colors', value: 'None' },
  { label: 'Artificial Preservatives', value: 'None' },
  { label: 'Gluten', value: 'Gluten-Free' },
  { label: 'Manufacturing', value: 'GMP Certified Facility' }
]

export default function WheyProteinPage() {
  const [currentImage, setCurrentImage] = useState(0)
  const [selectedFlavor, setSelectedFlavor] = useState(flavors[0])
  const [quantity, setQuantity] = useState(1)
  const [showReviews, setShowReviews] = useState(false)
  const [reviewFilter, setReviewFilter] = useState('all')
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  const averageRating = 4.8
  const totalReviews = 5691

  const filteredReviews = reviews.filter(review => {
    if (reviewFilter === 'all') return true
    return review.rating === parseInt(reviewFilter)
  })

  const addToCart = () => {
    // Add to cart logic here
    alert(`Added ${quantity} x ${selectedFlavor.name} to cart!`)
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-white hover:text-green-400">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Store</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white">
                <Share2 className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 ${isFavorite ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              <img 
                src={productImages[currentImage]} 
                alt="APEX Elite Whey Protein"
                className="w-full h-full object-cover"
              />
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex space-x-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    currentImage === index ? 'border-green-400' : 'border-gray-200'
                  }`}
                >
                  <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">APEX Elite Whey Isolate</h1>
              <p className="text-gray-600 text-lg">Ultra-Pure Whey Protein Isolate - 25g Protein, Zero Sugar, Fast Absorption</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= Math.floor(averageRating)
                  const isPartial = star === Math.ceil(averageRating) && averageRating % 1 !== 0
                  
                  return (
                    <div key={star} className="relative">
                      <Star className="h-5 w-5 text-gray-300" />
                      {isFilled && (
                        <Star className="h-5 w-5 text-yellow-400 fill-current absolute top-0 left-0" />
                      )}
                      {isPartial && (
                        <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${(averageRating % 1) * 100}%` }}>
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        </div>
                      )}
                    </div>
                  )
                })}
                <span className="ml-2 text-sm text-gray-600">({averageRating.toFixed(1)})</span>
              </div>
              <button 
                onClick={() => setShowReviews(!showReviews)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {totalReviews.toLocaleString()} Reviews
              </button>
            </div>

            {/* AI Synthesized Review */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 mb-2">
                    Our AI synthesized over 5k reviews to give you the key points you need to know!
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      "Overwhelming positive feedback, especially relating to flavor, mixability and price point. 
                      Very few users had negative comments, however the little that did, expressed frustration 
                      on not having a broader variety of flavors."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">${selectedFlavor.price}</span>
              <span className="text-lg text-gray-500 line-through">$79</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Save $10
              </span>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-green-600 mt-1">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Flavor Selection */}
            <div>
              <h3 className="font-semibold mb-3">Choose Flavor:</h3>
              <div className="grid grid-cols-2 gap-2">
                {flavors.map((flavor) => (
                  <button
                    key={flavor.name}
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`p-3 rounded-lg border-2 text-left ${
                      selectedFlavor.name === flavor.name
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{flavor.name}</div>
                    <div className="text-sm text-gray-600">${flavor.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center space-x-4">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 border-l border-r">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={addToCart}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart - ${(selectedFlavor.price * quantity).toFixed(2)}</span>
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Free shipping over $75</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">30-day guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              {['description', 'nutrition', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold mb-4">Product Description</h2>
                <p className="text-gray-600 mb-6">
                  APEX Elite Whey Isolate represents the pinnacle of protein supplementation. Our premium whey protein isolate 
                  delivers 25g of ultra-pure protein per serving with virtually zero sugar, making it the perfect choice for 
                  serious athletes and fitness enthusiasts.
                </p>
                <h3 className="text-lg font-semibold mb-3">Key Benefits:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start space-x-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>25g of complete protein with all essential amino acids</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Fast absorption for optimal post-workout recovery</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Virtually lactose-free and easy to digest</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>No artificial colors, flavors, or preservatives</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Third-party tested for purity and potency</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Nutrition Facts</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg">Serving Size: 1 scoop (32g)</h3>
                    <p className="text-gray-600">Servings per container: 30</p>
                  </div>
                  <div className="space-y-3">
                    {nutritionalInfo.map((item, index) => (
                      <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="font-medium">{item.label}</span>
                        <div className="text-right">
                          <span className="font-bold">{item.value}</span>
                          <span className="text-sm text-gray-600 ml-2">{item.percentage} DV</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    *Percent Daily Values are based on a 2,000 calorie diet
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Detailed Specifications</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{spec.label}</span>
                      <span className="text-gray-900 font-semibold">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Customer Reviews</h2>
                  <select 
                    value={reviewFilter}
                    onChange={(e) => setReviewFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="all">All Reviews</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                
                <div className="space-y-6">
                  {filteredReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold">{review.name}</span>
                            {review.verified && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span>{review.date}</span>
                            <span>Flavor: {review.flavor}</span>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold mb-2">{review.title}</h3>
                      <p className="text-gray-600 mb-3">{review.content}</p>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-600">Goal:</span>
                          <span className="font-medium">{review.goal}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-600">Body Type:</span>
                          <span className="font-medium">{review.bodyType}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-green-600">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{review.helpful}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600">
                            <ThumbsDown className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 