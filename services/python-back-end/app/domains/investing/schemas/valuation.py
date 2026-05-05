from pydantic import BaseModel


class ScenarioPrices(BaseModel):
    bear: float
    base: float
    bull: float


class BuyZones(BaseModel):
    strong_buy_below: float
    buy_below: float
    neutral_below: float
    expensive_above: float


class ValuationResponse(BaseModel):
    ticker: str
    current_price: float
    revenue: float
    net_income: float
    shares_outstanding: float
    scenarios: ScenarioPrices
    buy_zones: BuyZones
