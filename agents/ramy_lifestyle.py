"""Ramy - NutraFuel Style & Lifestyle AI Coach"""

from .base_agent import BaseRAGAgent

RAMY_PROMPT = """Hey there! I'm Ramy, your personal style and lifestyle coach! 👔

My personality:
- Confident, stylish, and always on-trend
- I help you look and feel your best in any situation
- Passionate about fitness fashion and lifestyle optimization
- I use phrases like "Let's elevate your style!", "Confidence starts with how you feel!", "Look good, feel great!"

I specialize in:
- Workout apparel and athletic fashion
- Professional and casual styling advice
- Event and occasion outfit planning
- Fitness lifestyle and confidence building
- Grooming and personal presentation tips

I always consider:
- Your body type and personal style preferences
- The occasion and dress code requirements
- Your fitness goals and active lifestyle
- Comfort and functionality alongside style
- Budget-friendly options and investment pieces

Ask me things like:
- "What should I wear to this weekend's cocktail party?"
- "I need gym outfit inspiration"
- "Help me dress for a business meeting"
- "What's the best athletic wear for my workout style?"

Let's make sure you look and feel confident in every situation! ✨"""

STYLE_ADVICE_DATA = [
    "Cocktail Party: Smart casual blazer + dark jeans + dress shoes, shows confidence and style",
    "Gym Fashion: Fitted athletic wear in coordinating colors, proper footwear for your workout type",
    "Business Meeting: Well-fitted suit or blazer, quality shoes, minimal accessories for professional look",
    "Casual Weekend: Comfortable athleisure or relaxed fit clothes that still look put-together",
    "Date Night: Something that makes you feel confident, fits well, appropriate for the venue",
    "Beach/Pool: Well-fitted swimwear, UV protection, comfortable sandals and accessories"
]

LIFESTYLE_OPTIMIZATION_DATA = [
    "Morning Routine: Start with exercise, good grooming habits, dress for the day you want to have",
    "Confidence Building: Posture matters, proper fit is key, invest in quality basics",
    "Fitness Fashion: Choose athletic wear that motivates you, proper support and functionality first",
    "Personal Grooming: Consistent skincare, well-groomed appearance, attention to details",
    "Color Coordination: Choose colors that complement your skin tone, create cohesive outfits",
    "Wardrobe Essentials: Quality basics, versatile pieces, items that work for multiple occasions"
]

FITNESS_LIFESTYLE_DATA = [
    "Athletic Wear: Moisture-wicking fabrics, proper fit for movement, colors that energize you",
    "Recovery Style: Comfortable loungewear for rest days, promotes relaxation and recovery",
    "Active Lifestyle: Clothes that transition from gym to casual, versatile and functional",
    "Motivation Fashion: Wear outfits that make you feel strong and confident during workouts"
]

# Create agent instance
agent = BaseRAGAgent(
    name="ramy_lifestyle",
    system_prompt=RAMY_PROMPT
)

# Load data into vector store
agent.add_documents(STYLE_ADVICE_DATA + LIFESTYLE_OPTIMIZATION_DATA + FITNESS_LIFESTYLE_DATA)

# Create and export the graph
graph = agent.build_graph() 