import os
import openai
from dotenv import load_dotenv

load_dotenv()

class OpenAIService:
    def __init__(self):
        self.api_key = os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            print("Warning: OPENAI_API_KEY not found")
        else:
            openai.api_key = self.api_key

    def ask_fleet_question(self, question, fleet_context):
        if not self.api_key:
            return "AI service is not configured (missing API key)."

        prompt = f"""
        You are an AI assistant for a fleet management system.
        
        Current Fleet Context:
        {fleet_context}

        User Question: {question}

        Answer concisely and professionally.
        """

        try:
            # Using new Client API if available or fallback (mock for now if no key)
            client = openai.OpenAI(api_key=self.api_key)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful fleet management assistant."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=150
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"OpenAI Error: {e}")
            # Fallback for demo purposes if quota exceeded or other error
            if "insufficient_quota" in str(e) or "429" in str(e):
                return "[DEMO MODE] OpenAI quota exceeded. Mock response: Vehicle maintenance schedule updated. Vehicle V-101 requires oil change."
            return "I apologize, but I cannot process your request at the moment."
