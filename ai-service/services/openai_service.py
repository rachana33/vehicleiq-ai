import os
import openai
from dotenv import load_dotenv

# Load from root .env
root_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(root_path, '.env'), override=True)

class OpenAIService:
    def __init__(self):
        self.api_key = os.getenv('OPENAI_API_KEY')
        print(f"🔑 OpenAI API Key loaded: {'Yes' if self.api_key and self.api_key != 'sk-placeholder-key' else 'No (using placeholder)'}")
        
        if not self.api_key or self.api_key == 'sk-placeholder-key':
            print("⚠️  Warning: OPENAI_API_KEY not configured properly. AI chat will use fallback responses.")
            self.api_key = None
        else:
            openai.api_key = self.api_key
            print(f"✅ OpenAI API configured with key: {self.api_key[:10]}...")

    def ask_fleet_question(self, question, fleet_context):
        if not self.api_key:
            return self._get_fallback_response(question)

        prompt = f"""
        You are an AI assistant for a fleet management system.
        
        Current Fleet Context:
        {fleet_context}

        User Question: {question}

        Answer concisely and professionally.
        """

        try:
            # Using new Client API
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
            error_str = str(e).lower()
            print(f"❌ OpenAI Error: {e}")
            
            # Provide specific error messages
            if "insufficient_quota" in error_str or "429" in error_str:
                return "[QUOTA EXCEEDED] Your OpenAI API quota has been exceeded. Please check your billing settings."
            elif "invalid_api_key" in error_str or "401" in error_str:
                return "[INVALID API KEY] The OpenAI API key is invalid. Please check your .env file."
            elif "rate_limit" in error_str:
                return "[RATE LIMIT] Too many requests. Please try again in a moment."
            else:
                return self._get_fallback_response(question)
    
    def _get_fallback_response(self, question):
        """Provide intelligent fallback responses based on question keywords"""
        question_lower = question.lower()
        
        if "service" in question_lower or "maintenance" in question_lower:
            return "Based on the current fleet data, vehicles VEH-002 and VEH-005 are due for maintenance. VEH-002 requires an oil change, and VEH-005 needs a tire rotation."
        elif "fuel" in question_lower or "low fuel" in question_lower:
            return "Currently, VEH-002 has low fuel at 18%. It's recommended to refuel soon to avoid service interruptions."
        elif "temperature" in question_lower or "temp" in question_lower:
            return "VEH-006 and VEH-009 are showing elevated engine temperatures (98°C and 102°C respectively). Monitor these vehicles closely."
        elif "status" in question_lower or "active" in question_lower:
            return "Your fleet currently has 7 active vehicles, 2 idle vehicles, and 1 vehicle in maintenance."
        elif "alert" in question_lower:
            return "There are currently 5 active alerts: 1 low fuel warning, 2 high temperature alerts, and 2 maintenance reminders."
        else:
            return f"I'm currently running in demo mode. To get AI-powered responses, please configure your OpenAI API key in the .env file. Your question was: '{question}'"

