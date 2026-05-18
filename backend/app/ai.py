import os
import json
import google.generativeai as genai
from typing import List, Dict, Optional

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

class AIEngine:
    def __init__(self, model_name: str = "gemini-3-flash-preview"):
        self.model = genai.GenerativeModel(model_name)

    async def extract_skills(self, text: str) -> List[str]:
        """Extract required skills from a job description."""
        prompt = f"""
        Extract a list of key technical and soft skills required in the following job description.
        Return ONLY a comma-separated list of skills.
        
        Job Description:
        {text}
        """
        response = self.model.generate_content(prompt)
        skills = [s.strip() for s in response.text.split(",")]
        return skills

    async def calculate_match_score(self, jd_skills: List[str], cv_text: str) -> float:
        """
        Calculate a match score based on skills found in CV vs required in JD.
        Match Score = (Skills Found / Skills Required) * 100
        """
        prompt = f"""
        Given the following list of required skills and a candidate's CV, identify which of the required skills are present in the CV.
        Return ONLY the number of skills found.
        
        Required Skills: {", ".join(jd_skills)}
        
        CV Content:
        {cv_text}
        """
        response = self.model.generate_content(prompt)
        try:
            skills_found = int(response.text.strip())
            score = (skills_found / len(jd_skills)) * 100 if jd_skills else 0
            return min(score, 100.0)
        except:
            return 0.0

    async def tailor_resume(self, master_cv: str, job_description: str) -> str:
        """
        Rewrite CV bullet points to emphasize matching skills without fabricating experience.
        Returns HTML content for the tailored CV.
        """
        prompt = f"""
        You are an expert resume writer. Tailor the following Master CV to match the Job Description.
        
        Constraints:
        1. Emphasize matching skills and experiences.
        2. DO NOT fabricate any new experience or facts.
        3. Use a clean, ATS-friendly HTML format.
        4. Use only <div>, <p>, <h1>, <h2>, and <ul>/<li> tags. No complex CSS or grids.
        5. Return ONLY the HTML body content.

        Master CV:
        {master_cv}

        Job Description:
        {job_description}
        """
        response = self.model.generate_content(prompt)
        return response.text
