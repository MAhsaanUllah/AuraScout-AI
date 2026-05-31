from sqlalchemy import Column, Integer, String, Boolean
from core.database import Base

class LeadModel(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, index=True)
    phone_number = Column(String, default="Not Found")
    is_b2b = Column(Boolean, default=False)
    industry = Column(String)
    contact_email = Column(String)
    lead_quality = Column(String, default="Unrated")
    key_offerings = Column(String) # We will store the list as a comma-separated string for simplicity
