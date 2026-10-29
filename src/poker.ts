import type { Carte, Valeur } from "./models/card";

const pointsParValeur: Record<Valeur, number> = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  Valet: 11,
  Dame: 12,
  Roi: 13,
  As: 14,
};

export function valeurEnPoints(valeur: Valeur): number {
  return pointsParValeur[valeur];
}

export function valeurDeLaCarteLaPlusHaute(main: Carte[]): number {
  const valeurs = main.map((carte) => valeurEnPoints(carte.valeur));

  return Math.max(...valeurs);
}

export function compterLesValeurs(main: Carte[]): Map<Valeur, number> {
  const occurrences = new Map<Valeur, number>();

  for (const carte of main) {
    const nombreActuel = occurrences.get(carte.valeur) ?? 0;
    occurrences.set(carte.valeur, nombreActuel + 1);
  }

  return occurrences;
}

function uneValeurApparait(main: Carte[], nombreDeFois: number): boolean {
  return [...compterLesValeurs(main).values()].includes(nombreDeFois);
}

function estUnBrelan(main: Carte[]): boolean {
  return uneValeurApparait(main, 3);
}

function estUnCarre(main: Carte[]): boolean {
  return uneValeurApparait(main, 4);
}

function estUnFull(main: Carte[]): boolean {
  const occurrences = new Set(compterLesValeurs(main).values());

  return occurrences.has(3) && occurrences.has(2);
}

function estUneCouleur(main: Carte[]): boolean {
  const enseigneDeReference = main[0].enseigne;

  return main.every((carte) => carte.enseigne === enseigneDeReference);
}

function estUneSuite(main: Carte[]): boolean {
  const valeursTriees = main
    .map((carte) => valeurEnPoints(carte.valeur))
    .sort((premiereValeur, deuxiemeValeur) => premiereValeur - deuxiemeValeur);

  return valeursTriees.every(
    (valeur, index) => index === 0 || valeur === valeursTriees[index - 1] + 1,
  );
}

function estUneQuinteFlush(main: Carte[]): boolean {
  return estUneSuite(main) && estUneCouleur(main);
}

export type Combinaison =
  | "Quinte flush"
  | "Carré"
  | "Full"
  | "Couleur"
  | "Suite"
  | "Brelan";

const pointsParCombinaison: Record<Combinaison, number> = {
  "Quinte flush": 80,
  Carré: 60,
  Full: 50,
  Couleur: 45,
  Suite: 40,
  Brelan: 30,
};

export function identifierCombinaison(main: Carte[]): Combinaison | undefined {
  switch (true) {
    case estUneQuinteFlush(main):
      return "Quinte flush";
    case estUnCarre(main):
      return "Carré";
    case estUnFull(main):
      return "Full";
    case estUneCouleur(main):
      return "Couleur";
    case estUneSuite(main):
      return "Suite";
    case estUnBrelan(main):
      return "Brelan";
    default:
      return undefined;
  }
}

export function calculerPoints(main: Carte[]): number {
  const combinaison = identifierCombinaison(main);

  if (combinaison !== undefined) {
    return pointsParCombinaison[combinaison];
  }

  return valeurDeLaCarteLaPlusHaute(main);
}

export function calculerTotalDesMains(mains: Carte[][]): number {
  return mains.reduce((total, main) => total + calculerPoints(main), 0);
}
