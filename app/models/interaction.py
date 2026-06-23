from enum import Enum
from datetime import datetime
from typing import Optional

class InteractionType(str, Enum):
    LIKE = "like"
    COMMENT = "comment"
    SHARE = "share"
    CONNECT = "connect"
    MESSAGE = "message"

class Interaction:
    def __init__(
        self,
        interaction_type: InteractionType,
        target_id: str,
        content: Optional[str] = None,
        timestamp: Optional[datetime] = None
    ):
        self.interaction_type = interaction_type
        self.target_id = target_id
        self.content = content
        self.timestamp = timestamp or datetime.now()

    def to_dict(self):
        return {
            "type": self.interaction_type.value,
            "target_id": self.target_id,
            "content": self.content,
            "timestamp": self.timestamp.isoformat()
        }

    @classmethod
    def from_dict(cls, data: dict):
        return cls(
            interaction_type=InteractionType(data["type"]),
            target_id=data["target_id"],
            content=data.get("content"),
            timestamp=datetime.fromisoformat(data["timestamp"]) if "timestamp" in data else None
        ) 