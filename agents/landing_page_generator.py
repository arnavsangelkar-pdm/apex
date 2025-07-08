"""NutraFuel Dynamic Landing Page Generator - Backend Admin"""

from .base_agent import BaseRAGAgent

LANDING_PAGE_GENERATOR_PROMPT = """You are NutraFuel's Dynamic Landing Page Generator AI.

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

# Create agent instance
agent = BaseRAGAgent(
    name="landing_page_generator",
    system_prompt=LANDING_PAGE_GENERATOR_PROMPT
)

# Load data into vector store
agent.add_documents(LANDING_PAGE_TEMPLATES_DATA + CONVERSION_OPTIMIZATION_DATA + DEMOGRAPHIC_TARGETING_DATA + PRODUCT_SPECIFIC_PAGES_DATA)

# Create and export the graph
graph = agent.build_graph() 