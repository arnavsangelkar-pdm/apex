"""NutraFuel Sales Optimizer AI Agent"""

from .base_agent import BaseRAGAgent

SALES_OPTIMIZER_PROMPT = """You are an AI consultant for sales optimization at NutraFuel.

Your expertise:
- Dynamic pricing strategies for sports nutrition and supplements
- Bundle optimization and subscription model enhancement
- Customer lifetime value maximization for fitness enthusiasts
- Seasonal promotion strategies for athletic performance products

You provide:
1. Real-time pricing recommendations based on demand and competitor analysis
2. Bundle optimization for supplement stacks and training goals
3. Subscription model optimization and retention strategies
4. Inventory forecasting and seasonal demand planning

Focus on data-driven recommendations that maximize revenue while maintaining value for athletes and fitness enthusiasts in the competitive supplement market."""

# Mock data - Supplement sales optimization and performance
PRICING_STRATEGY_DATA = [
    "Premium Pricing Model: Whey Protein at $49 maintains 31% profit margin while staying competitive",
    "Value Bundles: Muscle Building Stack ($95 for 3 products) increases average order value by 42%",
    "Seasonal Pricing: Pre-workout products increase 18% in January-March, protein steady year-round",
    "Subscription Discount: 15% off monthly delivery increases customer lifetime value by 73%",
    "First-Time Customer: 20% discount converts 52% of consultations to purchases",
    "Loyalty Pricing: Tier system rewards repeat customers with 5-20% escalating discounts based on volume"
]

BUNDLE_OPTIMIZATION_DATA = [
    "New Year Transformation: January bundles generate 420% normal daily revenue with goal-based stacks",
    "Summer Shred Stacks: May-July fat loss bundles show 94% higher engagement than individual products",
    "Back-to-School Athletes: August performance stacks target 18-25 demographic with 31% conversion",
    "Holiday Bulking: October-December muscle building bundles boost creatine sales by 167%",
    "Competition Prep: Specialized stacks for bodybuilders achieve 5.1:1 ROAS in targeted campaigns",
    "Beginner Friendly: Starter supplement bundles see 83% repeat purchase rate within 90 days"
]

SUBSCRIPTION_OPTIMIZATION_DATA = [
    "Subscription Uptake: Whey Protein subscription converts 3.1x faster than one-time purchases",
    "Retention Strategies: Pre-workout subscriptions have highest 12-month retention at 78%",
    "Bundle Subscriptions: Multi-product subscriptions reduce churn by 34% vs single-product",
    "Delivery Frequency: Monthly delivery optimal for protein, bi-weekly for pre-workout consumption",
    "Pause/Resume: Flexible subscription options reduce cancellations by 23% during off-seasons",
    "Subscription Upsell: 67% of subscribers add additional products within 6 months"
]

CUSTOMER_OPTIMIZATION_DATA = [
    "Cross-Selling Success: Customers buying protein have 79% likelihood of purchasing creatine",
    "Upsell Opportunities: Nutrition consultations lead to 38% premium stack selection vs self-service",
    "Training-Based Targeting: Strength athletes prefer creatine+protein, endurance athletes prefer BCAAs",
    "Subscription Impact: Monthly delivery customers spend 2.8x more annually than one-time buyers",
    "Referral Program: 20% discount for referrals generates 2.1 new customers per advocate",
    "Review Incentives: $10 credit for verified reviews increases feedback by 189% and sales by 16%"
]

# Create agent instance
agent = BaseRAGAgent(
    name="sales_optimizer",
    system_prompt=SALES_OPTIMIZER_PROMPT
)

# Load data into vector store
agent.add_documents(PRICING_STRATEGY_DATA + BUNDLE_OPTIMIZATION_DATA + SUBSCRIPTION_OPTIMIZATION_DATA + CUSTOMER_OPTIMIZATION_DATA)

# Create and export the graph
graph = agent.build_graph() 