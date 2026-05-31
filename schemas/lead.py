from pydantic import BaseModel, Field
from typing import List, Optional

class CompanyLeadData(BaseModel):
    company_name: str = Field(description="Official identity of the scraped target corporation.")
    phone_number: Optional[str] = Field(default="Not Found", description="Corporate phone number. Return 'Not Found' if missing.")
    is_b2b: bool = Field(description="True if the company is primarily Business-to-Business, False if B2C or other.")
    industry: str = Field(description="The primary industry sector of the company (e.g., IT Services, Software Development, Global Consulting).")
    contact_email: str = Field(description="Verified corporate contact email. Return empty string if missing.")
    lead_quality: str = Field(default="Unrated", description="Quality of the lead, e.g. High Quality (Prime Target) or Low (Chain Branch)")
    key_offerings: List[str] = Field(description="Key service operational pillars or products. Return empty list if missing.")