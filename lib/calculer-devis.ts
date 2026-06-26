import { differenceInCalendarDays } from 'date-fns';

export interface DevisInput {
  distanceKm: number;
  isAllerRetour: boolean;
  nbPassagers: number;
  dateDepart: Date;
  dateDemande: Date;
   options?: {
     guide?: { nbJours: number };
     nuitChauffeur?: { nbNuits: number };
     peages?: number;  // forfait selon trajet — montant fixe
  };
}

export interface DevisOutput {
  tarifBase: number;
  coeffSaisonValue: number;
  coeffDateValue: number;
  coeffCapaciteValue: number;
  margeValue: number;
  supplements: {
     guide: number;
     nuitChauffeur: number;
     peages: number;
     total: number;
  };
  totalHT: number;
  totalTTC: number;
}

export function calculerDevis(input: DevisInput): DevisOutput {
  const { distanceKm, isAllerRetour, nbPassagers, dateDepart, dateDemande } = input;

  let tarifBase = 0;

  if (distanceKm <= 180) {
    if (distanceKm <= 30) tarifBase = 250;
    else if (distanceKm <= 40) tarifBase = 320;
    else if (distanceKm <= 50) tarifBase = 350;
    else if (distanceKm <= 60) tarifBase = 390;
    else if (distanceKm <= 70) tarifBase = 430;
    else if (distanceKm <= 80) tarifBase = 500;
    else if (distanceKm <= 90) tarifBase = 540;
    else if (distanceKm <= 100) tarifBase = 580;
    else if (distanceKm <= 110) tarifBase = 620;
    else if (distanceKm <= 120) tarifBase = 660;
    else if (distanceKm <= 130) tarifBase = 700;
    else if (distanceKm <= 140) tarifBase = 740;
    else if (distanceKm <= 150) tarifBase = 780;
    else if (distanceKm <= 160) tarifBase = 820;
    else if (distanceKm <= 170) tarifBase = 860;
    else tarifBase = 900;
  } 
  
  else {
    const kmParcourue = distanceKm * 2;
    tarifBase = kmParcourue * 2.5;
        }

  if (isAllerRetour) {
    tarifBase = tarifBase * 2;
  }

  const mois = dateDepart.getMonth();
  let coeffSaison = 0.0;

  if ([10, 0, 1, 7].includes(mois)) {
    coeffSaison = -0.07;
  } else if ([11, 9, 8].includes(mois)) {
    coeffSaison = 0.0;
  } else if ([2, 3, 6].includes(mois)) {
    coeffSaison = 0.10;
  } else if ([4, 5].includes(mois)) {
    coeffSaison = 0.15;
  }

  const joursRestants = differenceInCalendarDays(dateDepart, dateDemande);
  let coeffDate = 0.0;

  if (joursRestants <= 14) {
    coeffDate = 0.10;
  } else if (joursRestants <= 30) {
    coeffDate = 0.05;
  } else if (joursRestants <= 90) {
    coeffDate = -0.05;
  } else {
    coeffDate = -0.10;
  }

  let coeffCapacite = 0.0;

  if (nbPassagers <= 19) {
    coeffCapacite = -0.05;
  } else if (nbPassagers <= 53) {
    coeffCapacite = 0.0;
  } else if (nbPassagers <= 63) {
    coeffCapacite = 0.15;
  } else if (nbPassagers <= 67) {
    coeffCapacite = 0.20;
  } else if (nbPassagers <= 85) {
    coeffCapacite = 0.40;
  } else {
    throw new Error("CAPACITE_EXCEDEE: Flux manuel requis.");
  }

  const totalCoeffs = 1 + coeffSaison + coeffDate + coeffCapacite;
  const tarifAjuste = tarifBase * totalCoeffs;

  const supGuide       = (input.options?.guide?.nbJours ?? 0) * 80
  const supNuit        = (input.options?.nuitChauffeur?.nbNuits ?? 0) * 120
  const supPeages      = input.options?.peages ?? 0
  const totalSupplements = supGuide + supNuit + supPeages

  const margeMetiere = 0.15;
  const totalHTAvecSup = tarifAjuste + totalSupplements
  const totalHT = totalHTAvecSup * (1 + margeMetiere);

  const tvaTaux = 0.10;
  const totalTTC = totalHT* (1 + tvaTaux);

  return {
    tarifBase,
    coeffSaisonValue: coeffSaison,
    coeffDateValue: coeffDate,
    coeffCapaciteValue: coeffCapacite,
    margeValue: margeMetiere,
    supplements: {
      guide:        supGuide,
      nuitChauffeur: supNuit,
      peages:       supPeages,
      total:        totalSupplements
    },
    totalHT: Math.round(totalHT * 100) / 100,
    totalTTC: Math.round(totalTTC * 100) / 100
  };
}