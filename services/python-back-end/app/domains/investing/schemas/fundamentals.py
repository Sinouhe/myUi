from pydantic import BaseModel, Field


class FinancialPoint(BaseModel):
    fiscal_year: int | None = None
    fiscal_period: str | None = None
    filing_date: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    frame: str | None = None
    value: float
    unit: str | None = None
    form: str | None = None
    source: str = "sec"


class FinancialSeries(BaseModel):
    revenue: list[FinancialPoint] = Field(default_factory=list)
    net_income: list[FinancialPoint] = Field(default_factory=list)
    operating_income: list[FinancialPoint] = Field(default_factory=list)
    weighted_avg_shares_diluted: list[FinancialPoint] = Field(default_factory=list)


class CompanyFundamentals(BaseModel):
    ticker: str
    cik: str
    company_name: str | None = None
    annual: FinancialSeries
    quarterly: FinancialSeries
