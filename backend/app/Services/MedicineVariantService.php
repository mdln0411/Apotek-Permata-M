<?php

namespace App\Services;

use App\Models\Medicine;

class MedicineVariantService
{
  /**
   * Pisahkan obat dengan banyak varian satuan (mis. Cair 30 Ml, Cair 60 Ml)
   * menjadi baris terpisah — ukuran di judul, satuan dasar di kolom unit.
   */
  public function splitAll(): int
  {
    $count = 0;
    $medicines = Medicine::query()
      ->whereNotNull('unit')
      ->where('unit', 'like', '%,%')
      ->get();

    foreach ($medicines as $medicine) {
      $variants = MedicineUnitService::parseUnitVariants($medicine->unit);
      if (count($variants) <= 1) {
        continue;
      }

      $priceMap = $this->parsePriceDetail($medicine->price_detail);
      $isLiquid = $this->isLiquidProduct($medicine->name, $variants);

      if (!$isLiquid) {
        // Obat padat multi-satuan (Box, Strip): simpan satuan pertama saja
        $primary = $variants[0];
        $medicine->update([
          'unit' => MedicineUnitService::displayUnit($primary),
        ]);
        continue;
      }

      $originalName = $medicine->name;
      $first = true;
      foreach ($variants as $variantUnit) {
        $displayName = MedicineUnitService::displayName($originalName, $variantUnit);
        $baseUnit = MedicineUnitService::displayUnit($variantUnit);
        $variantKey = strtolower(trim($variantUnit));
        $price = $priceMap[$variantKey] ?? (int) $medicine->price;

        $payload = [
          'name' => $displayName,
          'category' => $medicine->category,
          'indication' => $medicine->indication,
          'unit' => $baseUnit,
          'price' => $price,
          'price_detail' => $baseUnit . ': Rp ' . number_format($price, 0, ',', '.'),
          'stock' => $medicine->stock,
          'usage_rules' => $medicine->usage_rules,
          'dosage' => $medicine->dosage,
          'side_effects' => $medicine->side_effects,
          'interactions' => $medicine->interactions,
          'usage_duration' => $medicine->usage_duration,
          'composition' => $medicine->composition,
          'contraindications' => $medicine->contraindications,
          'image_url' => $medicine->image_url,
          'prescription_required' => $medicine->prescription_required,
        ];

        if ($first) {
          $medicine->update($payload);
          $first = false;
        } else {
          Medicine::create($payload);
        }
        $count++;
      }
    }

    // Normalisasi satuan yang masih mengandung detail ukuran
    Medicine::query()
      ->whereNotNull('unit')
      ->where(function ($q) {
        $q->where('unit', 'like', '%isi%')
          ->orWhere('unit', 'like', 'Cair%')
          ->orWhere('unit', 'like', 'cair%');
      })
      ->chunkById(100, function ($rows) use (&$count) {
        foreach ($rows as $row) {
          if (str_contains($row->unit, ',')) {
            continue;
          }
          $newUnit = MedicineUnitService::displayUnit($row->unit);
          $newName = MedicineUnitService::displayName($row->name, $row->unit);
          $changed = $newUnit !== $row->unit || $newName !== $row->name;
          if ($changed) {
            $row->update([
              'unit' => $newUnit,
              'name' => $newName,
            ]);
            $count++;
          }
        }
      });

    return $count;
  }

  /**
   * Perbaiki nama obat yang salah format (mis. "Decadryl 120 ml 60 ml").
   */
  public function repairDoubleSizeNames(): int
  {
    $count = 0;
    $rows = Medicine::whereRaw("LOWER(name) REGEXP '[0-9]+[[:space:]]*ml.*[0-9]+[[:space:]]*ml'")->get();

    foreach ($rows as $medicine) {
      preg_match_all('/(\d+\s*ml)/i', $medicine->name, $matches);
      $sizes = array_values(array_unique(array_map(function ($s) {
        return strtolower(preg_replace('/\s+/', ' ', trim($s)));
      }, $matches[1] ?? [])));

      if (count($sizes) < 2) {
        continue;
      }

      preg_match('/^(.+?)\s+\d+\s*ml/i', $medicine->name, $baseMatch);
      $baseName = trim($baseMatch[1] ?? $medicine->name);

      $first = true;
      foreach ($sizes as $size) {
        $payload = [
          'name' => trim($baseName . ' ' . $size),
          'category' => $medicine->category,
          'indication' => $medicine->indication,
          'unit' => MedicineUnitService::displayUnit($medicine->unit),
          'price' => $medicine->price,
          'price_detail' => $medicine->price_detail,
          'stock' => $medicine->stock,
          'usage_rules' => $medicine->usage_rules,
          'dosage' => $medicine->dosage,
          'side_effects' => $medicine->side_effects,
          'interactions' => $medicine->interactions,
          'usage_duration' => $medicine->usage_duration,
          'composition' => $medicine->composition,
          'contraindications' => $medicine->contraindications,
          'image_url' => $medicine->image_url,
          'prescription_required' => $medicine->prescription_required,
        ];

        if ($first) {
          $medicine->update($payload);
          $first = false;
        } else {
          Medicine::create($payload);
        }
        $count++;
      }
    }

    return $count;
  }

  private function parsePriceDetail(?string $priceDetail): array
  {
    $map = [];
    if (!$priceDetail) {
      return $map;
    }

    foreach (explode(';', $priceDetail) as $part) {
      $kv = explode(':', $part, 2);
      if (count($kv) !== 2) {
        continue;
      }
      $key = strtolower(trim($kv[0]));
      $price = (int) preg_replace('/[^0-9]/', '', $kv[1]);
      $map[$key] = $price;
    }

    return $map;
  }

  private function isLiquidProduct(string $name, array $variants): bool
  {
    $nameLower = strtolower($name);
    $liquidKeywords = ['cair', 'sirup', 'suspensi', 'elixir', 'drop', 'ml', 'syrup', 'liquid'];
    foreach ($liquidKeywords as $keyword) {
      if (str_contains($nameLower, $keyword)) {
        return true;
      }
    }

    foreach ($variants as $variant) {
      $lower = strtolower($variant);
      if (str_contains($lower, 'ml') || str_contains($lower, 'cair')) {
        return true;
      }
    }

    return false;
  }
}
