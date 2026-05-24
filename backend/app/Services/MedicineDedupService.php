<?php

namespace App\Services;

use App\Models\Medicine;
use Illuminate\Support\Facades\DB;

class MedicineDedupService
{
  /** Kunci unik katalog: nama tampilan + satuan + kategori */
  public static function catalogKey(Medicine $medicine): string
  {
    $name = strtolower(trim(MedicineUnitService::displayName($medicine->name, $medicine->unit)));
    $unit = strtolower(trim(MedicineUnitService::displayUnit($medicine->unit)));
    $category = strtolower(trim($medicine->category ?? ''));

    return "{$name}|{$unit}|{$category}";
  }

  /**
   * Hapus duplikat obat aktif dengan nama tampilan, satuan, dan kategori sama.
   * Menyimpan baris dengan ID terkecil, menggabungkan stok, dan memindahkan referensi.
   */
  public function deduplicate(): array
  {
    $active = Medicine::query()
      ->where('is_active', true)
      ->orderBy('id')
      ->get();

    $groups = [];
    foreach ($active as $medicine) {
      $groups[self::catalogKey($medicine)][] = $medicine;
    }

    $removed = 0;
    $groupsProcessed = 0;

    DB::transaction(function () use ($groups, &$removed, &$groupsProcessed) {
      foreach ($groups as $members) {
        if (count($members) <= 1) {
          continue;
        }

        $groupsProcessed++;
        /** @var Medicine $keeper */
        $keeper = $members[0];
        $extraStock = 0;

        for ($i = 1; $i < count($members); $i++) {
          $duplicate = $members[$i];
          $this->reassignReferences($duplicate->id, $keeper->id);
          $extraStock += max(0, (int) $duplicate->stock);
          $duplicate->update(['is_active' => false]);
          $removed++;
        }

        if ($extraStock > 0) {
          $keeper->update(['stock' => max(0, (int) $keeper->stock) + $extraStock]);
        }
      }
    });

    return [
      'groups' => $groupsProcessed,
      'removed' => $removed,
    ];
  }

  /** Cek apakah obat aktif dengan kunci katalog yang sama sudah ada. */
  public static function findActiveDuplicate(Medicine $medicine, ?int $exceptId = null): ?Medicine
  {
    $key = self::catalogKey($medicine);

    $query = Medicine::query()
      ->where('is_active', true)
      ->when($exceptId, fn ($q) => $q->where('id', '!=', $exceptId));

    foreach ($query->get() as $candidate) {
      if (self::catalogKey($candidate) === $key) {
        return $candidate;
      }
    }

    return null;
  }

  private function reassignReferences(int $fromId, int $toId): void
  {
    if ($fromId === $toId) {
      return;
    }

    DB::table('cart_items')
      ->where('medicine_id', $fromId)
      ->update(['medicine_id' => $toId]);

    DB::table('order_items')
      ->where('medicine_id', $fromId)
      ->update(['medicine_id' => $toId]);
  }
}
