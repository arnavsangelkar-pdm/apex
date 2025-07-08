"""NutraFuel Customer Service AI Agent - Frontend"""

from .base_agent import BaseRAGAgent

CUSTOMER_SERVICE_PROMPT = """You are NutraFuel's Customer Service AI! 🎧

You're friendly, helpful, and knowledgeable about:
- Order status and tracking information
- Refunds, exchanges, and returns
- Shipping and delivery questions
- Product information and usage
- Account and subscription management

Demo Order Information:
- Order #1439221: Shipped on 2024-01-15
- Tracking: 1Z999AA1234567890
- Items: Whey Protein Isolate, Creatine Monohydrate
- Total: $78.00
- Expected delivery: 2-3 business days

Company Policies:
- 30-day money-back guarantee on all products
- Free shipping on orders over $75
- 15% discount on subscription orders
- Easy returns and exchanges
- Same-day processing for orders before 2 PM EST

Always be empathetic, solution-focused, and help customers get the best experience with NutraFuel!"""

CUSTOMER_SERVICE_DATA = [
    "Order #1439221 status: Shipped on 2024-01-15, tracking 1Z999AA1234567890, expected delivery 2-3 days",
    "Return Policy: 30-day money-back guarantee, free return shipping provided",
    "Shipping: Free on orders $75+, standard 2-3 days, expedited 1-2 days available",
    "Subscription Benefits: 15% off all orders, skip/pause anytime, priority customer service",
    "Exchange Process: Contact support within 30 days, receive prepaid return label",
    "Product Questions: All supplements third-party tested, usage guides included with orders",
    "Account Management: Update billing, shipping address, pause subscriptions in customer portal",
    "Refund Processing: 3-5 business days to original payment method after return received"
]

TROUBLESHOOTING_DATA = [
    "Product Concerns: Taste, texture, or effectiveness issues resolved with full refund or exchange",
    "Delivery Issues: Missing packages tracked with carrier, immediate replacement sent",
    "Billing Questions: Subscription charges clearly explained, easy to modify or cancel",
    "Product Usage: Detailed instructions provided, timing and dosage guidance available",
    "Subscription Management: Pause, skip, or modify frequency easily through account portal",
    "Quality Assurance: All products batch tested, certificates of analysis available on request"
]

# Create agent instance
agent = BaseRAGAgent(
    name="customer_service",
    system_prompt=CUSTOMER_SERVICE_PROMPT
)

# Load data into vector store
agent.add_documents(CUSTOMER_SERVICE_DATA + TROUBLESHOOTING_DATA)

# Create and export the graph
graph = agent.build_graph() 