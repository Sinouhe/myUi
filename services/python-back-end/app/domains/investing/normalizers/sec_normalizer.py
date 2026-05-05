from datetime import date

from app.domains.investing.schemas.fundamentals import (
    CompanyFundamentals,
    FinancialPoint,
    FinancialSeries,
)


def _parse_date(value: str | None) -> date | None:
    if not value:
        return None

    try:
        return date.fromisoformat(value)
    except ValueError:
        return None


def _duration_in_days(start_date: str | None, end_date: str | None) -> int | None:
    start = _parse_date(start_date)
    end = _parse_date(end_date)

    if not start or not end:
        return None

    return (end - start).days


def _is_quarter_duration(days: int | None) -> bool:
    if days is None:
        return False

    return 80 <= days <= 100


def _is_annual_duration(days: int | None) -> bool:
    if days is None:
        return False

    return 330 <= days <= 370


def _build_financial_points(
    facts: dict,
    taxonomy: str,
    concept_names: list[str],
    allowed_forms: set[str],
    allowed_periods: set[str],
    allowed_units: tuple[str, ...],
    duration_mode: str | None = None,
) -> list[FinancialPoint]:
    taxonomy_data = facts.get(taxonomy, {})

    for concept_name in concept_names:
        concept = taxonomy_data.get(concept_name)

        if not concept:
            continue

        units = concept.get("units", {})
        collected_points: list[FinancialPoint] = []

        for unit_name in allowed_units:
            unit_items = units.get(unit_name, [])

            for item in unit_items:
                form = item.get("form")
                fiscal_period = item.get("fp")
                value = item.get("val")
                start_date = item.get("start")
                end_date = item.get("end")
                duration_days = _duration_in_days(start_date, end_date)

                if form not in allowed_forms:
                    continue

                if fiscal_period not in allowed_periods:
                    continue

                if value is None:
                    continue

                if duration_mode == "quarter" and not _is_quarter_duration(duration_days):
                    continue

                if duration_mode == "annual" and not _is_annual_duration(duration_days):
                    continue

                collected_points.append(
                    FinancialPoint(
                        fiscal_year=item.get("fy"),
                        fiscal_period=fiscal_period,
                        filing_date=item.get("filed"),
                        start_date=start_date,
                        end_date=end_date,
                        frame=item.get("frame"),
                        value=float(value),
                        unit=unit_name,
                        form=form,
                        source="sec",
                    )
                )

        if collected_points:
            return _deduplicate_points(collected_points)

    return []


def _deduplicate_points(points: list[FinancialPoint]) -> list[FinancialPoint]:
    """
    Keep one point per end_date.
    If multiple points exist for the same end_date, keep the one with the latest filing_date.
    """
    deduped: dict[str, FinancialPoint] = {}

    for point in points:
        if not point.end_date:
            continue

        existing = deduped.get(point.end_date)

        if existing is None:
            deduped[point.end_date] = point
            continue

        existing_filing = existing.filing_date or ""
        current_filing = point.filing_date or ""

        if current_filing > existing_filing:
            deduped[point.end_date] = point

    return sorted(
        deduped.values(),
        key=lambda point: point.end_date or "",
    )


def normalize_company_facts(ticker: str, raw_data: dict) -> CompanyFundamentals:
    facts = raw_data.get("facts", {})
    cik = str(raw_data.get("cik", ""))
    company_name = raw_data.get("entityName")

    annual = FinancialSeries(
        revenue=_build_financial_points(
            facts=facts,
            taxonomy="us-gaap",
            concept_names=[
                "RevenueFromContractWithCustomerExcludingAssessedTax",
                "Revenues",
            ],
            allowed_forms={"10-K"},
            allowed_periods={"FY"},
            allowed_units=("USD",),
            duration_mode="annual",
        ),
        net_income=_build_financial_points(
            facts=facts,
            taxonomy="us-gaap",
            concept_names=[
                "NetIncomeLoss",
            ],
            allowed_forms={"10-K"},
            allowed_periods={"FY"},
            allowed_units=("USD",),
            duration_mode="annual",
        ),
        operating_income=_build_financial_points(
            facts=facts,
            taxonomy="us-gaap",
            concept_names=[
                "OperatingIncomeLoss",
            ],
            allowed_forms={"10-K"},
            allowed_periods={"FY"},
            allowed_units=("USD",),
            duration_mode="annual",
        ),
        weighted_avg_shares_diluted=_build_financial_points(
            facts=facts,
            taxonomy="us-gaap",
            concept_names=[
                "WeightedAverageNumberOfDilutedSharesOutstanding",
                "WeightedAverageNumberOfShareOutstandingBasicAndDiluted",
                "WeightedAverageNumberOfSharesOutstandingDiluted",
            ],
            allowed_forms={"10-K"},
            allowed_periods={"FY"},
            allowed_units=("shares",),
            duration_mode="annual",
        ),
    )

    quarterly = FinancialSeries(
        revenue=_build_financial_points(
            facts=facts,
            taxonomy="us-gaap",
            concept_names=[
                "RevenueFromContractWithCustomerExcludingAssessedTax",
                "Revenues",
            ],
            allowed_forms={"10-Q"},
            allowed_periods={"Q1", "Q2", "Q3"},
            allowed_units=("USD",),
            duration_mode="quarter",
        ),
        net_income=_build_financial_points(
            facts=facts,
            taxonomy="us-gaap",
            concept_names=[
                "NetIncomeLoss",
            ],
            allowed_forms={"10-Q"},
            allowed_periods={"Q1", "Q2", "Q3"},
            allowed_units=("USD",),
            duration_mode="quarter",
        ),
        operating_income=_build_financial_points(
            facts=facts,
            taxonomy="us-gaap",
            concept_names=[
                "OperatingIncomeLoss",
            ],
            allowed_forms={"10-Q"},
            allowed_periods={"Q1", "Q2", "Q3"},
            allowed_units=("USD",),
            duration_mode="quarter",
        ),
        weighted_avg_shares_diluted=_build_financial_points(
            facts=facts,
            taxonomy="us-gaap",
            concept_names=[
                "WeightedAverageNumberOfDilutedSharesOutstanding",
                "WeightedAverageNumberOfShareOutstandingBasicAndDiluted",
                "WeightedAverageNumberOfSharesOutstandingDiluted",
            ],
            allowed_forms={"10-Q"},
            allowed_periods={"Q1", "Q2", "Q3"},
            allowed_units=("shares",),
            duration_mode="quarter",
        ),
    )

    return CompanyFundamentals(
        ticker=ticker.upper().strip(),
        cik=cik,
        company_name=company_name,
        annual=annual,
        quarterly=quarterly,
    )
