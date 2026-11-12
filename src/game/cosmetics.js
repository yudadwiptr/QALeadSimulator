// Katalog item kustomisasi karakter QA Lead (sesuai referensi UI)
// Sebagian terbuka gratis sejak awal (price: 0), sisanya bisa dibeli dengan QA Coins di Customizer atau QA Shop.

export const COSMETIC_CATEGORIES = {
  hair: [
    { id: 'side', name: 'Side Part', price: 0, slot: 'hair' },
    { id: 'messy', name: 'Messy Spiky', price: 0, slot: 'hair' },
    { id: 'undercut', name: 'Undercut Fade', price: 150, slot: 'hair' },
    { id: 'cap', name: 'Trucker Cap', price: 200, slot: 'hair' },
  ],
  eyes: [
    { id: 'sleepy', name: 'Mata Lembur', price: 0, slot: 'eyes' },
    { id: 'wide', name: 'Mata Kafein', price: 0, slot: 'eyes' },
    { id: 'round', name: 'Kacamata Bulat', price: 150, slot: 'eyes' },
    { id: 'square', name: 'Kacamata Tebal', price: 0, slot: 'eyes' },
  ],
  outfit: [
    { id: 'hoodie', name: 'Hoodie Dark', price: 0, slot: 'outfit' },
    { id: 'flannel', name: 'Flannel Merah', price: 0, slot: 'outfit' },
    { id: 'polo', name: 'Polo Hijau', price: 200, slot: 'outfit' },
    { id: 'jacket', name: 'Jaket Tech Lead', price: 300, slot: 'outfit' },
  ],
  accessory: [
    { id: 'headphones', name: 'Headphone Studio', price: 200, slot: 'accessory' },
    { id: 'headset', name: 'Headset Mic QA', price: 250, slot: 'accessory' },
    { id: 'lanyard', name: 'ID Card Lanyard', price: 0, slot: 'accessory' },
    { id: 'coffee', name: 'Kopi Takeaway', price: 0, slot: 'accessory' },
  ],
}

export const ALL_COSMETICS = [
  ...COSMETIC_CATEGORIES.hair,
  ...COSMETIC_CATEGORIES.eyes,
  ...COSMETIC_CATEGORIES.outfit,
  ...COSMETIC_CATEGORIES.accessory,
]

export const DEFAULT_UNLOCKED = ALL_COSMETICS.filter((i) => i.price === 0).map((i) => i.id)

export const DEFAULT_LOOK = {
  hair: 'messy',
  eyes: 'square',
  body: 'hoodie',
  headgearAcc: null, // 'headphones' | 'headset' | null
  lanyard: true,
  coffee: true,
}

export function normalizeLook(raw) {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_LOOK }
  const hair = COSMETIC_CATEGORIES.hair.some((h) => h.id === raw.hair) ? raw.hair : 'messy'
  const eyes = COSMETIC_CATEGORIES.eyes.some((e) => e.id === raw.eyes)
    ? raw.eyes
    : raw.glasses === false
      ? 'sleepy'
      : 'square'
  const body = COSMETIC_CATEGORIES.outfit.some((o) => o.id === raw.body) ? raw.body : 'hoodie'
  const headgearAcc =
    raw.headgearAcc === 'headphones' || raw.headgearAcc === 'headset' ? raw.headgearAcc : null
  const lanyard = raw.lanyard !== undefined ? Boolean(raw.lanyard) : true
  const coffee = raw.coffee !== undefined ? Boolean(raw.coffee) : true

  return {
    ...raw,
    hair,
    eyes,
    body,
    headgearAcc,
    lanyard,
    coffee,
  }
}

export function isAccEquipped(look, accId) {
  if (accId === 'lanyard') return Boolean(look.lanyard)
  if (accId === 'coffee') return Boolean(look.coffee)
  if (accId === 'headphones' || accId === 'headset') return look.headgearAcc === accId
  return false
}

export function toggleAccessory(look, accId) {
  if (accId === 'lanyard') {
    return { ...look, lanyard: !look.lanyard }
  }
  if (accId === 'coffee') {
    return { ...look, coffee: !look.coffee }
  }
  if (accId === 'headphones' || accId === 'headset') {
    return { ...look, headgearAcc: look.headgearAcc === accId ? null : accId }
  }
  return look
}

