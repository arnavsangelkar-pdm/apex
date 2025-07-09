"""NutraFuel Customer Experience AI Agent"""

from .base_agent import BaseRAGAgent

CUSTOMER_EXPERIENCE_PROMPT = """You are APEX's Customer Experience AI assistant! 💪

Your personality:
- Energetic, knowledgeable, and passionate about fitness and nutrition
- Enthusiastic about helping people achieve their performance goals
- Use phrases like "Fuel your potential!", "Let's optimize your nutrition!", "Peak performance starts here"
- Expert in protein, creatine, pre-workout, BCAAs, vitamins, meal planning
- Always focus on performance goals, body composition, and athletic achievements

You help customers with:
1. Product recommendations based on fitness goals and training style
2. Supplement stack building and timing optimization
3. Nutrition advice and meal planning guidance
4. Performance optimization and goal achievement
5. Advanced analytics including cohort analysis and retention tracking

Current NutraFuel product offerings (2024):
- Whey Protein Isolate: $49 (25g protein, fast absorption, post-workout)
- Creatine Monohydrate: $29 (5g servings, strength & power, clinically proven)
- Pre-Workout Complex: $39 (energy, focus, pump, beta-alanine + caffeine)
- BCAA Recovery: $35 (2:1:1 ratio, muscle preservation, during/post workout)
- Multivitamin Elite: $25 (athlete-formulated, high-potency, daily foundation)
- Collagen Protein: $45 (joint health, skin, hair, unflavored or vanilla)
- Fat Burner Pro: $42 (thermogenic, appetite control, energy boost)
- Sleep Recovery: $38 (melatonin, magnesium, ZMA, muscle recovery)

Popular stacks:
- Muscle Building Stack: Whey + Creatine + Multivitamin ($95, save $8)
- Performance Stack: Pre-workout + BCAA + Recovery ($105, save $7)
- Lean Body Stack: Whey + Fat Burner + Multivitamin ($108, save $8)
- Complete Athlete: All supplements bundle ($275, save $25)

Special offers:
- Subscribe & Save: 15% off monthly deliveries
- First-time customer: 20% off your first order
- Free shipping on orders over $75
- 30-day money-back guarantee

Always be motivational, results-focused, and help customers fuel their potential! 🔥💪"""

# Mock data - NutraFuel nutrition products and guidance
PRODUCT_DATA = [
    "Whey Protein Isolate - $49 - 25g high-quality protein per serving, fast absorption for post-workout recovery",
    "Creatine Monohydrate - $29 - 5g pure creatine, increases strength, power, and muscle mass",
    "Pre-Workout Complex - $39 - Caffeine, beta-alanine, citrulline for energy, focus, and pump",
    "BCAA Recovery Blend - $35 - 2:1:1 leucine ratio, prevents muscle breakdown during training",
    "Multivitamin Elite - $25 - Athlete-formulated with B-vitamins, zinc, magnesium for peak performance",
    "Collagen Protein - $45 - Type I & III collagen for joint health, skin elasticity, recovery",
    "Fat Burner Pro - $42 - Thermogenic blend with green tea, L-carnitine, cayenne for metabolism",
    "Sleep Recovery - $38 - Melatonin, magnesium, ZMA for deep sleep and muscle recovery",
    "Omega-3 Elite - $32 - High-EPA/DHA fish oil for inflammation, brain health, joint support",
    "Glutamine Pure - $28 - 5g L-glutamine for immune support and muscle recovery"
]

NUTRITION_GUIDANCE_DATA = [
    "Muscle Building: 1g protein per lb bodyweight, combine whey protein with creatine post-workout",
    "Fat Loss: Maintain protein intake, add thermogenic fat burner, create caloric deficit through diet",
    "Endurance Training: Focus on BCAAs during long sessions, complex carbs pre-workout",
    "Strength Training: Creatine 5g daily, whey protein within 30min post-workout for recovery",
    "Recovery Optimization: Sleep 7-9 hours, magnesium/ZMA supplementation, adequate protein intake",
    "Pre-Workout Timing: Consume 30-45 minutes before training for optimal energy and focus",
    "Hydration: 1oz water per lb bodyweight daily, add electrolytes during intense training sessions"
]

GOAL_OPTIMIZATION_DATA = [
    "Lean Muscle Stack: Whey Protein + Creatine + Multivitamin for clean muscle building",
    "Performance Stack: Pre-Workout + BCAAs + Recovery for athletic performance enhancement",
    "Fat Loss Stack: Whey Protein + Fat Burner + Omega-3 for body composition improvement",
    "Recovery Stack: Collagen + Sleep Recovery + Glutamine for optimal recovery and repair",
    "Beginner Stack: Whey Protein + Multivitamin for foundational nutrition support",
    "Advanced Athlete: Complete supplement protocol for serious competitors and trainers"
]

COHORT_ANALYSIS_DATA = [
    "Q3 2025 Cohort Analysis: Subscription retention tracking by months since account creation",
    "Month 0 (New Signups): 100% retention baseline across all cohorts",
    "Month 1 Retention: July 2025 cohort: 82%, August 2025 cohort: 85%, September 2025 cohort: 81%",
    "Month 2 Retention: July 2025: 76%, August 2025: 79%, September 2025: 77%",
    "Month 3 Retention: July 2025: 72%, August 2025: 74%, September 2025: 70%",
    "Month 6 Retention: April 2025: 65%, May 2025: 68%, June 2025: 67%",
    "Month 12 Retention: October 2024: 58%, November 2024: 61%, December 2024: 59%",
    "Cohort Insights: Summer signups show 5% higher retention due to consistent training schedules",
    "Retention Drivers: Customers who purchase within first 7 days show 23% higher 12-month retention",
    "Churn Patterns: Highest drop-off occurs between months 2-3, loyalty program reduces churn by 18%"
]

# Create agent instance
agent = BaseRAGAgent(
    name="customer_experience",
    system_prompt=CUSTOMER_EXPERIENCE_PROMPT
)

# Load data into vector store
agent.add_documents(PRODUCT_DATA + NUTRITION_GUIDANCE_DATA + GOAL_OPTIMIZATION_DATA + COHORT_ANALYSIS_DATA)

# Create and export the graph
graph = agent.build_graph() 