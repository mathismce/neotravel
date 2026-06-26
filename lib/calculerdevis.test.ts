 import { calculerDevis } from './calculer-devis'
 
// CAS 1 — Trajet simple standard
test('cas simple — 100km, 10 passagers, saison normale', () => {
  const result = calculerDevis({
    distanceKm: 100,
    isAllerRetour: false,
    nbPassagers: 10,
    dateDepart: new Date('2025-10-15'),   // octobre → saison moyenne 0%
    dateDemande: new Date('2025-09-01'),  // 44 jours avant → DD_NORMAL -5%
  })
 
  expect(result.tarifBase).toBe(580)          // grille forfaitaire 100km
  expect(result.coeffSaisonValue).toBe(0)     // octobre = 0%
  expect(result.coeffDateValue).toBe(-0.05)   // 44j = DD_NORMAL
  expect(result.coeffCapaciteValue).toBe(-0.05)   // 10-19 pax = -5%... 
  expect(result.totalHT).toBeGreaterThan(0)
  expect(result.totalTTC).toBeGreaterThan(result.totalHT)
})
 
// CAS 2 — Trajet urgent
test('urgent — départ dans 10 jours, haute saison', () => {
  const result = calculerDevis({
    distanceKm: 80,
    isAllerRetour: false,
    nbPassagers: 15,
    dateDepart: new Date('2025-07-10'),   // juillet → haute +10%
    dateDemande: new Date('2025-06-30'),  // 10 jours → DD_PRIORITAIRE +10%
  })
 
  expect(result.coeffSaisonValue).toBe(0.10)  // juillet = haute
  expect(result.coeffDateValue).toBe(0.10)    // <=14j = prioritaire
  expect(result.totalTTC).toBeGreaterThan(500)
})
 
// CAS 3 — Aller-retour
test('aller-retour — tarifBase doit être multiplié par 2', () => {
  const simple = calculerDevis({
    distanceKm: 60,
    isAllerRetour: false,
    nbPassagers: 10,
    dateDepart: new Date('2025-10-15'),
    dateDemande: new Date('2025-09-01'),
  })
 
  const allerRetour = calculerDevis({
    distanceKm: 60,
    isAllerRetour: true,
    nbPassagers: 10,
    dateDepart: new Date('2025-10-15'),
    dateDemande: new Date('2025-09-01'),
  })
 
  expect(allerRetour.tarifBase).toBe(simple.tarifBase * 2)
})
 
// CAS 4 — Avec options
test('options — guide 2 jours + nuit chauffeur 1 nuit + péages', () => {
  const result = calculerDevis({
    distanceKm: 150,
    isAllerRetour: false,
    nbPassagers: 20,
    dateDepart: new Date('2025-10-15'),
    dateDemande: new Date('2025-09-01'),
    options: {
      guide: { nbJours: 2 },          // 2 × 80€ = 160€
      nuitChauffeur: { nbNuits: 1 },  // 1 × 120€ = 120€
      peages: 50,                      // forfait 50€
    }
  })
 
  expect(result.supplements.guide).toBe(160)
  expect(result.supplements.nuitChauffeur).toBe(120)
  expect(result.supplements.peages).toBe(50)
  expect(result.supplements.total).toBe(330)
  expect(result.totalHT).toBeGreaterThan(780)  // tarifBase 150km = 780
})
 
// CAS 5 — Capacité dépassée → erreur
test('capacité dépassée — plus de 85 passagers doit lever une erreur', () => {
  expect(() => calculerDevis({
    distanceKm: 100,
    isAllerRetour: false,
    nbPassagers: 90,                     // > 85 → escalade humaine
    dateDepart: new Date('2025-10-15'),
    dateDemande: new Date('2025-09-01'),
  })).toThrow('CAPACITE_EXCEDEE')
})