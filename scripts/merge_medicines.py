#!/usr/bin/env python3
"""Merge NEW rows from data_obat.sql (id_obat >= 112) into apotek_permata.sql."""
import re
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APOTEK_SQL = ROOT / "apotek_permata.sql"
DATA_OBAT_SQL = ROOT / "data_obat.sql"
TIMESTAMP = "2026-05-15 06:00:47"
EXISTING_MAX_ID = 112
OBAT_NEW_START = 112


def sql_escape(val):
    if val is None:
        return "NULL"
    if isinstance(val, (int, float)) and not isinstance(val, bool):
        return str(int(val))
    s = str(val).replace("\r\n", " ").replace("\n", " ").replace("\r", " ")
    s = s.replace("±", "+/-").replace("–", "-").replace("—", "-").replace("½", "1/2")
    s = re.sub(r"\s+", " ", s).strip()
    s = s.replace("\\", "\\\\").replace("'", "\\'")
    return f"'{s}'"


def parse_values_tuple(s: str) -> list:
    values = []
    i = 0
    n = len(s)
    while i < n:
        while i < n and s[i] in " \t\n\r,":
            i += 1
        if i >= n:
            break
        if s[i : i + 4].upper() == "NULL":
            values.append(None)
            i += 4
            continue
        if s[i] == "'":
            i += 1
            buf = []
            while i < n:
                if s[i] == "\\" and i + 1 < n:
                    buf.append(s[i + 1])
                    i += 2
                elif s[i] == "'":
                    if i + 1 < n and s[i + 1] == "'":
                        buf.append("'")
                        i += 2
                    else:
                        i += 1
                        break
                else:
                    buf.append(s[i])
                    i += 1
            values.append("".join(buf))
            continue
        j = i
        while j < n and s[j] not in ",":
            j += 1
        token = s[i:j].strip()
        try:
            values.append(int(token) if "." not in token else float(token))
        except ValueError:
            values.append(token)
        i = j
    return values


def extract_obat_rows(content: str) -> list[dict]:
    rows = []
    for m in re.finditer(
        r"INSERT INTO `obat`[^V]+VALUES\s*\((.*?)\)\s*;",
        content,
        re.DOTALL | re.IGNORECASE,
    ):
        vals = parse_values_tuple(m.group(1))
        if len(vals) < 2:
            continue
        try:
            id_obat = int(vals[0])
        except (TypeError, ValueError):
            continue
        rows.append({"id_obat": id_obat, "nama": vals[1], "vals": vals})
    return rows


def extract_existing_names(apotek: str) -> set[str]:
    start = apotek.find("INSERT INTO `medicines`")
    end = apotek.find("CREATE TABLE `messages`")
    section = apotek[start:end] if start != -1 and end != -1 else apotek
    names = set()
    for m in re.finditer(r"\(\d+,\s*'((?:\\'|[^'])*)'", section):
        name = m.group(1).replace("\\'", "'").strip().lower()
        if name:
            names.add(re.sub(r"\s+", " ", name))
    return names


def obat_to_medicine(vals: list, new_id: int, stock: int) -> dict:
    kategori = vals[2] if len(vals) > 2 and vals[2] else None
    if not kategori and len(vals) > 17:
        kategori = vals[17]
    if not kategori:
        kategori = "Umum"

    harga = vals[5] if len(vals) > 5 else 0
    try:
        harga = int(float(harga)) if harga is not None else 0
    except (TypeError, ValueError):
        harga = 0

    nama = str(vals[1]).replace("\n", " ").strip() if vals[1] else ""
    image_url = vals[16] if len(vals) > 16 and vals[16] else None
    if not image_url:
        from urllib.parse import quote

        image_url = f"https://tse.mm.bing.net/th?q={quote(nama)}%20obat%20kemasan"

    return {
        "id": new_id,
        "name": nama,
        "category": str(kategori).replace("\n", " ").strip(),
        "indication": vals[3] if len(vals) > 3 else None,
        "unit": vals[4] if len(vals) > 4 else None,
        "price": harga,
        "price_detail": vals[6] if len(vals) > 6 else None,
        "stock": stock,
        "usage_rules": vals[7] if len(vals) > 7 else None,
        "dosage": vals[8] if len(vals) > 8 else None,
        "side_effects": vals[9] if len(vals) > 9 else None,
        "interactions": vals[10] if len(vals) > 10 else None,
        "usage_duration": vals[11] if len(vals) > 11 else None,
        "composition": vals[12] if len(vals) > 12 else None,
        "contraindications": vals[13] if len(vals) > 13 else None,
        "image_url": image_url,
        "prescription_required": 0,
        "created_at": TIMESTAMP,
        "updated_at": TIMESTAMP,
    }


def medicine_to_sql_row(m: dict) -> str:
    cols = [
        "id",
        "name",
        "category",
        "indication",
        "unit",
        "price",
        "price_detail",
        "stock",
        "usage_rules",
        "dosage",
        "side_effects",
        "interactions",
        "usage_duration",
        "composition",
        "contraindications",
        "image_url",
        "prescription_required",
        "created_at",
        "updated_at",
    ]
    return "(" + ", ".join(sql_escape(m[c]) for c in cols) + ")"


def build_insert_blocks(medicines: list[dict], batch_size: int = 25) -> str:
    header = (
        "INSERT INTO `medicines` (`id`, `name`, `category`, `indication`, `unit`, "
        "`price`, `price_detail`, `stock`, `usage_rules`, `dosage`, `side_effects`, "
        "`interactions`, `usage_duration`, `composition`, `contraindications`, "
        "`image_url`, `prescription_required`, `created_at`, `updated_at`) VALUES\n"
    )
    parts = []
    for i in range(0, len(medicines), batch_size):
        batch = medicines[i : i + batch_size]
        rows = ",\n".join(medicine_to_sql_row(m) for m in batch)
        parts.append(header + rows + ";")
    return "\n\n".join(parts)


def main():
    apotek = APOTEK_SQL.read_text(encoding="utf-8", errors="replace")
    data_obat = DATA_OBAT_SQL.read_text(encoding="utf-8", errors="replace")

    existing_names = extract_existing_names(apotek)
    obat_rows = extract_obat_rows(data_obat)

    next_id = EXISTING_MAX_ID + 1
    new_medicines = []

    for row in sorted(obat_rows, key=lambda r: r["id_obat"]):
        if row["id_obat"] < OBAT_NEW_START:
            continue
        nama = row["nama"]
        if not nama or str(nama).strip().lower() in ("null", "none", ""):
            continue
        norm = re.sub(r"\s+", " ", str(nama).strip().lower())
        if norm in existing_names:
            continue
        new_medicines.append(obat_to_medicine(row["vals"], next_id, random.randint(20, 99)))
        existing_names.add(norm)
        next_id += 1

    print(f"Adding {len(new_medicines)} new medicines (ids {EXISTING_MAX_ID + 1}..{next_id - 1})")
    if not new_medicines:
        return

    marker = "-- --------------------------------------------------------\n\n--\n-- Struktur dari tabel `messages`"
    if marker not in apotek:
        marker = "CREATE TABLE `messages`"
    pos = apotek.find(marker)
    if pos == -1:
        raise SystemExit("Insertion marker not found")

    block = (
        "\n-- Data obat tambahan dari data_obat.sql (id_obat >= 112)\n"
        + build_insert_blocks(new_medicines)
        + "\n\n"
    )

    apotek_new = apotek[:pos] + block + apotek[pos:]
    apotek_new = re.sub(
        r"(ALTER TABLE `medicines`\s+MODIFY `id`[^;]+AUTO_INCREMENT=)\d+",
        rf"\g<1>{next_id}",
        apotek_new,
        count=1,
    )

    APOTEK_SQL.write_text(apotek_new, encoding="utf-8")
    print(f"Saved {APOTEK_SQL}")
    print(f"Total medicines: {EXISTING_MAX_ID + len(new_medicines)}")


if __name__ == "__main__":
    main()
