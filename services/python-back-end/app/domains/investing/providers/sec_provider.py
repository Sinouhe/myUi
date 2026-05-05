import httpx


class SECProvider:
    BASE_URL = "https://data.sec.gov"
    TICKERS_URL = "https://www.sec.gov/files/company_tickers.json"

    def __init__(self) -> None:
        self.headers = {
            "User-Agent": "MyUi Investing Research admin@example.com",
            "Accept-Encoding": "gzip, deflate",
        }

    def get_company_tickers(self) -> dict:
        response = httpx.get(
            self.TICKERS_URL,
            headers=self.headers,
            timeout=20.0,
        )
        response.raise_for_status()
        return response.json()

    def get_company_facts(self, cik: str) -> dict:
        padded_cik = cik.zfill(10)
        url = f"{self.BASE_URL}/api/xbrl/companyfacts/CIK{padded_cik}.json"

        response = httpx.get(
            url,
            headers=self.headers,
            timeout=20.0,
        )
        response.raise_for_status()
        return response.json()

    def get_company_by_ticker(self, ticker: str) -> dict:
        normalized_ticker = ticker.upper().strip()
        companies = self.get_company_tickers()

        for company in companies.values():
            if company["ticker"].upper() == normalized_ticker:
                return company

        raise ValueError(f"No SEC company found for ticker: {ticker}")
