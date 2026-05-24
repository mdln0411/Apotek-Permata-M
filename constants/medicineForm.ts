/** Kategori filter katalog — satu label per obat (sama dengan API / katalog) */

export const MEDICINE_CATEGORIES = [

  'Batuk',

  'Flu',

  'Pilek',

  'Demam',

  'Lambung',

  'P3K',

  'Vitamin & Suplemen',

  'Alergi',

  'Diare',

  'Pereda Nyeri',

  'Antibiotik',

  'Bayi',

  'Susu',

  'Kecantikan',

  'Hamil & Menyusui',

  'Lansia',

  'Diabetes',

  'Hipertensi',

  'Asma',

  'Lain-lain',

] as const;



/** Satuan standar untuk picker tambah obat */

export const STANDARD_MEDICINE_UNITS = [

  'Box',

  'Strip',

  'Sachet',

  'Pot',

  'Tube',

  'Botol',

  'Pcs',

  'Kaplet',

  'Kapsul',

  'Tablet',

  'Blister',

  'ml',

  'Roll',

  'Pak',

  'Dus',

] as const;



/** Satuan cair — sirup, tetes, dll. */

export const LIQUID_MEDICINE_UNITS = ['Botol', 'ml'] as const;



/** Satuan padat — tablet, kapsul, dll. */

export const SOLID_MEDICINE_UNITS = ['Strip', 'Sachet', 'Pot', 'Tube', 'Box', 'Pcs'] as const;



/** Pola kategori DB → satu label filter */

const CATEGORY_PATTERN_MAP: Record<string, string[]> = {

  Batuk: ['Batuk Dan Pilek', 'Batuk Dan Flu', 'Batuk'],

  Flu: ['Batuk Dan Flu', 'Alergi & Flu', 'Flu'],

  Pilek: ['Batuk Dan Pilek', 'Pilek'],

  Demam: ['Demam'],

  Lambung: ['Asam Lambung', 'Lambung'],

  P3K: ['Cedera Ringan', 'Luka Bakar', 'Luka', 'antiseptik', 'desinfektan', 'P3K'],

  'Vitamin & Suplemen': ['Multivitamin', 'Suplemen', 'Vitamin'],

  Alergi: ['Alergi'],

  Diare: ['Diare'],

  'Pereda Nyeri': ['Nyeri', 'Pain Relief'],

  Antibiotik: ['obat antibiotika', 'Infeksi Bakteri', 'Antibiotics', 'Antibiotik'],

  Bayi: ['MPASI', 'Popok bayi', 'Popok celana', 'Dot bayi', 'Biskuit bayi', 'Bubur bayi', 'Minyak bayi', 'Krim bayi', 'Set makan bayi', 'Snack finger food', 'Botol susu bayi', 'Bayi'],

  Susu: ['Susu'],

  Kecantikan: ['Kecantikan', 'Facial', 'Acne', 'Face Cream', 'Face Wash', 'Foaming', 'Gentle facial', 'Obat Jerawat', 'Moistur'],

  'Hamil & Menyusui': ['hamil', 'menyusui', 'Kehamilan', 'kontrasepsi', 'pil KB'],

  Lansia: ['lansia', 'dewasa perekat'],

  Diabetes: ['Diabetes'],

  Hipertensi: ['Hipertensi'],

  Asma: ['Asma'],

};



const LIQUID_NAME_KEYWORDS = [

  'sirup',

  'suspensi',

  'cair',

  'drop',

  'tetes',

  'elixir',

  'syrup',

  'liquid',

  'ml',

];



export function isLiquidMedicine(name: string): boolean {

  const lower = (name || '').toLowerCase();

  return LIQUID_NAME_KEYWORDS.some((k) => lower.includes(k));

}



/** Ekstrak ukuran dari satuan (mis. "Cair 60 Ml" → "60 ml") */

export function extractSizeFromUnit(unit: string | null | undefined): string | null {

  const first = (unit || '').split(',')[0].trim();

  if (!first) return null;



  const cairMatch = first.match(/cair\s+(\d+\s*ml)/i);

  if (cairMatch) return cairMatch[1].replace(/\s+/g, ' ').toLowerCase();



  const boxMatch = first.match(/box\s+isi\s+([\d.]+\s*(?:gr|g|kg|ml|l))/i);

  if (boxMatch) return boxMatch[1].replace(/\s+/g, ' ').toLowerCase();



  return null;

}



/** Satuan dasar untuk tampilan — "Box isi 360 gr" → "Box", "Cair 60 Ml" → "Botol" */

export function displayMedicineUnit(unit: string | null | undefined): string {

  const raw = (unit || '').trim();

  if (!raw) return 'Pcs';



  const first = raw.split(',')[0].trim();

  const lower = first.toLowerCase();



  if (lower.startsWith('box')) return 'Box';

  if (lower.startsWith('strip')) return 'Strip';

  if (lower.startsWith('sachet')) return 'Sachet';

  if (lower.startsWith('pot')) return 'Pot';

  if (lower.startsWith('tube')) return 'Tube';

  if (lower.startsWith('blister')) return 'Blister';

  if (lower.startsWith('kaplet')) return 'Kaplet';

  if (lower.startsWith('kapsul')) return 'Kapsul';

  if (lower.startsWith('tablet')) return 'Tablet';

  if (lower.startsWith('botol') || lower.startsWith('bottle')) return 'Botol';

  if (lower.startsWith('cair') || /\d+\s*ml/.test(lower)) return 'Botol';

  if (lower === 'ml') return 'Botol';

  if (lower === 'pcs' || lower === 'pil' || lower === 'all') return 'Pcs';

  if (lower.startsWith('pak')) return 'Pak';

  if (lower.startsWith('dus')) return 'Dus';

  if (lower.startsWith('roll')) return 'Roll';



  const word = first.split(/\s+/)[0];

  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

}



/** Judul obat dengan ukuran varian jika belum ada di nama */

export function displayMedicineName(name: string, unit?: string | null): string {

  const baseName = (name || '').trim();

  if (!baseName || !unit) return baseName;



  const size = extractSizeFromUnit(unit);

  if (!size) return baseName;



  const nameLower = baseName.toLowerCase();

  const sizeDigits = size.replace(/\D/g, '');
  if (sizeDigits && nameLower.includes(sizeDigits)) {
    return baseName;
  }



  const sizeCompact = size.replace(/\s+/g, '').toLowerCase();

  const nameCompact = nameLower.replace(/\s+/g, '');

  if (sizeCompact && nameCompact.includes(sizeCompact.replace(/[^a-z0-9]/g, ''))) {

    return baseName;

  }



  return `${baseName} ${size}`;

}



/** Normalisasi satuan sebelum disimpan — simpan satuan dasar saja */

export function normalizeMedicineUnit(unit: string | null | undefined): string {

  return displayMedicineUnit(unit);

}



/** Gabungkan satuan dari API + satuan terpilih saat ini */

export function mergeUnitOptions(dbUnits: string[], currentUnit?: string | null): string[] {

  const set = new Set<string>(STANDARD_MEDICINE_UNITS);



  for (const u of dbUnits) {

    const base = displayMedicineUnit(u);

    if (base) set.add(base);

  }



  if (currentUnit) {

    const base = displayMedicineUnit(currentUnit);

    if (base) set.add(base);

  }



  return Array.from(set).sort((a, b) => a.localeCompare(b, 'id'));

}



/** @deprecated Gunakan mergeUnitOptions dengan data dari API */

export function getUnitOptionsForMedicine(

  _name: string,

  currentUnit?: string | null

): string[] {

  return mergeUnitOptions([], currentUnit);

}



/** Pilih default satuan saat nama obat berubah */

export function getDefaultUnitForMedicine(name: string): string {

  return isLiquidMedicine(name) ? 'Botol' : 'Strip';

}



/** Map kategori DB (bisa panjang / ganda) → satu label filter */

export function normalizeMedicineCategory(raw: string | null | undefined): string {

  const value = (raw || '').trim();

  if (!value) return '';



  if ((MEDICINE_CATEGORIES as readonly string[]).includes(value)) {

    return value;

  }



  const lower = value.toLowerCase();



  for (const [label, patterns] of Object.entries(CATEGORY_PATTERN_MAP)) {

    for (const pattern of patterns) {

      const p = pattern.toLowerCase();

      if (lower.includes(p) || p.includes(lower)) {

        return label;

      }

    }

  }



  return 'Lain-lain';

}



/** Hanya digit bulat (stok & harga) */

export function sanitizeIntegerInput(text: string): string {

  return text.replace(/\D/g, '');

}

