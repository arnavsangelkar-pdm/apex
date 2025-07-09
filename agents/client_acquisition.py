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
6. Interactive chart generation for cohort analysis, retention heatmaps, and subscription trends

When generating cohort charts, create HTML/CSS visualizations that show:
- Monthly cohorts (rows) vs months since signup (columns)
- Color-coded retention percentages (blue gradient: 100% = dark blue, 0% = light blue)
- Clear labels and professional styling
- Interactive hover effects showing exact percentages

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

COHORT_CHART_GENERATION_DATA = [
    "Cohort Chart HTML Structure: Table with cohort months as rows, retention periods as columns",
    "Color Coding System: 90-100% = #1e40af (dark blue), 80-89% = #3b82f6, 70-79% = #60a5fa, 60-69% = #93c5fd, 50-59% = #dbeafe, <50% = #f8fafc",
    "Chart Headers: 'Subscription Cohorts', 'Months since account creation' (0-12 columns)",
    "Row Labels: Monthly cohorts (Jan 2025, Feb 2025, Mar 2025, etc.)",
    "Interactive Features: Hover effects showing exact percentage, cohort size, absolute numbers",
    "Styling: Professional table borders, centered text, responsive design, APEX color scheme",
    "Data Format: Each cell shows retention percentage with appropriate background color",
    "Chart Footer: Data source, last updated timestamp, download/export options"
]

CHART_HTML_TEMPLATE_DATA = [
    "HTML Table Structure: <table class='cohort-chart'><thead><tr><th>Cohorts</th><th>0</th><th>1</th>...<th>12</th></tr></thead><tbody>",
    "CSS Styling: .cohort-chart { border-collapse: collapse; width: 100%; font-family: Arial; } .cohort-chart th, td { padding: 8px; text-align: center; border: 1px solid #ddd; }",
    "Color Classes: .retention-100 { background: #1e40af; color: white; } .retention-90 { background: #3b82f6; color: white; } .retention-80 { background: #60a5fa; }",
    "Hover Effects: .cohort-chart td:hover { transform: scale(1.1); z-index: 10; box-shadow: 0 4px 8px rgba(0,0,0,0.2); }",
    "Responsive Design: @media (max-width: 768px) { .cohort-chart { font-size: 12px; } .cohort-chart th, td { padding: 4px; } }",
    "JavaScript Interactivity: tooltip showing cohort details, percentage, absolute numbers on hover"
]

COMPREHENSIVE_COHORT_DATA = [
    "Jan 2025 Cohort: 24 signups - Month 0: 100%, Month 1: 83%, Month 2: 75%, Month 3: 71%, Month 6: 63%, Month 9: 58%",
    "Feb 2025 Cohort: 27 signups - Month 0: 100%, Month 1: 81%, Month 2: 74%, Month 3: 70%, Month 6: 61%, Month 8: 56%", 
    "Mar 2025 Cohort: 33 signups - Month 0: 100%, Month 1: 85%, Month 2: 79%, Month 3: 73%, Month 6: 67%, Month 7: 62%",
    "Apr 2025 Cohort: 30 signups - Month 0: 100%, Month 1: 87%, Month 2: 80%, Month 3: 76%, Month 6: 69%",
    "May 2025 Cohort: 34 signups - Month 0: 100%, Month 1: 85%, Month 2: 79%, Month 3: 74%, Month 5: 68%",
    "Jun 2025 Cohort: 28 signups - Month 0: 100%, Month 1: 82%, Month 2: 75%, Month 3: 71%, Month 4: 67%",
    "Jul 2025 Cohort: 34 signups - Month 0: 100%, Month 1: 84%, Month 2: 79%, Month 3: 74%",
    "Aug 2025 Cohort: 26 signups - Month 0: 100%, Month 1: 85%, Month 2: 77%",
    "Sep 2025 Cohort: 31 signups - Month 0: 100%, Month 1: 81%",
    "Oct 2025 Cohort: 29 signups - Month 0: 100%"
]

# Create agent instance
agent = BaseRAGAgent(
    name="customer_experience",
    system_prompt=CUSTOMER_EXPERIENCE_PROMPT
)

# Load data into vector store
agent.add_documents(PRODUCT_DATA + NUTRITION_GUIDANCE_DATA + GOAL_OPTIMIZATION_DATA + COHORT_ANALYSIS_DATA + COHORT_CHART_GENERATION_DATA + CHART_HTML_TEMPLATE_DATA + COMPREHENSIVE_COHORT_DATA)

# Create and export the graph
graph = agent.build_graph() 