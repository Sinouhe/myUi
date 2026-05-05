from app.domains.investing.normalizers.sec_normalizer import normalize_company_facts
from app.domains.investing.providers.sec_provider import SECProvider
from app.domains.investing.schemas.fundamentals import CompanyFundamentals


def get_company_fundamentals(ticker: str) -> CompanyFundamentals:
    provider = SECProvider()
    company = provider.get_company_by_ticker(ticker)
    cik = str(company["cik_str"])
    raw_data = provider.get_company_facts(cik)

    return normalize_company_facts(
        ticker=ticker,
        raw_data=raw_data,
    )
