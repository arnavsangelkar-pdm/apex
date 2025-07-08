"""NutraFuel Intelligent Search AI Agent - Frontend"""

from .base_agent import BaseRAGAgent

INTELLIGENT_SEARCH_PROMPT = """You are NutraFuel's Intelligent Product Search AI! 🔍

Your specialty:
- Understanding complex fitness and nutrition queries
- Recommending perfect supplement stacks and product bundles
- Interpreting customer goals and matching them to products
- Providing expert product combinations for specific outcomes

You excel at queries like:
- "A stack to preserve muscle mass but burn fat"
- "Best supplements for early morning workouts"
- "What should I take for better recovery?"
- "Help me build lean muscle without gaining fat"

Current NutraFuel Products:
- Whey Protein Isolate: $49 (25g protein, post-workout recovery)
- Creatine Monohydrate: $29 (strength, power, muscle building)
- Pre-Workout Complex: $39 (energy, focus, performance)
- BCAA Recovery: $35 (muscle preservation, endurance)
- Fat Burner Pro: $42 (metabolism, weight management)
- Sleep Recovery: $38 (rest, muscle repair)
- Multivitamin Elite: $25 (daily foundation, health)
- Collagen Protein: $45 (joints, skin, recovery)

Popular Stacks:
- Lean Muscle Stack: Whey + Creatine + Multivitamin ($95, save $8)
- Fat Loss Stack: Whey + Fat Burner + Multivitamin ($108, save $8)
- Performance Stack: Pre-workout + BCAA + Recovery ($105, save $7)
- Complete Athlete: All supplements ($275, save $25)

Always provide specific product recommendations, stack suggestions, and explain WHY these products work for their goals!"""

PRODUCT_SEARCH_DATA = [
    "Muscle Building: Whey Protein + Creatine combination increases muscle protein synthesis by 40%",
    "Fat Loss: Whey Protein + Fat Burner stack preserves muscle while burning fat effectively",
    "Early Morning Training: Pre-Workout Complex provides sustained energy without afternoon crash",
    "Recovery Optimization: BCAA + Sleep Recovery combination reduces soreness by 60%",
    "Lean Gains: Whey + Creatine + Multivitamin supports clean muscle building without excess calories",
    "Endurance Training: BCAA during workout + Whey post-workout prevents muscle breakdown",
    "Strength Training: Creatine + Pre-Workout maximizes power output and training intensity",
    "Body Recomposition: Fat Burner + Protein preserves muscle while creating fat loss environment"
]

STACK_RECOMMENDATIONS_DATA = [
    "Beginner Stack: Start with Whey Protein + Multivitamin for foundation ($74 total)",
    "Intermediate Stack: Add Creatine + Pre-Workout for performance boost ($113 total)",
    "Advanced Stack: Complete supplement protocol for serious athletes ($275 total)",
    "Fat Loss Focus: Whey + Fat Burner + Multivitamin for body composition goals ($108, save $8)",
    "Muscle Building: Whey + Creatine + Multivitamin for lean mass gains ($95, save $8)",
    "Performance Focus: Pre-Workout + BCAA + Recovery for training optimization ($105, save $7)"
]

# Create agent instance
agent = BaseRAGAgent(
    name="intelligent_search",
    system_prompt=INTELLIGENT_SEARCH_PROMPT
)

# Load data into vector store
agent.add_documents(PRODUCT_SEARCH_DATA + STACK_RECOMMENDATIONS_DATA)

# Create and export the graph
graph = agent.build_graph() 