"""NutraFuel Product Analytics AI Agent"""

from .base_agent import BaseRAGAgent

PRODUCT_ANALYTICS_PROMPT = """You are a professional nutrition and supplement analytics AI providing insights for NutraFuel.

Your role:
- Provide data-driven insights about supplement performance and nutrition trends
- Focus on ingredient efficacy, athletic performance metrics, and customer results
- Be professional and knowledgeable about sports nutrition science
- Use clinical research and customer performance data

You provide:
1. Real-time supplement performance analysis and customer results
2. Ingredient efficacy studies and athletic performance trends
3. Market intelligence and competitive supplement analysis
4. Customer satisfaction metrics and product optimization recommendations

Always cite specific data points and focus on evidence-based nutrition insights that drive product development and athletic performance."""

# Mock data - Supplement analytics and performance
PRODUCT_PERFORMANCE_DATA = [
    "Whey Protein Isolate Q3 2025: 96% customer satisfaction, 18% increase in repeat purchases",
    "Creatine Monohydrate Q3 2025: 94% report strength gains, 23% improvement in power output metrics",
    "Pre-Workout Complex Q3 2025: 91% energy satisfaction, bestselling pre-workout 8 months running",
    "BCAA Recovery Q3 2025: 89% recovery improvement reported, 21% increase in endurance athlete customer base",
    "Fat Burner Pro Q3 2025: 87% weight loss satisfaction, 15% average body fat reduction over 8 weeks",
    "Sleep Recovery Q3 2025: 93% sleep quality rating, suitable for 97% of athletes and active individuals"
]

INGREDIENT_ANALYTICS_DATA = [
    "Whey Protein Efficacy: 25g complete amino acid profile shows 85% muscle protein synthesis increase",
    "Creatine Performance: 5g daily dosage increases strength by 15% and power output by 12% in 4 weeks",
    "Beta-Alanine Benefits: 3.2g dose reduces muscle fatigue by 22% during high-intensity training",
    "BCAA Ratio Optimization: 2:1:1 leucine ratio prevents 67% of muscle breakdown during fasted training",
    "Caffeine + L-Theanine: 200mg caffeine with 100mg L-theanine improves focus by 34% vs caffeine alone",
    "Collagen Peptides: 20g daily reduces joint pain by 43% and improves recovery time by 28%"
]

MARKET_INTELLIGENCE_DATA = [
    "Supplement Market Q3 2025: 31% growth in plant protein, whey protein remains top performer",
    "Customer Demographics Q3 2025: 72% customers aged 22-45, 84% prioritize third-party testing and transparency",
    "Seasonal Trends Q3 2025: Protein sales peak 45% in January, pre-workout increases 38% in spring/summer",
    "Competitor Analysis Q3 2025: APEX prices 12% below premium brands while maintaining clinical dosages",
    "Ingredient Trends Q3 2025: Clean label up 27%, nootropics growing 35%, sustainable packaging expected",
    "Customer Preferences Q3 2025: 78% prefer unflavored options, 91% read supplement facts before purchasing"
]

CUSTOMER_PERFORMANCE_DATA = [
    "Overall Satisfaction: 94% customer satisfaction rate, 4.7/5 average product rating",
    "Performance Timeline: 73% see energy improvements within 1 week, 91% within 4 weeks",
    "Subscription Rate: 81% customers subscribe within 3 months, loyalty program 88% effective",
    "Training Impact: Customers report 34% improvement in workout quality with supplement stacks",
    "Body Composition: 67% achieve body composition goals within 12 weeks using recommended stacks",
    "Customer Support: 97% resolution rate, average response time under 90 minutes for athletes"
]

# Create agent instance
agent = BaseRAGAgent(
    name="product_analytics",
    system_prompt=PRODUCT_ANALYTICS_PROMPT
)

# Load data into vector store
agent.add_documents(PRODUCT_PERFORMANCE_DATA + INGREDIENT_ANALYTICS_DATA + MARKET_INTELLIGENCE_DATA + CUSTOMER_PERFORMANCE_DATA)

# Create and export the graph
graph = agent.build_graph() 