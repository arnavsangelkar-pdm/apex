"""NutraFuel AI Agents"""

# Frontend Agents (Customer-facing)
from . import intelligent_search
from . import customer_service
from . import rachel_nutrition
from . import ramy_lifestyle

# Backend Agents (Admin/Internal)
from . import client_acquisition
from . import marketing_analytics
from . import campaign_optimizer
from . import review_synthesis
from . import financial_reports
from . import landing_page_generator

__all__ = [
    # Frontend Agents
    'intelligent_search',
    'customer_service', 
    'rachel_nutrition',
    'ramy_lifestyle',
    
    # Backend Agents
    'client_acquisition',
    'marketing_analytics',
    'campaign_optimizer',
    'review_synthesis',
    'financial_reports',
    'landing_page_generator'
] 