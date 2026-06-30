import { calculerDevis } from './calculer-devis'

describe('calculerDevis — Grille forfaitaire (≤ 180km)', () => {

  test('1. Distance minimale — 10km', () => {
    const r = calculerDevis({
      distanceKm: 10,
      isAllerRetour: false,
      nbPassagers: 5,
      dateDepart: new Date('2025-10-15'),
      dateDemande: new Date('2025-09-01'),
    })
    expect(r.tarifBase).toBe(250)
  })

  test('2. Palier 30km → 40km — vérifie le changement de tranche', () => {
    const r30 = calculerDevis({
      distanceKm: 30, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
    })
    const r40 = calculerDevis({
      distanceKm: 40, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
    })
    expect(r30.tarifBase).toBe(250)
    expect(r40.tarifBase).toBe(320)
  })

  test('3. Distance maximale grille — 180km', () => {
    const r = calculerDevis({
      distanceKm: 180, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
    })
    expect(r.tarifBase).toBe(900)
  })

})

describe('calculerDevis — Au-delà de 180km', () => {

  test('4. Distance 200km — formule (km×2)×2.5€', () => {
    const r = calculerDevis({
      distanceKm: 200, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
    })
    expect(r.tarifBase).toBe(200 * 2 * 2.5) // 1000
  })

  test('5. Distance très longue — 500km', () => {
    const r = calculerDevis({
      distanceKm: 500, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
    })
    expect(r.tarifBase).toBe(500 * 2 * 2.5) // 2500
  })

})

describe('calculerDevis — Aller-retour', () => {

  test('6. Aller-retour double bien le tarif de base', () => {
    const simple = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
    })
    const ar = calculerDevis({
      distanceKm: 100, isAllerRetour: true, nbPassagers: 5,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
    })
    expect(ar.tarifBase).toBe(simple.tarifBase * 2)
  })

  test('7. Aller-retour au-delà de 180km', () => {
    const r = calculerDevis({
      distanceKm: 250, isAllerRetour: true, nbPassagers: 5,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
    })
    expect(r.tarifBase).toBe((250 * 2 * 2.5) * 2)
  })

})

describe('calculerDevis — Coefficient saisonnalité', () => {

  test('8. Basse saison — novembre (-7%)', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-11-10'), dateDemande: new Date('2025-09-01'),
    })
    expect(r.coeffSaisonValue).toBe(-0.07)
  })

  test('9. Basse saison — janvier (-7%)', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-01-10'), dateDemande: new Date('2024-11-01'),
    })
    expect(r.coeffSaisonValue).toBe(-0.07)
  })

  test('10. Saison moyenne — décembre (0%)', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-12-10'), dateDemande: new Date('2025-09-01'),
    })
    expect(r.coeffSaisonValue).toBe(0)
  })

  test('11. Haute saison — mars (+10%)', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-03-10'), dateDemande: new Date('2025-01-01'),
    })
    expect(r.coeffSaisonValue).toBe(0.10)
  })

  test('12. Très haute saison — mai (+15%)', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-05-10'), dateDemande: new Date('2025-03-01'),
    })
    expect(r.coeffSaisonValue).toBe(0.15)
  })

  test('13. Très haute saison — juin (+15%)', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-06-10'), dateDemande: new Date('2025-04-01'),
    })
    expect(r.coeffSaisonValue).toBe(0.15)
  })

})

describe('calculerDevis — Pondération date demande vs départ', () => {

  test('14. DD_PRIORITAIRE — départ dans 5 jours (+10%)', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-10-20'), dateDemande: new Date('2025-10-15'),
    })
    expect(r.coeffDateValue).toBe(0.10)
  })

  test('15. DD_PRIORITAIRE — limite exacte 14 jours (+10%)', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-10-29'), dateDemande: new Date('2025-10-15'),
    })
    expect(r.coeffDateValue).toBe(0.10)
  })

  test('16. DD_URGENT — départ dans 20 jours (+5%)', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-11-04'), dateDemande: new Date('2025-10-15'),
    })
    expect(r.coeffDateValue).toBe(0.05)
  })

  test('17. DD_NORMAL — départ dans 60 jours (-5%)', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-12-14'), dateDemande: new Date('2025-10-15'),
    })
    expect(r.coeffDateValue).toBe(-0.05)
  })

  test('18. DD_3MOISETPLUS — départ dans 120 jours (-10%)', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2026-02-12'), dateDemande: new Date('2025-10-15'),
    })
    expect(r.coeffDateValue).toBe(-0.10)
  })

  test('19. Départ le jour même (0 jour) — DD_PRIORITAIRE', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-10-15'),
    })
    expect(r.coeffDateValue).toBe(0.10)
  })

})

describe('calculerDevis — Pondération capacité', () => {

  test('20. ≤19 passagers (-5%)', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 19,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
    })
    expect(r.coeffCapaciteValue).toBe(-0.05)
  })

  test('21. 20-53 passagers (0%)', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 53,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
    })
    expect(r.coeffCapaciteValue).toBe(0)
  })

  test('22. 54-63 passagers (+15%)', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 60,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
    })
    expect(r.coeffCapaciteValue).toBe(0.15)
  })

  test('23. 64-67 passagers (+20%)', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 65,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
    })
    expect(r.coeffCapaciteValue).toBe(0.20)
  })

  test('24. 68-85 passagers (+40%)', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 80,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
    })
    expect(r.coeffCapaciteValue).toBe(0.40)
  })

  test('25. Exactement 85 passagers — encore valide', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 85,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
    })
    expect(r.coeffCapaciteValue).toBe(0.40)
  })

  test('26. 86 passagers — lève une erreur CAPACITE_EXCEDEE', () => {
    expect(() => calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 86,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
    })).toThrow('CAPACITE_EXCEDEE')
  })

  test('27. Cas extrême — 200 passagers — lève une erreur', () => {
    expect(() => calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 200,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
    })).toThrow('CAPACITE_EXCEDEE')
  })

})

describe('calculerDevis — Suppléments et options', () => {

  test('28. Guide seul — 3 jours', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
      options: { guide: { nbJours: 3 } }
    })
    expect(r.supplements.guide).toBe(240) // 3 × 80
    expect(r.supplements.nuitChauffeur).toBe(0)
    expect(r.supplements.peages).toBe(0)
  })

  test('29. Nuit chauffeur seule — 2 nuits', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
      options: { nuitChauffeur: { nbNuits: 2 } }
    })
    expect(r.supplements.nuitChauffeur).toBe(240) // 2 × 120
  })

  test('30. Péages seuls — forfait 35€', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
      options: { peages: 35 }
    })
    expect(r.supplements.peages).toBe(35)
  })

  test('31. Toutes les options combinées', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
      options: {
        guide: { nbJours: 2 },
        nuitChauffeur: { nbNuits: 1 },
        peages: 40
      }
    })
    expect(r.supplements.guide).toBe(160)
    expect(r.supplements.nuitChauffeur).toBe(120)
    expect(r.supplements.peages).toBe(40)
    expect(r.supplements.total).toBe(320)
  })

  test('32. Aucune option fournie — supplements à 0', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
    })
    expect(r.supplements.total).toBe(0)
  })

})

describe('calculerDevis — Marge et TVA', () => {

  test('33. Marge de 15% toujours appliquée', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 53, // coeff capacité = 0
      dateDepart: new Date('2025-12-15'), dateDemande: new Date('2025-09-15'), // saison 0%, date -5%
    })
    expect(r.margeValue).toBe(0.15)
  })

  test('34. TVA à 10% — vérifie le calcul HT → TTC', () => {
    const r = calculerDevis({
      distanceKm: 100, isAllerRetour: false, nbPassagers: 5,
      dateDepart: new Date('2025-10-15'), dateDemande: new Date('2025-09-01'),
    })
    const tvaCalculee = r.totalTTC - r.totalHT
    const ratioTva = tvaCalculee / r.totalHT
    expect(ratioTva).toBeCloseTo(0.10, 1)
  })

  test('35. Total TTC toujours supérieur au total HT', () => {
    const r = calculerDevis({
      distanceKm: 150, isAllerRetour: true, nbPassagers: 30,
      dateDepart: new Date('2025-05-15'), dateDemande: new Date('2025-05-01'),
    })
    expect(r.totalTTC).toBeGreaterThan(r.totalHT)
  })

})

describe('calculerDevis — Cas complexes combinés', () => {

  test('36. Cas réel — Toulouse Bordeaux, urgent, haute saison, gros groupe', () => {
    const r = calculerDevis({
      distanceKm: 245,
      isAllerRetour: false,
      nbPassagers: 60,
      dateDepart: new Date('2025-07-04'),  // juillet pas dans la grille saison du doc — vérifier
      dateDemande: new Date('2025-06-29'), // 5 jours avant → prioritaire
      options: {
        guide: { nbJours: 1 },
        peages: 25
      }
    })
    expect(r.coeffDateValue).toBe(0.10)        // urgent
    expect(r.coeffCapaciteValue).toBe(0.15)    // 54-63 pax
    expect(r.supplements.guide).toBe(80)
    expect(r.supplements.peages).toBe(25)
    expect(r.totalTTC).toBeGreaterThan(0)
  })

  test('37. Cas combiné défavorable maximal — tous les coefficients négatifs', () => {
    const r = calculerDevis({
      distanceKm: 100,
      isAllerRetour: false,
      nbPassagers: 19,                      // -5%
      dateDepart: new Date('2026-02-15'),    // novembre-janvier-février = -7%
      dateDemande: new Date('2025-10-01'),   // >90j = -10%
    })
    expect(r.coeffSaisonValue).toBe(-0.07)
    expect(r.coeffDateValue).toBe(-0.10)
    expect(r.coeffCapaciteValue).toBe(-0.05)
    // Le tarif ajusté doit quand même être positif grâce à la marge
    expect(r.totalTTC).toBeGreaterThan(0)
  })

  test('38. Cas combiné favorable maximal — tous les coefficients positifs', () => {
    const r = calculerDevis({
      distanceKm: 100,
      isAllerRetour: false,
      nbPassagers: 80,                      // +40%
      dateDepart: new Date('2025-05-10'),    // mai = +15%
      dateDemande: new Date('2025-05-05'),   // 5 jours = +10%
    })
    expect(r.coeffSaisonValue).toBe(0.15)
    expect(r.coeffDateValue).toBe(0.10)
    expect(r.coeffCapaciteValue).toBe(0.40)
  })

  test('39. Aller-retour + longue distance + toutes options', () => {
    const r = calculerDevis({
      distanceKm: 350,
      isAllerRetour: true,
      nbPassagers: 45,
      dateDepart: new Date('2025-12-20'),
      dateDemande: new Date('2025-12-10'),
      options: {
        guide: { nbJours: 3 },
        nuitChauffeur: { nbNuits: 2 },
        peages: 60
      }
    })
    expect(r.tarifBase).toBe((350 * 2 * 2.5) * 2) // au-delà 180km + AR
    expect(r.supplements.total).toBe(240 + 240 + 60) // 540
  })

  test('40. Distance 0 — cas limite improbable', () => {
    const r = calculerDevis({
      distanceKm: 0,
      isAllerRetour: false,
      nbPassagers: 5,
      dateDepart: new Date('2025-10-15'),
      dateDemande: new Date('2025-09-01'),
    })
    expect(r.tarifBase).toBe(250) // tombe dans la première tranche
  })

})

describe('calculerDevis — Précision des montants', () => {

  test('41. Les montants sont arrondis à 2 décimales', () => {
    const r = calculerDevis({
      distanceKm: 123,
      isAllerRetour: false,
      nbPassagers: 17,
      dateDepart: new Date('2025-08-15'),
      dateDemande: new Date('2025-07-01'),
    })
    const decimales = (r.totalTTC.toString().split('.')[1] || '').length
    expect(decimales).toBeLessThanOrEqual(2)
  })

  test('42. Aucun montant négatif possible', () => {
    const r = calculerDevis({
      distanceKm: 50,
      isAllerRetour: false,
      nbPassagers: 19,
      dateDepart: new Date('2026-01-15'),
      dateDemande: new Date('2025-10-01'),
    })
    expect(r.totalHT).toBeGreaterThan(0)
    expect(r.totalTTC).toBeGreaterThan(0)
  })

})