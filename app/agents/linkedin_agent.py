from typing import List, Optional
from datetime import datetime
from ..services.linkedin_service import LinkedInService
from ..models.interaction import Interaction, InteractionType

class LinkedInAgent:
    def __init__(self, email: str, password: str):
        self.service = LinkedInService(email, password)
        self.interaction_queue: List[Interaction] = []
        self.daily_interaction_limit = 50
        self.interactions_today = 0
        self.last_interaction_date = datetime.now().date()

    def reset_daily_counter(self):
        current_date = datetime.now().date()
        if current_date != self.last_interaction_date:
            self.interactions_today = 0
            self.last_interaction_date = current_date

    def can_perform_interaction(self) -> bool:
        self.reset_daily_counter()
        return self.interactions_today < self.daily_interaction_limit

    def queue_interaction(self, interaction: Interaction):
        self.interaction_queue.append(interaction)

    def process_queue(self) -> List[bool]:
        """Verarbeitet die Warteschlange und gibt eine Liste von Erfolgs-Flags zurück"""
        results = []
        while self.interaction_queue and self.can_perform_interaction():
            interaction = self.interaction_queue.pop(0)
            success = self.service.perform_interaction(interaction)
            if success:
                self.interactions_today += 1
            results.append(success)
        return results

    def like_post(self, post_id: str) -> bool:
        """Liked einen LinkedIn-Post"""
        interaction = Interaction(
            interaction_type=InteractionType.LIKE,
            target_id=post_id
        )
        if self.can_perform_interaction():
            success = self.service.perform_interaction(interaction)
            if success:
                self.interactions_today += 1
            return success
        else:
            self.queue_interaction(interaction)
            return False

    def comment_on_post(self, post_id: str, comment: str) -> bool:
        """Kommentiert einen LinkedIn-Post"""
        interaction = Interaction(
            interaction_type=InteractionType.COMMENT,
            target_id=post_id,
            content=comment
        )
        if self.can_perform_interaction():
            success = self.service.perform_interaction(interaction)
            if success:
                self.interactions_today += 1
            return success
        else:
            self.queue_interaction(interaction)
            return False

    def connect_with_user(self, profile_id: str, message: Optional[str] = None) -> bool:
        """Sendet eine Kontaktanfrage an einen LinkedIn-Nutzer"""
        interaction = Interaction(
            interaction_type=InteractionType.CONNECT,
            target_id=profile_id,
            content=message
        )
        if self.can_perform_interaction():
            success = self.service.perform_interaction(interaction)
            if success:
                self.interactions_today += 1
            return success
        else:
            self.queue_interaction(interaction)
            return False

    def send_message(self, profile_id: str, message: str) -> bool:
        """Sendet eine Nachricht an einen LinkedIn-Kontakt"""
        interaction = Interaction(
            interaction_type=InteractionType.MESSAGE,
            target_id=profile_id,
            content=message
        )
        if self.can_perform_interaction():
            success = self.service.perform_interaction(interaction)
            if success:
                self.interactions_today += 1
            return success
        else:
            self.queue_interaction(interaction)
            return False

    def close(self):
        """Schließt die Browser-Session"""
        self.service.close() 