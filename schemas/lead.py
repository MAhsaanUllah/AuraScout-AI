from pydantic import BaseModel, Field
from typing import List, Optional

class CompanyLeadData(BaseModel):
    company_name: Optional[str] = Field(default="Not Identified", description="Official identity of the scraped target corporation.")
    phone_number: Optional[str] = Field(default="Not Identified", description="Corporate phone number. Return 'Not Identified' if missing.")
    is_b2b: Optional[bool] = Field(default=False, description="True if the company is primarily Business-to-Business, False if B2C or other.")
    industry: Optional[str] = Field(default="Not Identified", description="The primary industry sector of the company (e.g., IT Services, Software Development, Global Consulting).")
    contact_email: Optional[str] = Field(default="Not Identified", description="Verified corporate contact email. Return 'Not Identified' if missing.")
    lead_quality: Optional[str] = Field(default="Unrated", description="Quality of the lead, e.g. High Quality (Prime Target) or Low (Chain Branch)")
    key_offerings: List[str] = Field(default_factory=list, description="Key service operational pillars or products. Return empty list if missing.")