"""
chunker.py
----------
Step 1 of the RAG pipeline: generate text chunks from the CV JSON source.

Each chunk contains:
  - id   : stable identifier, derived from the JSON source id
  - text : neutral structured text ready to be embedded
  - meta : payload stored in Qdrant (for filtering, ranking, citation)

Chunking strategy:
  - 1 chunk for basics (global profile)
  - 1 chunk per keyAchievement
  - 1 chunk per skill group
  - 1 main chunk per role (with parent context injected in text)
  - 1 chunk per highlight for roles with >= 4 highlights
  - 1 chunk per project (implementedFeatures vs plannedFeatures distinguished)
  - 1 chunk per education entry
  - 1 global chunk for languages
"""

import json
from dataclasses import dataclass, field
from pathlib import Path

# ---------------------------------------------------------------------------
# Chunk dataclass
# ---------------------------------------------------------------------------


@dataclass
class Chunk:
    id: str
    text: str
    meta: dict = field(default_factory=dict)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _format_date(date: str | None, is_current: bool = False) -> str | None:
    """
    Format a partial ISO date string into readable text.
    "2023-11"  ->  "11/2023"
    is_current ->  "present"
    None       ->  None (caller decides whether to include the field)
    """
    if is_current:
        return "present"
    if date is None:
        return None
    parts = date.split("-")
    if len(parts) == 2:
        return f"{parts[1]}/{parts[0]}"
    return date


def _join(items: list[str], sep: str = ", ") -> str:
    """Join a list into a single string. Returns empty string if list is empty."""
    return sep.join(items) if items else ""


# ---------------------------------------------------------------------------
# Chunk generators — one function per JSON section
# ---------------------------------------------------------------------------


def chunk_basics(basics: dict) -> list[Chunk]:
    """
    1 chunk for the global profile.
    Contains: name, headline, summary, location, seniority, target roles, tags.
    """
    target_roles = _join(basics.get("targetRoles", []))
    tags = _join(basics.get("tags", []))

    text = (
        f"profile_name: {basics['fullName']}\n"
        f"headline: {basics['headline']}\n"
        f"location: {basics.get('location', '')}\n"
        f"years_of_experience: {basics.get('yearsOfExperience', '')}\n"
        f"seniority: {basics.get('seniority', '')}\n"
        f"target_roles: {target_roles}\n"
        f"core_skills: {tags}\n"
        f"summary: {basics['summary']}"
    )

    return [
        Chunk(
            id=f"chunk-{basics['id']}",
            text=text,
            meta={
                "section": "basics",
                "fullName": basics["fullName"],
                "seniority": basics.get("seniority"),
                "yearsOfExperience": basics.get("yearsOfExperience"),
                "tags": basics.get("tags", []),
                "citationLabel": basics["fullName"],
            },
        )
    ]


def chunk_key_achievements(achievements: list[str]) -> list[Chunk]:
    """
    1 chunk per keyAchievement.
    Each sentence is self-contained and does not need parent context.
    """
    chunks = []
    for i, achievement in enumerate(achievements):
        # Truncate to first 60 characters for a readable citation label
        short = achievement[:60].rstrip() + ("…" if len(achievement) > 60 else "")
        chunks.append(
            Chunk(
                id=f"chunk-key-achievement-{i}",
                text=f"key_achievement: {achievement}",
                meta={
                    "section": "keyAchievements",
                    "index": i,
                    "citationLabel": f"Key achievement — {short}",
                },
            )
        )
    return chunks


def chunk_skills(skills: list[dict]) -> list[Chunk]:
    """
    1 chunk per skill group.
    Aliases are injected into the text to improve retrieval coverage.
    Example: "TypeScript (alias: TS)" ensures a query containing "TS" matches this chunk.
    """
    chunks = []
    for group in skills:
        lines = []
        for item in group.get("items", []):
            name = item["name"]
            aliases = item.get("aliases", [])
            level = item.get("level", "")
            years = item.get("yearsApprox")

            line = name
            if aliases:
                line += f" (alias: {_join(aliases)})"
            if level:
                line += f" | level: {level}"
            if years:
                line += f" | ~{years} years"
            lines.append(line)

        text = f"skill_category: {group['category']}\n" + "\n".join(f"- {line}" for line in lines)

        chunks.append(
            Chunk(
                id=f"chunk-{group['id']}",
                text=text,
                meta={
                    "section": "skills",
                    "category": group["category"],
                    "skills": [item["name"] for item in group.get("items", [])],
                    "citationLabel": f"Skills – {group['category']}",
                },
            )
        )
    return chunks


def chunk_experience(experience: list[dict]) -> list[Chunk]:
    """
    For each role:
      - 1 main chunk (full context + summary + all highlights)
      - 1 chunk per highlight for roles with >= 4 highlights

    Parent context (company, sector, location) is injected into every chunk
    because the LLM only sees the chunk text, not the JSON hierarchy.

    Date fields are omitted from the text when their value is unknown,
    to avoid exposing incomplete data to the LLM.
    """
    chunks = []

    for company_entry in experience:
        company = company_entry["company"]
        sector = company_entry.get("sector", "")
        location = company_entry.get("location", "")

        for role in company_entry.get("roles", []):
            role_id = role["id"]
            title = role["title"]
            client = role.get("client")
            start = _format_date(role.get("startDate"))
            end = _format_date(role.get("endDate"), is_current=role.get("isCurrent", False))
            level = role.get("level", "")
            team_size = role.get("teamSize")
            summary = role.get("summary", "")
            highlights = role.get("highlights", [])
            responsibility_areas = role.get("responsibilityAreas", [])
            business_domains = role.get("businessDomains", [])
            tags = role.get("tags", [])

            # Build context block — omit date line if both dates are unknown
            context_lines = [f"company: {company}"]
            if client:
                context_lines.append(f"client: {client}")
            context_lines.append(f"sector: {sector}")
            context_lines.append(f"location: {location}")
            context_lines.append(f"role_title: {title}")

            if start or end:
                period = " – ".join(filter(None, [start, end]))
                context_lines.append(f"period: {period}")

            context_lines.append(f"level: {level}")

            if team_size:
                context_lines.append(f"team_size: {team_size}")

            context_block = "\n".join(context_lines)

            # Citation label used in RAG responses to identify the source
            citation = f"{title} — {company}"
            if client:
                citation += f" / {client}"

            # Metadata shared by all chunks of this role
            role_meta = {
                "section": "experience",
                "company": company,
                "client": client,
                "sector": sector,
                "title": title,
                "level": level,
                "isCurrent": role.get("isCurrent", False),
                "startDate": role.get("startDate"),
                "endDate": role.get("endDate"),
                "tags": tags,
                "responsibilityAreas": responsibility_areas,
                "businessDomains": business_domains,
                "citationLabel": citation,
            }

            # -- Main role chunk
            highlights_text = "\n".join(f"- {h}" for h in highlights)

            main_text = (
                f"{context_block}\n"
                f"summary: {summary}\n"
                f"responsibility_areas: {_join(responsibility_areas)}\n"
                f"business_domains: {_join(business_domains)}\n"
                f"tags: {_join(tags)}\n"
                f"highlights:\n{highlights_text}"
            )

            chunks.append(
                Chunk(
                    id=f"chunk-{role_id}-main",
                    text=main_text,
                    meta={**role_meta, "chunkType": "role-main"},
                )
            )

            # -- Highlight chunks (only for content-rich roles)
            if len(highlights) >= 4:
                for i, highlight in enumerate(highlights):
                    highlight_text = f"{context_block}\nspecific_achievement: {highlight}"
                    chunks.append(
                        Chunk(
                            id=f"chunk-{role_id}-highlight-{i}",
                            text=highlight_text,
                            meta={
                                **role_meta,
                                "chunkType": "role-highlight",
                                "highlightIndex": i,
                            },
                        )
                    )

    return chunks


def chunk_projects(projects: list[dict]) -> list[Chunk]:
    """
    1 chunk per project.
    implementedFeatures and plannedFeatures are clearly distinguished
    to prevent the LLM from confusing what is done with what is planned.
    """
    chunks = []
    for project in projects:
        highlights = project.get("highlights", [])
        implemented = project.get("implementedFeatures", [])
        planned = project.get("plannedFeatures", [])
        tags = project.get("tags", [])

        text = (
            f"project_name: {project['name']}\n"
            f"role: {project.get('role', '')}\n"
            f"status: {project.get('status', '')}\n"
            f"summary: {project.get('summary', '')}\n"
            f"tags: {_join(tags)}\n"
            f"highlights:\n" + "\n".join(f"- {h}" for h in highlights)
        )

        if implemented:
            text += "\nimplemented_features:\n" + "\n".join(f"- {f}" for f in implemented)
        if planned:
            text += "\nplanned_features (not yet implemented):\n" + "\n".join(
                f"- {f}" for f in planned
            )

        chunks.append(
            Chunk(
                id=f"chunk-{project['id']}",
                text=text,
                meta={
                    "section": "projects",
                    "name": project["name"],
                    "status": project.get("status"),
                    "tags": tags,
                    "hasPlannedFeatures": bool(planned),
                    "citationLabel": project["name"],
                },
            )
        )
    return chunks


def chunk_education(education: list[dict]) -> list[Chunk]:
    """1 chunk per education entry."""
    chunks = []
    for edu in education:
        text = (
            f"degree: {edu['degree']}\n"
            f"field: {edu.get('field', '')}\n"
            f"institution: {edu['institution']}\n"
            f"year: {edu.get('endDate', '')}"
        )
        note = edu.get("note", "")
        if note:
            text += f"\nnote: {note}"

        chunks.append(
            Chunk(
                id=f"chunk-{edu['id']}",
                text=text,
                meta={
                    "section": "education",
                    "institution": edu["institution"],
                    "degree": edu["degree"],
                    "endDate": edu.get("endDate"),
                    "citationLabel": f"{edu['degree']} — {edu['institution']}",
                },
            )
        )
    return chunks


def chunk_languages(languages: list[dict]) -> list[Chunk]:
    """1 global chunk for all languages."""
    lines = [f"- {lang['name']}: {lang['level']}" for lang in languages]
    text = "languages:\n" + "\n".join(lines)

    return [
        Chunk(
            id="chunk-languages",
            text=text,
            meta={
                "section": "languages",
                "languages": [lang["name"] for lang in languages],
                "citationLabel": "Languages",
            },
        )
    ]


# ---------------------------------------------------------------------------
# Main orchestrator
# ---------------------------------------------------------------------------


def generate_chunks(cv: dict) -> list[Chunk]:
    """
    Entry point of the chunker.
    Receives the full CV dict and returns all generated chunks.
    """
    chunks: list[Chunk] = []

    chunks += chunk_basics(cv["basics"])
    chunks += chunk_key_achievements(cv.get("keyAchievements", []))
    chunks += chunk_skills(cv.get("skills", []))
    chunks += chunk_experience(cv.get("experience", []))
    chunks += chunk_projects(cv.get("projects", []))
    chunks += chunk_education(cv.get("education", []))
    chunks += chunk_languages(cv.get("languages", []))

    return chunks


# ---------------------------------------------------------------------------
# Local test script — run with: python chunker.py
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    cv_path = Path(__file__).resolve().parent.parent.parent / "data" / "cv" / "cv.fr.json"

    if not cv_path.exists():
        print(f"[ERROR] JSON not found: {cv_path}")
        exit(1)

    with cv_path.open("r", encoding="utf-8") as f:
        cv_data = json.load(f)

    chunks = generate_chunks(cv_data)

    print(f"\n✅ {len(chunks)} chunks generated\n")
    print("=" * 60)

    for chunk in chunks:
        preview = "\n    ".join(chunk.text.splitlines()[:3])
        print(f"\n[{chunk.id}]")
        print(
            f"  section  : {chunk.meta.get('section')} | type: {chunk.meta.get('chunkType', '-')}"
        )
        print(f"  citation : {chunk.meta.get('citationLabel', '-')}")
        print(f"  preview  :\n    {preview}")
        print("-" * 60)


# exo 7
def greet(name: str | None) -> str:
    return "Hello anonymous" if name is None else f"Hello {name}"


# exo 8
def find_user_by_name(users: list[dict], name: str) -> dict | None:
    for user in users:
        if user["name"] == name:
            return user
    return None


# exo 10
class Product:
    def __init__(self, name: str, price: float, quantity: int):
        self.name = name
        self.price = price
        self.quantity = quantity

    def total_price(self) -> float:
        return self.price >= self.quantity


# exo 11
def get_adult_users(users: list[dict]) -> list[dict]:
    userReturn = []
    for user in users:
        if user["age"] >= 18:
            userReturn.append(user)
    return userReturn


# exo 12
def safe_divide(a: float, b: float) -> float | None:
    return None if b == 0 else a / b


# exo 13
class BankAccount:
    def __init__(self, owner: str, balance: float):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount: float) -> None:
        self.balance = self.balance + amount

    def withdraw(self, amount: float) -> bool:
        if self.balance > amount:
            self.balance = self.balance - amount
            return True
        else:
            return False
