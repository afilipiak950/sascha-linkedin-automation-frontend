from typing import Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

class AgentConfig:
    LINKEDIN_EMAIL = os.getenv("LINKEDIN_EMAIL", "")
    LINKEDIN_PASSWORD = os.getenv("LINKEDIN_PASSWORD", "")
    
    # Interaktionslimits
    DAILY_INTERACTION_LIMIT = 50
    HOURLY_INTERACTION_LIMIT = 10
    
    # Wartezeiten (in Sekunden)
    MIN_DELAY_BETWEEN_ACTIONS = 30
    MAX_DELAY_BETWEEN_ACTIONS = 120
    
    # Post-Generierung
    POST_MIN_LENGTH = 100
    POST_MAX_LENGTH = 1300
    
    # Networking
    MAX_CONNECTION_REQUESTS_PER_DAY = 25
    CONNECTION_MESSAGE_TEMPLATES = [
        "Hallo {name}, ich finde Ihr Profil sehr interessant und würde mich gerne vernetzen.",
        "Hi {name}, ich sehe, dass wir ähnliche Interessen im Bereich {industry} haben. Lass uns connecten!",
        "Guten Tag {name}, ich würde mich freuen, wenn wir uns beruflich austauschen könnten."
    ]
    
    # Interaktions-Strategien
    INTERACTION_WEIGHTS: Dict[str, float] = {
        "like": 0.5,
        "comment": 0.3,
        "connect": 0.15,
        "message": 0.05
    }
    
    @classmethod
    def validate(cls) -> bool:
        """Überprüft, ob alle notwendigen Konfigurationswerte vorhanden sind"""
        required_fields = ["LINKEDIN_EMAIL", "LINKEDIN_PASSWORD"]
        return all(getattr(cls, field) for field in required_fields)
    
    @classmethod
    def get_config(cls) -> Dict[str, Any]:
        """Gibt die Konfiguration als Dictionary zurück"""
        return {
            "linkedin": {
                "email": cls.LINKEDIN_EMAIL,
                "password": cls.LINKEDIN_PASSWORD,
                "daily_limit": cls.DAILY_INTERACTION_LIMIT,
                "hourly_limit": cls.HOURLY_INTERACTION_LIMIT
            },
            "timing": {
                "min_delay": cls.MIN_DELAY_BETWEEN_ACTIONS,
                "max_delay": cls.MAX_DELAY_BETWEEN_ACTIONS
            },
            "posts": {
                "min_length": cls.POST_MIN_LENGTH,
                "max_length": cls.POST_MAX_LENGTH
            },
            "networking": {
                "max_connections_per_day": cls.MAX_CONNECTION_REQUESTS_PER_DAY,
                "message_templates": cls.CONNECTION_MESSAGE_TEMPLATES
            },
            "strategy": {
                "interaction_weights": cls.INTERACTION_WEIGHTS
            }
        } 