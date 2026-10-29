import { describe, expect, it } from "vitest";
import type { Carte, Enseigne, Valeur } from "../src/models/card";
import {
  calculerPoints,
  calculerTotalDesMains,
  identifierCombinaison,
} from "../src/poker";

function carte(valeur: Valeur, enseigne: Enseigne): Carte {
  return { valeur, enseigne };
}

describe("identifierCombinaison", () => {
  it("identifie un brelan", () => {
    const main = [
      carte("7", "Cœur"),
      carte("7", "Carreau"),
      carte("7", "Trèfle"),
      carte("2", "Pique"),
      carte("Roi", "Cœur"),
    ];

    expect(identifierCombinaison(main)).toBe("Brelan");
  });

  it("identifie une suite même si les cartes ne sont pas dans l'ordre", () => {
    const main = [
      carte("8", "Cœur"),
      carte("5", "Carreau"),
      carte("9", "Trèfle"),
      carte("6", "Pique"),
      carte("7", "Cœur"),
    ];

    expect(identifierCombinaison(main)).toBe("Suite");
  });

  it("identifie une couleur", () => {
    const main = [
      carte("2", "Cœur"),
      carte("7", "Cœur"),
      carte("9", "Cœur"),
      carte("Valet", "Cœur"),
      carte("Roi", "Cœur"),
    ];

    expect(identifierCombinaison(main)).toBe("Couleur");
  });

  it("identifie un full avant le brelan", () => {
    const main = [
      carte("2", "Cœur"),
      carte("2", "Pique"),
      carte("2", "Carreau"),
      carte("9", "Trèfle"),
      carte("9", "Pique"),
    ];

    expect(identifierCombinaison(main)).toBe("Full");
  });

  it("identifie un carré", () => {
    const main = [
      carte("Dame", "Cœur"),
      carte("Dame", "Carreau"),
      carte("Dame", "Trèfle"),
      carte("Dame", "Pique"),
      carte("2", "Cœur"),
    ];

    expect(identifierCombinaison(main)).toBe("Carré");
  });

  it("identifie une quinte flush avant la suite et la couleur", () => {
    const main = [
      carte("10", "Cœur"),
      carte("Valet", "Cœur"),
      carte("Dame", "Cœur"),
      carte("Roi", "Cœur"),
      carte("As", "Cœur"),
    ];

    expect(identifierCombinaison(main)).toBe("Quinte flush");
  });
});

describe("calculerPoints", () => {
  it("retourne 30 points pour un brelan", () => {
    const main = [
      carte("7", "Cœur"),
      carte("7", "Carreau"),
      carte("7", "Trèfle"),
      carte("2", "Pique"),
      carte("Roi", "Cœur"),
    ];

    expect(calculerPoints(main)).toBe(30);
  });

  it("retourne 60 points pour un carré", () => {
    const main = [
      carte("Dame", "Cœur"),
      carte("Dame", "Carreau"),
      carte("Dame", "Trèfle"),
      carte("Dame", "Pique"),
      carte("2", "Cœur"),
    ];

    expect(calculerPoints(main)).toBe(60);
  });

  it("retourne 80 points pour une quinte flush", () => {
    const main = [
      carte("10", "Cœur"),
      carte("Valet", "Cœur"),
      carte("Dame", "Cœur"),
      carte("Roi", "Cœur"),
      carte("As", "Cœur"),
    ];

    expect(calculerPoints(main)).toBe(80);
  });

  it("retourne la valeur de la carte haute sans combinaison", () => {
    const main = [
      carte("3", "Pique"),
      carte("8", "Trèfle"),
      carte("10", "Cœur"),
      carte("Dame", "Carreau"),
      carte("Roi", "Pique"),
    ];

    expect(calculerPoints(main)).toBe(13);
  });

  it("considère une paire comme une carte haute", () => {
    const main = [
      carte("4", "Cœur"),
      carte("4", "Pique"),
      carte("7", "Trèfle"),
      carte("9", "Carreau"),
      carte("As", "Cœur"),
    ];

    expect(calculerPoints(main)).toBe(14);
  });

  it("considère deux paires comme une carte haute", () => {
    const main = [
      carte("4", "Cœur"),
      carte("4", "Pique"),
      carte("9", "Trèfle"),
      carte("9", "Carreau"),
      carte("Roi", "Cœur"),
    ];

    expect(calculerPoints(main)).toBe(13);
  });

  it("ne considère pas As, 2, 3, 4, 5 comme une suite", () => {
    const main = [
      carte("As", "Cœur"),
      carte("2", "Pique"),
      carte("3", "Trèfle"),
      carte("4", "Carreau"),
      carte("5", "Cœur"),
    ];

    expect(calculerPoints(main)).toBe(14);
  });
});

describe("calculerTotalDesMains", () => {
  it("additionne les points de toutes les mains", () => {
    const mains = [
      [
        carte("2", "Cœur"),
        carte("2", "Pique"),
        carte("2", "Carreau"),
        carte("9", "Trèfle"),
        carte("9", "Pique"),
      ],
      [
        carte("5", "Trèfle"),
        carte("6", "Carreau"),
        carte("7", "Cœur"),
        carte("8", "Pique"),
        carte("9", "Trèfle"),
      ],
      [
        carte("2", "Cœur"),
        carte("7", "Cœur"),
        carte("9", "Cœur"),
        carte("Valet", "Cœur"),
        carte("Roi", "Cœur"),
      ],
      [
        carte("3", "Trèfle"),
        carte("8", "Carreau"),
        carte("10", "Cœur"),
        carte("Dame", "Pique"),
        carte("Roi", "Trèfle"),
      ],
    ];

    expect(calculerTotalDesMains(mains)).toBe(148);
  });
});
