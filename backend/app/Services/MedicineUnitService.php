<?php

namespace App\Services;

class MedicineUnitService
{
  /** Satuan standar untuk picker admin */
  public const STANDARD_UNITS = [
    'Box', 'Strip', 'Sachet', 'Pot', 'Tube', 'Botol', 'Pcs',
    'Kaplet', 'Kapsul', 'Tablet', 'Blister', 'ml', 'Roll', 'Pak', 'Dus',
  ];

  /** Ambil satuan dasar untuk tampilan (Box, Botol, Strip, …) */
  public static function displayUnit(?string $unit): string
  {
    $raw = trim($unit ?? '');
    if ($raw === '') {
      return 'Pcs';
    }

    $first = trim(explode(',', $raw)[0]);
    $lower = strtolower($first);

    if (str_starts_with($lower, 'box')) return 'Box';
    if (str_starts_with($lower, 'strip')) return 'Strip';
    if (str_starts_with($lower, 'sachet')) return 'Sachet';
    if (str_starts_with($lower, 'pot')) return 'Pot';
    if (str_starts_with($lower, 'tube')) return 'Tube';
    if (str_starts_with($lower, 'blister')) return 'Blister';
    if (str_starts_with($lower, 'kaplet')) return 'Kaplet';
    if (str_starts_with($lower, 'kapsul')) return 'Kapsul';
    if (str_starts_with($lower, 'tablet')) return 'Tablet';
    if (str_starts_with($lower, 'botol') || str_starts_with($lower, 'bottle')) return 'Botol';
    if (str_starts_with($lower, 'cair') || preg_match('/\d+\s*ml/', $lower)) return 'Botol';
    if ($lower === 'ml') return 'Botol';
    if (in_array($lower, ['pcs', 'pil', 'all'], true)) return 'Pcs';
    if (str_starts_with($lower, 'pak')) return 'Pak';
    if (str_starts_with($lower, 'dus')) return 'Dus';
    if (str_starts_with($lower, 'roll')) return 'Roll';

    $word = explode(' ', $first)[0];
    return ucfirst(strtolower($word));
  }

  /** Ekstrak ukuran dari satuan (mis. "Cair 60 Ml" → "60 ml") */
  public static function extractSizeFromUnit(?string $unit): ?string
  {
    $first = trim(explode(',', trim($unit ?? ''))[0]);
    if ($first === '') {
      return null;
    }

    if (preg_match('/cair\s+(\d+\s*ml)/i', $first, $m)) {
      return strtolower(preg_replace('/\s+/', ' ', $m[1]));
    }

    if (preg_match('/box\s+isi\s+([\d.]+\s*(?:gr|g|kg|ml|l))/i', $first, $m)) {
      return strtolower(preg_replace('/\s+/', ' ', $m[1]));
    }

    return null;
  }

  /** Judul obat dengan ukuran varian (mis. Anakonidin + 60 ml → Anakonidin 60 ml) */
  public static function displayName(string $name, ?string $unit): string
  {
    $baseName = trim($name);
    if ($baseName === '' || !$unit) {
      return $baseName;
    }

    $size = self::extractSizeFromUnit($unit);
    if (!$size) {
      return $baseName;
    }

    $nameLower = strtolower($baseName);
    $sizeDigits = preg_replace('/\D/', '', $size);
    if ($sizeDigits !== '' && str_contains($nameLower, $sizeDigits)) {
      return $baseName;
    }

    $sizeCompact = strtolower(preg_replace('/\s+/', '', $size));
    $nameCompact = strtolower(preg_replace('/\s+/', '', $baseName));
    if ($sizeCompact !== '' && str_contains($nameCompact, preg_replace('/[^a-z0-9]/', '', $sizeCompact))) {
      return $baseName;
    }

    return trim($baseName . ' ' . $size);
  }

  /** Parse varian satuan dari string DB (mis. "Cair 30 Ml, Cair 60 Ml") */
  public static function parseUnitVariants(?string $unit): array
  {
    $raw = trim($unit ?? '');
    if ($raw === '') {
      return [];
    }

    if (!str_contains($raw, ',')) {
      return [$raw];
    }

    return array_values(array_filter(array_map('trim', explode(',', $raw))));
  }

  /** Kumpulkan satuan unik dari database untuk picker admin */
  public static function collectDistinctUnits(iterable $rawUnits): array
  {
    $set = array_fill_keys(self::STANDARD_UNITS, true);

    foreach ($rawUnits as $raw) {
      foreach (self::parseUnitVariants($raw) as $part) {
        $base = self::displayUnit($part);
        if ($base !== '') {
          $set[$base] = true;
        }
      }
    }

    $units = array_values(array_filter(
      array_keys($set),
      fn ($key) => is_string($key) && trim($key) !== ''
    ));
    sort($units, SORT_NATURAL | SORT_FLAG_CASE);

    return $units;
  }
}
