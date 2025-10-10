#!/usr/bin/env python3
"""NutraFuel AI API Server with Frontend and Backend Agent Separation"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import uvicorn
from dotenv import load_dotenv
import os
import asyncio

# Load environment variables
load_dotenv()

# Import Frontend Agents (Customer-facing)
from agents.intelligent_search import agent as intelligent_search_agent
from agents.customer_service import agent as customer_service_agent
from agents.rachel_nutrition import agent as rachel_nutrition_agent
from agents.ramy_lifestyle import agent as ramy_lifestyle_agent

# Import Backend Agents (Admin/Internal)
from agents.client_acquisition import agent as customer_experience_agent
from agents.marketing_analytics import agent as product_analytics_agent
from agents.campaign_optimizer import agent as sales_optimizer_agent
from agents.review_synthesis import agent as review_synthesis_agent
from agents.financial_reports import agent as financial_reports_agent
from agents.landing_page_generator import agent as landing_page_generator_agent

# Create FastAPI app
app = FastAPI(title="NutraFuel AI API", version="2.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Frontend Agents (Customer-facing)
frontend_agents = {
    "intelligent_search": intelligent_search_agent,
    "customer_service": customer_service_agent,
    "rachel_nutrition": rachel_nutrition_agent,
    "ramy_lifestyle": ramy_lifestyle_agent
}

# Backend Agents (Admin/Internal)
backend_agents = {
    "customer_experience": customer_experience_agent,
    "product_analytics": product_analytics_agent,
    "sales_optimizer": sales_optimizer_agent,
    "review_synthesis": review_synthesis_agent,
    "financial_reports": financial_reports_agent,
    "landing_page_generator": landing_page_generator_agent
}

# Request/Response models
class QueryRequest(BaseModel):
    query: str
    agent: str
    k: int = 3

class QueryResponse(BaseModel):
    response: str
    agent: str
    sources: Optional[List[Dict]] = None

@app.get("/")
async def root():
    return {
        "message": "NutraFuel AI API v2.0", 
        "frontend_agents": list(frontend_agents.keys()),
        "backend_agents": list(backend_agents.keys()),
        "docs": "/docs"
    }

@app.get("/agents/frontend")
async def list_frontend_agents():
    return {
        "agents": [
            {
                "id": "intelligent_search",
                "name": "Intelligent Search",
                "description": "AI-powered product search and recommendations"
            },
            {
                "id": "customer_service",
                "name": "Customer Service",
                "description": "Order tracking, returns, and customer support"
            },
            {
                "id": "rachel_nutrition",
                "name": "Rachel - Nutrition Coach",
                "description": "Meal planning and nutrition guidance"
            },
            {
                "id": "ramy_lifestyle",
                "name": "Ramy - Lifestyle Coach", 
                "description": "Style and lifestyle advice"
            }
        ]
    }

@app.get("/agents/backend")
async def list_backend_agents():
    return {
        "agents": [
            {
                "id": "customer_experience",
                "name": "Customer Experience Agent",
                "description": "Advanced customer analytics and optimization"
            },
            {
                "id": "product_analytics",
                "name": "Product Analytics Agent",
                "description": "Deep product performance and market insights"
            },
            {
                "id": "sales_optimizer",
                "name": "Sales Optimizer Agent",
                "description": "Revenue optimization and pricing strategies"
            },
            {
                "id": "review_synthesis",
                "name": "Review Synthesis Engine",
                "description": "Customer review analysis and insights"
            },
            {
                "id": "financial_reports",
                "name": "Financial Report Generator",
                "description": "Financial analysis and reporting"
            },
            {
                "id": "landing_page_generator",
                "name": "Landing Page Generator",
                "description": "Dynamic marketing page creation"
            }
        ]
    }

@app.post("/query/frontend", response_model=QueryResponse)
async def query_frontend_agent(request: QueryRequest):
    """Query a frontend (customer-facing) agent"""
    if request.agent not in frontend_agents:
        raise HTTPException(status_code=404, detail=f"Frontend agent '{request.agent}' not found")
    
    return await process_agent_query(frontend_agents[request.agent], request)

@app.post("/query/backend", response_model=QueryResponse)
async def query_backend_agent(request: QueryRequest):
    """Query a backend (admin/internal) agent"""
    if request.agent not in backend_agents:
        raise HTTPException(status_code=404, detail=f"Backend agent '{request.agent}' not found")
    
    return await process_agent_query(backend_agents[request.agent], request)

@app.post("/query", response_model=QueryResponse)
async def query_agent_legacy(request: QueryRequest):
    """Legacy endpoint - tries frontend first, then backend"""
    # Try frontend agents first
    if request.agent in frontend_agents:
        return await process_agent_query(frontend_agents[request.agent], request)
    
    # Try backend agents
    if request.agent in backend_agents:
        return await process_agent_query(backend_agents[request.agent], request)
    
    raise HTTPException(status_code=404, detail=f"Agent '{request.agent}' not found")

def generate_mock_response(agent_name: str, query: str, agent_data: list) -> str:
    """Generate mock AI responses using hardcoded data"""
    query_lower = query.lower()
    
    # Agent-specific response logic
    if agent_name == "rachel_nutrition":
        if any(word in query_lower for word in ["dinner", "meal", "cook", "recipe"]):
            return """Hi! I'm Rachel, your nutrition coach! 🍎

For muscle-building dinners, I love recommending:

**🍗 Grilled Chicken Power Bowl**
- 6oz grilled chicken breast (42g protein)
- 1 cup jasmine rice (45g carbs)
- Steamed broccoli and bell peppers
- 1 tbsp olive oil (healthy fats)

**🐟 Salmon Recovery Plate**
- 5oz baked salmon (35g protein + omega-3s)
- Sweet potato wedges (complex carbs)
- Asparagus with garlic
- Perfect post-workout meal!

**⏰ Timing Tip:** Have this 1-2 hours after your workout, and it pairs perfectly with your Whey Protein shake for maximum muscle protein synthesis!

Let's fuel your goals! 💪"""
        
        elif any(word in query_lower for word in ["breakfast", "morning", "pre-workout"]):
            return """Good morning! I'm Rachel! 🌅

Here are my favorite muscle-building breakfast ideas:

**🥞 Protein Power Pancakes**
- 2 whole eggs + 2 egg whites
- 1/2 cup oats blended
- 1 scoop vanilla protein powder
- Topped with berries and Greek yogurt

**🍳 Champion's Omelet**
- 3 whole eggs + 2 egg whites
- Spinach, mushrooms, bell peppers
- 1 slice whole grain toast
- Side of avocado

**⚡ Pre-Workout Fuel (30-60 min before):**
- Banana with almond butter
- Or overnight oats with protein powder

Nutrition made simple! What's your training schedule like? 💪"""
        
        else:
            return """Hi there! I'm Rachel, your personal nutrition coach! 🍎

I'm here to help you create delicious, healthy meals that support your fitness goals! Whether you're looking to:

- 💪 Build lean muscle
- 🔥 Burn fat while preserving muscle  
- ⚡ Fuel your workouts
- 🛌 Optimize recovery

I can help you with meal planning, recipe ideas, and nutrition timing that works with your NutraFuel supplement routine.

Ask me things like:
- "What should I make for dinner for muscle building?"
- "I need a quick post-workout meal"
- "Help me meal prep for the week"

Let's fuel your potential! What are your specific goals? 🎯"""

    elif agent_name == "intelligent_search":
        if any(word in query_lower for word in ["muscle", "build", "gain", "bulk"]):
            return """🔍 **Perfect Muscle Building Stack Found!**

Based on your goals, I recommend the **Lean Muscle Stack**:

**🥇 Core Stack ($95 - Save $8!)**
- **Whey Protein Isolate** - $49 (25g complete protein)
- **Creatine Monohydrate** - $29 (strength & power gains)  
- **Multivitamin Elite** - $25 (nutritional foundation)

**💪 Why This Works:**
- Whey + Creatine increases muscle protein synthesis by 40%
- Perfect post-workout combination for lean gains
- Multivitamin supports recovery and overall health

**🚀 Upgrade Options:**
- Add Pre-Workout Complex ($39) for intense training sessions
- Add BCAA Recovery ($35) for enhanced endurance

**📈 Expected Results:**
- 2-4 lbs lean muscle gain in 8 weeks
- 15-20% strength increase
- Faster recovery between workouts

Ready to build lean muscle? This stack has helped thousands achieve their goals! 💪"""

        elif any(word in query_lower for word in ["fat", "burn", "lose", "cut", "lean"]):
            return """🔥 **Ultimate Fat Burning Stack!**

Perfect for preserving muscle while burning fat:

**🥇 Fat Loss Stack ($108 - Save $8!)**
- **Whey Protein Isolate** - $49 (preserve muscle)
- **Fat Burner Pro** - $42 (boost metabolism)
- **Multivitamin Elite** - $25 (support during deficit)

**🎯 Why This Combination Works:**
- Protein prevents muscle loss during fat loss
- Fat Burner increases metabolism by 12-15%
- Maintains energy levels during calorie deficit

**⚡ Pro Tips:**
- Take Fat Burner 30 minutes before meals
- Whey protein between meals to stay full
- Perfect for body recomposition goals

**📊 Expected Results:**
- 1-2 lbs fat loss per week
- Muscle preservation during cut
- Increased energy and focus

This stack helps you burn fat while keeping your hard-earned muscle! 🔥"""

        else:
            return """🔍 **Welcome to NutraFuel Intelligent Search!**

I'm here to help you find the perfect supplements for your goals! Tell me what you're looking for:

**🎯 Popular Goals:**
- "Help me build lean muscle"
- "A stack to burn fat but keep muscle"
- "Best supplements for strength training"
- "What should I take for better recovery?"

**💪 Current Bestsellers:**
- **Lean Muscle Stack** - $95 (Whey + Creatine + Multi)
- **Fat Loss Stack** - $108 (Whey + Fat Burner + Multi)  
- **Performance Stack** - $105 (Pre-workout + BCAA + Recovery)

**🏆 All Products Include:**
- Third-party tested for purity
- 30-day money-back guarantee
- Free shipping on orders $75+

What are your fitness goals? I'll recommend the perfect stack! 🚀"""

    elif agent_name == "customer_service":
        if "1439221" in query or "track" in query_lower:
            return """🎧 **NutraFuel Customer Service - Order Update!**

**Order #1439221 Status:** ✅ **SHIPPED!**

**📦 Tracking Information:**
- Tracking Number: 1Z999AA1234567890
- Shipped Date: January 15, 2024
- Carrier: UPS Ground
- Expected Delivery: 2-3 business days

**📋 Your Order:**
- Whey Protein Isolate (Vanilla) - $49.00
- Creatine Monohydrate - $29.00
- **Total:** $78.00 (Free shipping applied!)

**📍 Delivery Address:** [Your confirmed address]

**🔔 Next Steps:**
- You'll receive email updates on delivery progress
- Track directly at: ups.com with your tracking number
- Questions? Reply here or call (555) 123-FUEL

Thanks for choosing NutraFuel! Your gains are on the way! 💪"""

        elif any(word in query_lower for word in ["return", "refund", "exchange"]):
            return """🎧 **NutraFuel Returns & Exchanges**

**✅ 30-Day Money-Back Guarantee**

**📝 Easy Return Process:**
1. Contact us within 30 days of purchase
2. We'll email you a prepaid return label
3. Send back unused portion (even if opened!)
4. Full refund processed in 3-5 business days

**🔄 Exchange Options:**
- Different flavor? No problem!
- Wrong product? We'll swap it!
- Size issues? Easy exchange!

**💡 Common Solutions:**
- **Taste concerns?** Try mixing with different liquids
- **Texture issues?** Blend with ice or use shaker bottle
- **Not seeing results?** Our nutrition team can help optimize your routine

**📞 Need Help?**
- Chat with us here 24/7
- Call: (555) 123-FUEL
- Email: support@nutrafuel.com

We stand behind our products 100%! What can I help you with? 😊"""

        else:
            return """🎧 **Welcome to NutraFuel Customer Service!**

I'm here to help with:

**📦 Order Support:**
- Track your order (just give me your order number!)
- Shipping questions and delivery updates
- Order modifications and cancellations

**🔄 Returns & Exchanges:**
- 30-day money-back guarantee
- Easy return process with prepaid labels
- Product exchanges and flavor swaps

**💳 Account Management:**
- Update billing and shipping information
- Manage your subscription preferences
- Pause or modify recurring orders

**❓ Product Questions:**
- Usage instructions and timing
- Ingredient information and allergens
- Stack recommendations and combinations

**🎯 Quick Help:**
- Free shipping on orders over $75
- 15% off with subscription orders
- Same-day processing before 2 PM EST

How can I help make your NutraFuel experience amazing? 😊"""

    elif agent_name == "ramy_lifestyle":
        return """👋 **Hey there! I'm Ramy, your lifestyle coach!**

I'm all about helping you live your best life - from style tips to daily optimization! 

**🎯 What I Help With:**
- **Style & Fashion** - Look confident in and out of the gym
- **Daily Routines** - Optimize your schedule for success
- **Lifestyle Habits** - Build sustainable healthy practices
- **Confidence Building** - Feel amazing inside and out

**💡 Quick Tips:**
- **Morning Routine:** Start with protein, hydration, and movement
- **Gym Style:** Comfortable athletic wear that makes you feel powerful
- **Recovery Days:** Active rest with walks, stretching, or light yoga
- **Evening Wind-down:** Limit screens, prep for tomorrow, quality sleep

**🔥 Popular Topics:**
- "Help me build a morning routine"
- "What should I wear to feel confident?"
- "How do I stay motivated?"
- "Lifestyle tips for busy professionals"

What area of your lifestyle would you like to level up? Let's make it happen! ✨"""

    # Backend Agents
    elif agent_name == "review_synthesis":
        return """📊 **Review Synthesis Engine - Customer Insights**

**Analysis of 8,247 Customer Reviews (Last 90 Days)**

**⭐ Overall Satisfaction: 4.6/5 Stars**

**🔝 Top Performing Products:**
1. **Whey Protein Isolate** - 4.8/5 (2,341 reviews)
   - "Best tasting protein I've ever had!" - Sarah M.
   - "Mixes perfectly, no clumps" - Mike T.
   - 96% would recommend to friends

2. **Creatine Monohydrate** - 4.7/5 (1,892 reviews)
   - "Strength gains in just 2 weeks!" - Alex R.
   - "Pure, effective, great value" - Jessica L.
   - 94% report strength improvements

**📈 Trending Themes:**
- ✅ **Taste & Mixability** mentioned in 78% of positive reviews
- ✅ **Fast Results** noted by 84% of customers
- ✅ **Third-Party Testing** appreciated by 91% of buyers
- ⚠️ **Packaging** - 12% suggest larger containers

**💡 Customer Recommendations:**
- Bundle deals are extremely popular (mentioned in 67% of reviews)
- Subscription service loved by 89% of recurring customers
- Free shipping threshold perfect at $75 (mentioned positively)

**🎯 Action Items:**
- Consider larger container options for top products
- Expand bundle offerings based on customer combinations
- Highlight third-party testing more prominently

Would you like me to dive deeper into any specific product or theme? 📊"""

    elif agent_name == "financial_reports":
        if any(word in query_lower for word in ["q2", "q1", "quarter", "compare"]):
            return """📈 **Q2 vs Q1 2024 Financial Performance**

**🎯 Executive Summary:**
Q2 2024 shows strong growth across all key metrics!

**💰 Revenue Comparison:**
- **Q1 2024:** $2.1M total revenue
- **Q2 2024:** $2.8M total revenue  
- **Growth:** +33.3% quarter-over-quarter 🚀

**📊 Revenue Breakdown by Category:**
- **Protein Products:** Q1: $847K → Q2: $1.12M (+32%)
- **Performance Supplements:** Q1: $634K → Q2: $896K (+41%)
- **Wellness & Recovery:** Q1: $419K → Q2: $542K (+29%)
- **Bundles & Stacks:** Q1: $203K → Q2: $378K (+86%) 🔥

**🎪 Subscription Performance:**
- **Q1 Subscribers:** 3,247 active
- **Q2 Subscribers:** 4,891 active (+51% growth!)
- **Monthly Recurring Revenue:** Q1: $127K → Q2: $189K

**🏆 Top Performers:**
1. **Lean Muscle Stack** - $89K revenue (Q2)
2. **Whey Protein Isolate** - $312K individual sales
3. **New Customer Bundles** - 67% conversion rate

**💡 Key Insights:**
- Bundle strategy driving 86% growth in stack sales
- Subscription model showing excellent retention (91%)
- Summer fitness season boosted performance supplements

**🎯 Q3 Projections:** $3.2M revenue target (+14% growth)

Excellent momentum heading into Q3! 📈"""
        else:
            return """📊 **Financial Reports Dashboard**

**Current Performance Metrics (YTD 2024):**

**💰 Revenue Overview:**
- **Total Revenue:** $8.7M (YTD)
- **Monthly Growth Rate:** +12.4% average
- **Top Revenue Month:** June 2024 ($1.1M)

**📈 Key Performance Indicators:**
- **Average Order Value:** $67.50 (+8% vs 2023)
- **Customer Lifetime Value:** $247 (+15% vs 2023)
- **Subscription Revenue:** 34% of total revenue
- **Return Customer Rate:** 68%

**🎯 Product Performance:**
- **Best Seller:** Whey Protein Isolate ($2.1M YTD)
- **Fastest Growing:** BCAA Recovery (+78% vs 2023)
- **Highest Margin:** Bundle packages (42% margin)

**💳 Payment & Subscription Metrics:**
- **Active Subscriptions:** 4,891 customers
- **Subscription Retention:** 91% (12-month)
- **Average Subscription Value:** $38.60/month

**🎪 Seasonal Trends:**
- **Q1:** New Year fitness surge (+45%)
- **Q2:** Summer prep momentum (+33%)
- **Q3 Forecast:** Back-to-school athletes (+28%)

What specific financial metrics would you like me to analyze? 📊"""

    elif agent_name == "landing_page_generator":
        if any(word in query_lower for word in ["collagen", "women", "40", "older"]):
            return """# 🌟 Elite Collagen Matrix - Women Over 40 Landing Page

## Hero Section
**Headline:** "Finally, Collagen That Actually Works - Designed for Women Over 40"
**Subheading:** "The Complete Beauty & Wellness Solution for Radiant Skin, Strong Joints & Lasting Energy"

## Hero Offer
**🌸 WOMEN'S WELLNESS TRANSFORMATION BUNDLE**
- ✨ Elite Collagen Matrix (2 containers) - Premium hydrolyzed collagen
- 💪 Whey Protein Isolate - Maintain muscle & metabolism  
- 🌟 Peak Multivitamin - Complete nutrition for women 40+
- 📖 "Ageless Beauty" nutrition guide
- 🎁 FREE collagen recipe book

**Pricing:** ~~$189 value~~ **TODAY ONLY $127**

## Benefits for Women 40+
- ✅ **Skin Elasticity** - Reduce fine lines in 6-8 weeks
- ✅ **Joint Comfort** - Move freely without stiffness
- ✅ **Hair & Nails** - Stronger, healthier growth
- ✅ **Metabolism Support** - Maintain healthy weight
- ✅ **Energy Boost** - Feel vibrant all day

## Social Proof
- 2,847 women over 40 transformed
- 4.8/5 star rating from verified customers
- "I look 10 years younger!" - Maria, age 47
- "My joints feel amazing again!" - Susan, age 52

## Scientific Backing
- **10g Hydrolyzed Collagen** per serving
- **Types I, II & III** collagen peptides
- **Third-party tested** for purity
- **Clinically studied** ingredients

## Urgency & Guarantee
- ⏰ **48-Hour Flash Sale** - Limited time pricing
- 📦 Only 89 bundles remaining at this price
- 🛡️ **60-Day Money-Back Guarantee**
- 🚚 FREE shipping on all orders

## Call-to-Action
**🛒 SECURE YOUR TRANSFORMATION - ORDER NOW $127**
*Transform your skin, joints & energy in 60 days or your money back!*

*This landing page is optimized for women 40+ seeking comprehensive wellness solutions.*"""
        else:
            return """# 🚀 Dynamic Landing Page Generator

## Current Template: High-Converting Supplement Landing Page

**🎯 Key Elements Included:**
- **Compelling Headline** with benefit-focused messaging
- **Hero Offer** with bundle pricing and urgency
- **Social Proof** with customer testimonials and ratings
- **Scientific Backing** with ingredient details
- **Risk Reversal** with money-back guarantee

**📊 Conversion Optimization Features:**
- Multiple call-to-action buttons
- Scarcity elements (limited quantity/time)
- Trust badges and certifications
- Mobile-responsive design
- Fast loading optimization

**🎪 Popular Landing Page Types:**
- **Weight Loss Focus** - "Transform Your Body in 90 Days"
- **Muscle Building** - "Build Lean Muscle Without Fat"
- **Women's Wellness** - "Look & Feel 10 Years Younger"
- **Athletic Performance** - "Unlock Your Peak Potential"

**💡 Best Practices Applied:**
- Benefit-driven headlines
- Emotional triggers and urgency
- Clear value proposition
- Strong guarantee and trust signals

Specify your target audience and product focus for a customized landing page! 🎯"""

    elif agent_name == "product_analytics":
        return """📊 **Product Analytics Dashboard - Performance Insights**

**🏆 Top Performing Products (Q2 2024):**

**1. Whey Protein Isolate** ⭐
- **Revenue:** $312K (28% of total)
- **Units Sold:** 6,347 containers
- **Customer Satisfaction:** 4.8/5 stars
- **Repeat Purchase Rate:** 89%
- **Trend:** +23% vs Q1

**2. Creatine Monohydrate** 💪
- **Revenue:** $187K (17% of total)  
- **Units Sold:** 6,448 containers
- **Customer Satisfaction:** 4.7/5 stars
- **Repeat Purchase Rate:** 82%
- **Trend:** +31% vs Q1

**3. Pre-Workout Complex** ⚡
- **Revenue:** $156K (14% of total)
- **Units Sold:** 4,001 containers
- **Customer Satisfaction:** 4.6/5 stars
- **Repeat Purchase Rate:** 76%
- **Trend:** +18% vs Q1

**📈 Bundle Performance:**
- **Lean Muscle Stack:** $89K revenue, 67% take rate
- **Fat Loss Stack:** $73K revenue, 54% take rate
- **Performance Stack:** $61K revenue, 48% take rate

**🎯 Customer Insights:**
- **Average Products per Order:** 2.3 items
- **Bundle Customers** spend 73% more than single-product buyers
- **Subscription Customers** have 4.2x higher lifetime value

**🔥 Growth Opportunities:**
- **BCAA Recovery:** +78% growth potential based on market trends
- **Women's Collagen:** Underperforming segment with high demand
- **Sleep Recovery:** Growing category, +45% search volume

**💡 Recommendations:**
- Expand bundle offerings for top-performing combinations
- Increase marketing spend on high-growth categories
- Consider premium product line for high-value customers

What specific product metrics would you like me to analyze deeper? 📊"""

    elif agent_name == "sales_optimizer":
        return """💰 **Sales Optimization Engine - Revenue Maximization**

**🎯 Current Pricing Strategy Performance:**

**📊 Optimal Price Points (Based on Demand Analysis):**
- **Whey Protein:** $49 (sweet spot - 31% margin, high volume)
- **Creatine:** $29 (competitive advantage at this price)
- **Pre-Workout:** $39 (premium positioning working well)
- **Bundles:** 15-20% discount drives 73% higher AOV

**🚀 Revenue Optimization Opportunities:**

**1. Dynamic Bundle Pricing** 💡
- **Current:** Fixed 15% bundle discount
- **Optimized:** Tiered discounts based on cart value
  - 2 products: 10% off
  - 3 products: 15% off  
  - 4+ products: 20% off
- **Projected Impact:** +$47K monthly revenue

**2. Subscription Optimization** 📈
- **Current:** 15% subscription discount
- **Optimized:** Graduated loyalty pricing
  - Month 1-3: 15% off
  - Month 4-12: 20% off
  - 12+ months: 25% off
- **Projected Impact:** +31% retention, +$89K LTV

**3. Seasonal Pricing Strategy** 🎪
- **January-March:** New Year bundles (+25% premium)
- **May-July:** Summer shred stacks (+18% premium)
- **September:** Back-to-school performance (+15% premium)
- **November:** Holiday gift bundles (+20% premium)

**💳 Payment Optimization:**
- **Buy Now, Pay Later** option increases conversion by 34%
- **Auto-refill discounts** boost subscription adoption by 67%
- **First-time buyer** 20% discount converts 52% of consultations

**🎯 Immediate Actions:**
1. Implement tiered bundle pricing this week
2. Test graduated subscription rewards
3. Launch seasonal pricing for summer prep
4. Add payment flexibility options

**📈 Projected Revenue Impact:** +$127K monthly (+23% increase)

Ready to implement these optimizations? 🚀"""

    elif agent_name == "customer_experience":
        return """🎯 **Customer Experience Analytics - Satisfaction Insights**

**📊 Overall Experience Metrics:**
- **Customer Satisfaction Score:** 4.6/5 ⭐
- **Net Promoter Score:** 67 (Industry average: 31)
- **Customer Retention Rate:** 89% (12-month)
- **Support Resolution Time:** 2.3 hours average

**🛍️ Customer Journey Analysis:**

**Discovery Phase:**
- **Top Traffic Sources:** Google (34%), Social Media (28%), Referrals (23%)
- **Most Viewed Pages:** Product comparisons, ingredient guides
- **Conversion Rate:** 12.4% (Industry average: 3.2%)

**Purchase Experience:**
- **Cart Abandonment Rate:** 23% (down from 31% last quarter)
- **Checkout Completion:** 94% success rate
- **Average Decision Time:** 4.7 days from first visit

**Post-Purchase Satisfaction:**
- **Delivery Experience:** 4.8/5 rating
- **Product Quality:** 4.7/5 rating  
- **Packaging:** 4.5/5 rating
- **First Use Experience:** 4.6/5 rating

**🎪 Customer Segments Performance:**

**New Customers (0-3 months):**
- Satisfaction: 4.4/5
- Most Popular: Starter bundles
- Key Need: Education and guidance

**Established Customers (3-12 months):**
- Satisfaction: 4.7/5
- Most Popular: Individual products + subscriptions
- Key Need: Variety and convenience

**Loyal Customers (12+ months):**
- Satisfaction: 4.9/5
- Most Popular: Premium bundles, new releases
- Key Need: Exclusive access and rewards

**💡 Experience Enhancement Opportunities:**
1. **Onboarding Program** for new customers (+0.3 satisfaction boost)
2. **Loyalty Rewards** for established customers (+23% retention)
3. **VIP Access** for loyal customers (+$89 average spend increase)

**🔥 Success Stories:**
- "Best customer service I've experienced!" - Mike R.
- "Products arrived faster than expected!" - Sarah L.  
- "Love the educational content!" - Alex M.

What aspect of customer experience would you like to optimize? 🎯"""

    # Default response for any agent
    return f"""Hello! I'm your {agent_name.replace('_', ' ').title()} assistant! 

I'm here to help you with all your questions. Based on your query "{query}", I'd be happy to provide personalized recommendations and guidance.

What specific information are you looking for today? 😊"""

async def process_agent_query(agent, request: QueryRequest):
    """Process query for any agent using mock data"""
    try:
        # Get the agent's hardcoded data
        agent_data = getattr(agent, 'documents', [])
        
        # Generate mock response
        response_text = generate_mock_response(request.agent, request.query, agent_data)
        
        # Create mock sources from agent data
        sources = []
        if agent_data:
            # Use first few documents as sources
            for i, doc in enumerate(agent_data[:3]):
                source = {
                    "content": doc[:100] + "..." if len(doc) > 100 else doc,
                    "metadata": {
                        "source": f"{request.agent}_doc_{i+1}",
                        "title": doc.split(':')[0] if ':' in doc else f"Document {i+1}",
                        "index": i
                    },
                    "relevance_score": 0.95 - (i * 0.1)  # Mock relevance scores
                }
                sources.append(source)
        
        return QueryResponse(
            response=response_text,
            agent=request.agent,
            sources=sources
        )
        
    except Exception as e:
        print(f"Error in mock agent {request.agent}: {e}")
        
        # Simple fallback response
        fallback_message = f"""Hello! I'm your {request.agent.replace('_', ' ').title()} assistant! 

I'm experiencing a brief issue, but I'm here to help! Your query was: "{request.query}"

Please try asking your question in a different way, and I'll provide you with detailed guidance and recommendations! 😊"""
        
        return QueryResponse(
            response=fallback_message,
            agent=request.agent,
            sources=[]
        )

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "api_key_set": bool(os.getenv("OPENAI_API_KEY")),
        "frontend_agents": len(frontend_agents),
        "backend_agents": len(backend_agents)
    }

@app.get("/warmup")
async def warmup():
    """Warmup endpoint to prevent cold starts"""
    return {"status": "warmed", "message": "Server is ready"}

if __name__ == "__main__":
    print("💪 Starting NutraFuel AI API Server...")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🎯 API Base: http://localhost:8000")
    print("🛍️  Frontend Agents: http://localhost:8000/agents/frontend") 
    print("🔧 Backend Agents: http://localhost:8000/agents/backend")
    # Use PORT environment variable for Render deployment
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 