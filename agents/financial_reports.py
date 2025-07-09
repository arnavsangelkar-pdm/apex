"""NutraFuel Financial Report Generator - Backend Admin"""

from .base_agent import BaseRAGAgent

FINANCIAL_REPORTS_PROMPT = """You are APEX's Financial Report Generator AI.

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

Always reference "accessed data" when citing information sources, and provide specific numbers, percentages, and clear visualizations in your responses."""

FINANCIAL_PERFORMANCE_DATA = [
    "Q3 2025 Revenue: $2.8M total revenue, 38% increase from Q2 ($2.1M), 72% growth year-over-year",
    "Subscription Revenue Q3 2025: $1.9M (68% of total), 91% retention rate, 18% quarter-over-quarter growth",
    "One-time Purchase Q3 2025: $900K (32% of total), 28% increase from Q2, average order value $82",
    "Top Revenue Products Q3 2025: Whey Protein ($840K), Pre-Workout ($560K), Creatine ($420K)",
    "Customer Acquisition Q3 2025: 14,200 new customers, $62 average acquisition cost, $312 lifetime value",
    "Profit Margins Q3 2025: 44% gross margin overall, Whey Protein (47%), Creatine (54%), Pre-Workout (40%)"
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
    "Q3 vs Q2 2025 Growth: Revenue +38%, New customers +32%, Subscription signups +48%",
    "Q3 vs Q2 2025 Product Performance: Whey Protein +34%, Creatine +45%, Fat Burner +72%",
    "Q3 2025 Seasonal Trends: Summer prep drove 72% increase in Fat Burner sales, Pre-Workout steady",
    "Q3 2025 Marketing ROI: $1.4M marketing spend, 4.8:1 ROAS, $62 customer acquisition cost",
    "Q3 2025 Operational Efficiency: 18% reduction in fulfillment costs, 99.1% order accuracy",
    "Q3 2025 Geographic Expansion: 28% growth in West Coast markets, 52% increase in subscription penetration"
]

FORECASTING_DATA = [
    "Q4 2025 Forecast: $3.2M projected revenue (+14% from Q3), holiday fitness surge expected",
    "Annual 2025 Projection: $11.8M total revenue, 82% from subscriptions, 165% year-over-year growth",
    "Subscription Forecast: 52,000 active subscribers by end of 2025, $2.8M monthly recurring revenue",
    "Product Demand Forecast Q4 2025: Pre-Workout +28% in Q4, Fat Burner +52% in Q4, Protein steady growth",
    "Market Expansion 2025: Launch in 5 new states Q4, potential $650K additional quarterly revenue",
    "Investment Requirements 2025: $1.2M for inventory scaling, $600K for marketing expansion"
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