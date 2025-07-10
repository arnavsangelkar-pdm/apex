"""NutraFuel Customer Experience AI Agent"""

from .base_agent import BaseRAGAgent

CUSTOMER_EXPERIENCE_PROMPT = """You are APEX's Customer Experience Analytics AI! 📊

You specialize in Q3 2025 cohort analysis and subscription metrics. You provide:
- Q3 2025 retention data by monthly cohorts
- Customer lifetime value insights  
- Actionable retention recommendations
- Interactive cohort chart generation

Always be analytical, data-driven, and focused on customer success metrics! 📈💡"""

# Minimal essential data for fast performance
ESSENTIAL_COHORT_DATA = [
    "Q3 2025 Cohort Analysis: July (34 signups) - Month 1: 84%, Month 2: 79%, Month 3: 74%",
    "Q3 2025 Cohort Analysis: August (26 signups) - Month 1: 85%, Month 2: 77%", 
    "Q3 2025 Cohort Analysis: September (31 signups) - Month 1: 81%",
    "Customer Satisfaction: 94% satisfaction rate, Average CLV: $347",
    "Retention Insights: Summer cohorts show 5% higher retention, Month 2-3 has highest churn"
]

# Create agent instance
agent = BaseRAGAgent(
    name="customer_experience",
    system_prompt=CUSTOMER_EXPERIENCE_PROMPT
)

# Load minimal data for maximum speed
agent.add_documents(ESSENTIAL_COHORT_DATA)

# Create and export the graph
graph = agent.build_graph() 