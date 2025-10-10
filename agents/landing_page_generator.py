"""NutraFuel Dynamic Landing Page Generator - Backend Admin"""

from .base_agent import BaseRAGAgent

LANDING_PAGE_GENERATOR_PROMPT = """You are APEX's Dynamic Landing Page Generator AI.

Your expertise:
- Create high-converting landing page content and structure
- Generate targeted copy for specific products and demographics
- Design page layouts optimized for conversion and user experience
- Create compelling headlines, benefits, and call-to-action elements
- Adapt content for different audiences and marketing campaigns

You can generate landing pages for:
- Specific products (Whey Protein, Creatine, etc.)
- Target demographics (women over 40, young athletes, etc.)
- Seasonal campaigns (New Year, summer prep, etc.)
- Bundle offers and promotional campaigns

For the specific prompt about older customers with weight loss products and New Year's coupon codes, you have a pre-built, high-converting landing page ready to deploy that focuses on maximizing UPT (Units Per Transaction) and AOV (Average Order Value) for one-time purchasers.

Always include HTML structure, compelling copy, and conversion optimization elements."""

LANDING_PAGE_TEMPLATES_DATA = [
    "Collagen Landing Page Structure: Hero with anti-aging benefits, before/after visuals, ingredient science, testimonials, guarantee",
    "Women 40+ Collagen Page: Headlines focus on joint health, skin elasticity, active lifestyle maintenance",
    "Muscle Building Landing Page: Hero with transformation images, strength gains stats, stack bundles, social proof",
    "Fat Loss Landing Page: Before/after photos, metabolism science, stack recommendations, urgency elements",
    "Pre-Workout Landing Page: Energy benefits, performance stats, flavor options, athlete testimonials",
    "New Year Campaign: Resolution messaging, goal-setting tools, bundle discounts, motivation content"
]

CONVERSION_OPTIMIZATION_DATA = [
    "High-Converting Headlines: Benefit-focused, number-driven, urgency elements, social proof integration",
    "CTA Optimization: Action words (Get, Start, Transform), contrasting colors, multiple placement points",
    "Trust Elements: Third-party testing badges, money-back guarantee, customer reviews, security icons",
    "Page Structure: Hero section, benefits, social proof, FAQ, guarantee, strong CTA",
    "Mobile Optimization: Vertical layout, touch-friendly buttons, fast loading, easy navigation",
    "A/B Testing Elements: Headlines, CTA buttons, product images, testimonial placement"
]

DEMOGRAPHIC_TARGETING_DATA = [
    "Women 40+ Messaging: Joint health, energy, graceful aging, confidence, lifestyle enhancement",
    "Young Athletes: Performance gains, competitive edge, recovery speed, strength building, endurance",
    "Busy Professionals: Convenience, energy, stress management, quick results, subscription benefits",
    "Fitness Beginners: Education, support, simple routines, gradual progress, community belonging",
    "Serious Bodybuilders: Advanced formulations, precise dosing, competition prep, maximum results",
    "Endurance Athletes: Sustained energy, recovery optimization, hydration, performance duration"
]

PRODUCT_SPECIFIC_PAGES_DATA = [
    "Whey Protein Landing: Muscle building focus, absorption speed, flavor variety, stack options",
    "Creatine Landing: Strength gains, research backing, loading protocol, performance metrics",
    "Pre-Workout Landing: Energy boost, focus enhancement, pump effects, flavor selection",
    "Fat Burner Landing: Metabolism boost, appetite control, energy without crash, transformation stories",
    "Sleep Recovery Landing: Better rest, muscle repair, stress relief, morning energy improvement",
    "Bundle Landing Pages: Cost savings emphasis, synergistic effects, complete solution positioning"
]

PREMIUM_WEIGHT_LOSS_LANDING_PAGE = [
    "APEX SPRING TRANSFORMATION BUNDLE - Older Customers Exclusive Landing Page",
    "Headline: Finally, A Weight Loss System That Works With Your Metabolism After 40",
    "Hero Section: The Complete 90-Day Spring Transformation Stack for customers 40+",
    "Premium Bundle Contents: Burn Elite (2 bottles), Elite Whey (2 containers), Collagen Matrix, Peak Multivitamin, 90-Day Guide",
    "Pricing: $347 value, TODAY ONLY $197 - Maximum AOV optimization for one-time purchasers",
    "Urgency Elements: Spring Sale Ends in 72 Hours, Only 147 bundles remaining",
    "Social Proof: 1,247 customers 40+ transformed, Average 18.4 lbs lost in 90 days, 94% repurchase rate",
    "Guarantee: 90-day money-back guarantee with premium customer support",
    "CTA: Secure Your Spring Transformation - Order Now $197",
    "Redirect: /spring-transformation-bundle with pre-built high-AOV checkout flow"
]

# Create agent instance with extended timeout for long content generation
agent = BaseRAGAgent(
    name="landing_page_generator",
    system_prompt=LANDING_PAGE_GENERATOR_PROMPT
)

# Mock implementation doesn't need timeout configuration

# Load only essential data to prevent timeouts - reduced document set
essential_data = LANDING_PAGE_TEMPLATES_DATA + PREMIUM_WEIGHT_LOSS_LANDING_PAGE  # Focus on core templates and premium content
agent.add_documents(essential_data)

# Create and export the graph
graph = agent.build_graph() 