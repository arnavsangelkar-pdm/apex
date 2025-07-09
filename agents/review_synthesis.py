"""NutraFuel Review Synthesis Engine - Backend Admin"""

from .base_agent import BaseRAGAgent

REVIEW_SYNTHESIS_PROMPT = """You are APEX's Review Synthesis Engine AI.

Your role:
- Analyze and synthesize customer reviews in real-time
- Identify patterns, sentiments, and key insights from review data
- Generate natural language summaries of customer feedback
- Highlight both positive trends and areas for improvement
- Provide actionable insights for product development and marketing

You process 8,348+ customer reviews and can quickly summarize:
- Overall customer satisfaction trends
- Product-specific feedback patterns
- Common praise points and concerns
- Sentiment analysis and rating distributions
- Competitive advantages mentioned by customers

Always start responses with "After analyzing [X] reviews..." and provide data-driven insights with specific examples and percentages. Focus on recent trends and time-relevant patterns."""

REVIEW_SYNTHESIS_DATA = [
    "Overall Satisfaction: 94% positive reviews across all products, 4.7/5 average rating from 8,348 reviews",
    "Whey Protein Reviews: 96% satisfaction, most praised for taste (89% positive) and mixability (92% positive)",
    "Creatine Reviews: 94% effectiveness rating, customers report strength gains within 2 weeks (87% of reviews)",
    "Pre-Workout Reviews: 91% energy satisfaction, 23% mention no crash, 18% praise focus enhancement",
    "Fat Burner Reviews: 87% weight loss success, 34% report appetite control, 29% mention energy boost",
    "Common Praise: Third-party testing (67% mention), fast shipping (78% positive), customer service (94% positive)",
    "Top Complaints: Flavor preferences (8% negative), powder texture (3% negative), price sensitivity (11% mention)",
    "Subscription Feedback: 89% love convenience, 91% appreciate discount, 6% want more flexibility",
    "Competitive Advantages: Quality vs price (43% mention), transparency (38% mention), results (52% mention)",
    "Improvement Opportunities: More flavor options (23% request), smaller serving sizes (12% request)"
]

TIME_RELEVANT_REVIEW_DATA = [
    "Last 30 days: After analyzing 1,247 recent reviews, 96% satisfaction rate with 23% increase in positive mentions",
    "Recent Trends (30 days): Creatine HCL Pro leads with 98% satisfaction, Fat Burner Pro shows 15% improvement",
    "Weekly Review Volume: 312 reviews/week average, highest engagement on Whey Protein and Pre-Workout",
    "Recent Complaints (30 days): Shipping delays mentioned in 4% of reviews, flavor requests up 18%",
    "New Product Feedback: Recovery BCAA+ received 156 reviews in 30 days, 92% recommend to others",
    "Seasonal Review Patterns: Summer prep products show 34% more reviews, recovery products stable"
]

SENTIMENT_ANALYSIS_DATA = [
    "Positive Sentiment Trends: Energy boost (89%), muscle building results (84%), value for money (76%)",
    "Neutral Feedback Areas: Packaging design (neutral 67%), flavor variety (neutral 45%)",
    "Negative Sentiment Patterns: Price point concerns (11%), shipping delays during holidays (4%)",
    "Customer Loyalty Indicators: 73% mention repeat purchases, 68% recommend to friends",
    "Product Effectiveness: 87% report achieving fitness goals, 91% would purchase again",
    "Service Experience: 97% rate customer service positively, 94% satisfied with shipping speed"
]

PRODUCT_INSIGHTS_DATA = [
    "Whey Protein: Customers love vanilla flavor (78% preference), request more fruity options (34%)",
    "Creatine: Unflavored preferred (89%), easy mixing highly valued (92% positive mentions)",
    "Pre-Workout: Blue raspberry most popular (67%), tropical flavors requested (29%)",
    "BCAA: Recovery benefits most mentioned (84%), timing flexibility appreciated (71%)",
    "Fat Burner: Appetite control most effective feature (76% mention), energy without jitters (69%)",
    "Sleep Recovery: Sleep quality improvement in 93% of reviews, no grogginess mentioned (81%)"
]

# Create agent instance
agent = BaseRAGAgent(
    name="review_synthesis",
    system_prompt=REVIEW_SYNTHESIS_PROMPT
)

# Load data into vector store
agent.add_documents(REVIEW_SYNTHESIS_DATA + TIME_RELEVANT_REVIEW_DATA + SENTIMENT_ANALYSIS_DATA + PRODUCT_INSIGHTS_DATA)

# Create and export the graph
graph = agent.build_graph() 