from fastapi import APIRouter, HTTPException

from app.domains.investing.providers.sec_provider import SECProvider
from app.domains.investing.schemas.fundamentals import CompanyFundamentals
from app.domains.investing.services.fundamentals_service import (
    get_company_fundamentals,
)

router = APIRouter()


@router.get("/investing/{ticker}/fundamentals", response_model=CompanyFundamentals)
def get_fundamentals(ticker: str) -> CompanyFundamentals:
    try:
        return get_company_fundamentals(ticker=ticker)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.get("/investing/{ticker}/fundamentals/debug/dei-keys")
def get_dei_keys(ticker: str) -> dict:
    try:
        provider = SECProvider()
        company = provider.get_company_by_ticker(ticker)
        cik = str(company["cik_str"])
        raw_data = provider.get_company_facts(cik)

        dei_facts = raw_data.get("facts", {}).get("dei", {})

        return {
            "ticker": ticker.upper().strip(),
            "cik": cik,
            "dei_keys": sorted(dei_facts.keys()),
        }
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.get("/investing/{ticker}/fundamentals/debug/us-gaap-keys")
def get_us_gaap_keys(ticker: str) -> dict:
    try:
        provider = SECProvider()
        company = provider.get_company_by_ticker(ticker)
        cik = str(company["cik_str"])
        raw_data = provider.get_company_facts(cik)

        us_gaap_facts = raw_data.get("facts", {}).get("us-gaap", {})

        return {
            "ticker": ticker.upper().strip(),
            "cik": cik,
            "us_gaap_keys": sorted(us_gaap_facts.keys()),
        }
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
