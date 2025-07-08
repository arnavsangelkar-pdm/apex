"""NutraFuel Financial Report Generator - Backend Admin"""

from .base_agent import BaseRAGAgent

FINANCIAL_REPORTS_PROMPT = """You are NutraFuel's Financial Report Generator AI.

Your expertise:
- Generate comprehensive financial reports and dashboards
- Analyze revenue trends, subscription metrics, and profitability
- Compare quarterly and yearly performance data
- Identify growth opportunities and financial insights
- Create executive summaries with actionable recommendations

You can generate reports on:
- Quarterly revenue comparisons and growth analysis
- Subscription vs one-time purchase performance
- Product-specific profitability and margin analysis
- Customer acquisition costs and lifetime value metrics
- Seasonal trends and forecasting data

Always provide specific numbers, percentages, and clear visualizations in your responses."""

FINANCIAL_PERFORMANCE_DATA = [
    "Q2 2024 Revenue: $2.4M total revenue, 34% increase from Q1 ($1.8M), 67% growth year-over-year",
    "Subscription Revenue Q2: $1.6M (67% of total), 89% retention rate, 15% quarter-over-quarter growth",
    "One-time Purchase Q2: $800K (33% of total), 23% increase from Q1, average order value $78",
    "Top Revenue Products Q2: Whey Protein ($720K), Pre-Workout ($480K), Creatine ($360K)",
    "Customer Acquisition Q2: 12,400 new customers, $67 average acquisition cost, $289 lifetime value",
    "Profit Margins Q2: 42% gross margin overall, Whey Protein (45%), Creatine (52%), Pre-Workout (38%)"
]

SUBSCRIPTION_METRICS_DATA = [
    "Subscription Growth: 156% year-over-year increase, 23% quarter-over-quarter growth",
    "Subscription Retention: 89% 12-month retention, 94% 6-month retention, 97% 3-month retention",
    "Average Subscription Value: $52/month, 2.3 products per subscription, 15% discount applied",
    "Subscription Churn Analysis: 6% monthly churn rate, mostly due to seasonal fitness cycles",
    "Subscription Upsell Success: 34% of subscribers add products within 6 months",
    "Subscription vs One-time LTV: $289 subscription LTV vs $145 one-time customer LTV"
]

QUARTERLY_COMPARISON_DATA = [
    "Q2 vs Q1 Growth: Revenue +34%, New customers +28%, Subscription signups +45%",
    "Q2 vs Q1 Product Performance: Whey Protein +31%, Creatine +42%, Fat Burner +67%",
    "Q2 Seasonal Trends: Summer prep drove 67% increase in Fat Burner sales, Pre-Workout steady",
    "Q2 Marketing ROI: $1.2M marketing spend, 4.2:1 ROAS, $67 customer acquisition cost",
    "Q2 Operational Efficiency: 15% reduction in fulfillment costs, 98.7% order accuracy",
    "Q2 Geographic Expansion: 23% growth in West Coast markets, 45% increase in subscription penetration"
]

FORECASTING_DATA = [
    "Q3 2024 Forecast: $2.8M projected revenue (+17% from Q2), back-to-school fitness surge expected",
    "Annual 2024 Projection: $10.2M total revenue, 78% from subscriptions, 145% year-over-year growth",
    "Subscription Forecast: 45,000 active subscribers by end of 2024, $2.3M monthly recurring revenue",
    "Product Demand Forecast: Pre-Workout +25% in Q3, Fat Burner +45% in Q4, Protein steady growth",
    "Market Expansion: Launch in 3 new states Q3, potential $500K additional quarterly revenue",
    "Investment Requirements: $800K for inventory scaling, $400K for marketing expansion"
]

# Create agent instance
agent = BaseRAGAgent(
    name="financial_reports",
    system_prompt=FINANCIAL_REPORTS_PROMPT
)

# Load data into vector store
agent.add_documents(FINANCIAL_PERFORMANCE_DATA + SUBSCRIPTION_METRICS_DATA + QUARTERLY_COMPARISON_DATA + FORECASTING_DATA)

# Create and export the graph
graph = agent.build_graph() 