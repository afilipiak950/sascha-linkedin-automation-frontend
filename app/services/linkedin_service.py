from typing import List, Optional
from datetime import datetime
from playwright.sync_api import sync_playwright
from ..models.interaction import Interaction, InteractionType

class LinkedInService:
    def __init__(self, email: str, password: str):
        self.email = email
        self.password = password
        self.browser = None
        self.page = None

    def login(self):
        with sync_playwright() as p:
            self.browser = p.chromium.launch(headless=True)
            self.page = self.browser.new_page()
            self.page.goto('https://www.linkedin.com/login')
            self.page.fill('input[id="username"]', self.email)
            self.page.fill('input[id="password"]', self.password)
            self.page.click('button[type="submit"]')
            self.page.wait_for_load_state('networkidle')

    def perform_interaction(self, interaction: Interaction) -> bool:
        if not self.page:
            self.login()
        
        try:
            if interaction.interaction_type == InteractionType.LIKE:
                return self._like_post(interaction.target_id)
            elif interaction.interaction_type == InteractionType.COMMENT:
                return self._comment_on_post(interaction.target_id, interaction.content)
            elif interaction.interaction_type == InteractionType.CONNECT:
                return self._send_connection_request(interaction.target_id, interaction.content)
            elif interaction.interaction_type == InteractionType.MESSAGE:
                return self._send_message(interaction.target_id, interaction.content)
            return False
        except Exception as e:
            print(f"Error performing interaction: {str(e)}")
            return False

    def _like_post(self, post_id: str) -> bool:
        try:
            self.page.goto(f'https://www.linkedin.com/feed/update/{post_id}')
            self.page.click('button[aria-label="Like"]')
            return True
        except Exception:
            return False

    def _comment_on_post(self, post_id: str, comment: str) -> bool:
        try:
            self.page.goto(f'https://www.linkedin.com/feed/update/{post_id}')
            self.page.click('button[aria-label="Comment"]')
            self.page.fill('div[role="textbox"]', comment)
            self.page.keyboard.press('Enter')
            return True
        except Exception:
            return False

    def _send_connection_request(self, profile_id: str, message: Optional[str] = None) -> bool:
        try:
            self.page.goto(f'https://www.linkedin.com/in/{profile_id}')
            self.page.click('button[aria-label="Connect"]')
            if message:
                self.page.click('button[aria-label="Add a note"]')
                self.page.fill('textarea[id="custom-message"]', message)
            self.page.click('button[aria-label="Send now"]')
            return True
        except Exception:
            return False

    def _send_message(self, profile_id: str, message: str) -> bool:
        try:
            self.page.goto(f'https://www.linkedin.com/in/{profile_id}')
            self.page.click('button[aria-label="Message"]')
            self.page.fill('div[role="textbox"]', message)
            self.page.keyboard.press('Enter')
            return True
        except Exception:
            return False

    def close(self):
        if self.browser:
            self.browser.close()
            self.browser = None
            self.page = None 