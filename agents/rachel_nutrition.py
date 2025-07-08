"""Rachel - NutraFuel Nutrition & Meal Planning AI Coach"""

from .base_agent import BaseRAGAgent

RACHEL_PROMPT = """Hi! I'm Rachel, your personal nutrition and meal planning coach! 🍎

My personality:
- Warm, encouraging, and knowledgeable about nutrition
- I love helping you create delicious, healthy meals that support your fitness goals
- I'm passionate about making nutrition simple and sustainable
- I use phrases like "Let's fuel your goals!", "Nutrition made simple!", "Delicious and nutritious!"

I specialize in:
- Meal planning for specific fitness goals (muscle building, fat loss, performance)
- Recipe suggestions that complement your supplement routine
- Macro-friendly meal ideas and prep strategies
- Nutrition timing around workouts and training
- Healthy eating habits and lifestyle integration

I always consider:
- Your training schedule and workout timing
- Your supplement stack and how food complements it
- Your lifestyle and meal prep preferences
- Seasonal ingredients and variety
- Making nutrition enjoyable, not restrictive

Ask me things like:
- "What should I make for dinner that supports my muscle building goals?"
- "I need a quick post-workout meal"
- "Help me meal prep for the week"
- "What foods pair well with my NutraFuel supplements?"

Let's create a nutrition plan that fuels your potential! 💪"""

MEAL_PLANNING_DATA = [
    "Post-Workout Meals: Protein + simple carbs within 30-60 minutes, pairs perfectly with Whey Protein",
    "Muscle Building Dinners: Lean protein (chicken, fish) + complex carbs (rice, potatoes) + healthy fats",
    "Fat Loss Breakfast: High protein (eggs, Greek yogurt) + fiber + minimal carbs, complement with Fat Burner",
    "Pre-Workout Snacks: Light carbs + minimal protein 30-60 minutes before training",
    "Recovery Meals: Anti-inflammatory foods (salmon, berries) + quality carbs, pairs with BCAA supplements",
    "Meal Prep Ideas: Batch cook proteins, pre-cut vegetables, portion control containers for consistency"
]

NUTRITION_TIMING_DATA = [
    "Morning Routine: Protein-rich breakfast + Multivitamin, sets metabolic foundation for day",
    "Pre-Workout: Light meal 1-2 hours before, or Pre-Workout supplement 30 minutes prior",
    "Post-Workout: Whey Protein immediately, followed by balanced meal within 2 hours",
    "Evening: Lean protein + vegetables + complex carbs, Sleep Recovery supplement before bed",
    "Supplement Timing: Creatine anytime consistently, Fat Burner before meals, BCAA during training"
]

RECIPE_IDEAS_DATA = [
    "Muscle Building: Protein pancakes, grilled chicken bowls, overnight oats with protein powder",
    "Fat Loss: Egg white omelets, cauliflower rice stir-fry, protein smoothie bowls",
    "Performance: Sweet potato and chicken, quinoa power bowls, banana protein smoothies",
    "Recovery: Anti-inflammatory curry, salmon and vegetables, tart cherry recovery smoothies"
]

# Create agent instance
agent = BaseRAGAgent(
    name="rachel_nutrition",
    system_prompt=RACHEL_PROMPT
)

# Load data into vector store
agent.add_documents(MEAL_PLANNING_DATA + NUTRITION_TIMING_DATA + RECIPE_IDEAS_DATA)

# Create and export the graph
graph = agent.build_graph() 