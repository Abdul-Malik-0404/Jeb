import asyncio
import random
from typing import List, Dict
from playwright.async_api import async_playwright, Page

class StealthScraper:
    """Base class for scrapers with stealth capabilities."""
    
    USER_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
    ]

    async def human_delay(self, min_sec=1, max_sec=3):
        await asyncio.sleep(random.uniform(min_sec, max_sec))

    async def scroll_page(self, page: Page):
        """Simulate human-like scrolling."""
        for _ in range(random.randint(3, 7)):
            await page.mouse.wheel(0, random.randint(300, 700))
            await self.human_delay(0.5, 1.5)

class TopJobsScraper(StealthScraper):
    """Specific scraper for TopJobs.lk (Sri Lanka)."""
    
    BASE_URL = "http://www.topjobs.lk"

    async def search_jobs(self, query: str) -> List[Dict]:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent=random.choice(self.USER_AGENTS),
                viewport={'width': 1920, 'height': 1080}
            )
            page = await context.new_page()
            
            # Navigate to TopJobs
            await page.goto(self.BASE_URL)
            await self.human_delay(2, 4)
            
            # TopJobs uses a complex frame/table structure. 
            # This is a placeholder for actual extraction logic which we will refine.
            # For now, we simulate finding jobs for the requested query.
            
            # Note: In a real scenario, we'd navigate the search filters.
            # For this prototype phase, we'll return mock structured data 
            # that looks like actual results to verify the pipeline.
            
            jobs = [
                {
                    "title": f"{query} - Senior Role",
                    "company": "Lanka Tech Solutions",
                    "description": "Looking for a skilled developer in Colombo. Knowledge of Python and React is a plus.",
                    "url": "http://www.topjobs.lk/job/1"
                },
                {
                    "title": f"Junior {query}",
                    "company": "Island Software",
                    "description": "Great opportunity for freshers. Must be based in Sri Lanka.",
                    "url": "http://www.topjobs.lk/job/2"
                }
            ]
            
            await browser.close()
            return jobs

async def run_scraper(query: str = "Software Engineer"):
    scraper = TopJobsScraper()
    results = await scraper.search_jobs(query)
    return results

if __name__ == "__main__":
    results = asyncio.run(run_scraper())
    print(results)
