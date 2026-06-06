import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Connexion from "../Connexion";
import { UserContext } from "../Context/UserContext";
import React from "react";

// ============================================================================
// CONFIGURATION INITIALE
// ============================================================================

beforeEach(() => {
  globalThis.fetch = vi.fn(); // Mock de l'API fetch
  vi.clearAllMocks(); // Nettoyage des mocks
});

// Mock de la fonction login du contexte utilisateur
const loginMock = vi.fn();

// Fonction utilitaire pour rendre le composant avec le contexte mocké
const renderConnexion = () =>
  render(
    <MemoryRouter>
      <UserContext.Provider value={{ login: loginMock }}>
        <Connexion />
      </UserContext.Provider>
    </MemoryRouter>
  );

// ============================================================================
// SUITE DE TESTS
// ============================================================================

describe("Connexion", () => {
  
  // ========== SCÉNARIO 1 : AFFICHAGE INITIAL ==========
  it("affiche le formulaire avec tous les champs vides au chargement", () => {
    renderConnexion();

    // Vérification des champs vides
    expect(screen.getByPlaceholderText("Email")).toHaveValue("");
    expect(screen.getByPlaceholderText("Mot de passe")).toHaveValue("");
    
    // Vérification du bouton
    expect(screen.getByRole("button", { name: /se connecter/i })).toBeInTheDocument();
  });

  // ========== SCÉNARIO 2 : CHAMPS VIDES ==========
  it("refuse si champs vides", async () => {
    renderConnexion();
    const user = userEvent.setup();

    // Clic sur le bouton sans remplir les champs
    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    // Vérification du message d'erreur
    expect(await screen.findByText(/Veuillez remplir tous les champs/i)).toBeInTheDocument();
  });

  // ========== SCÉNARIO 3 : EMAIL INVALIDE ==========
  it("refuse email invalide", async () => {
    renderConnexion();
    const user = userEvent.setup();

    // Saisie d'un email invalide
    await user.type(screen.getByPlaceholderText("Email"), "test"); // Pas de @
    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    // Vérification du message d'erreur spécifique
    expect(await screen.findByText(/Email invalide/i)).toBeInTheDocument();
  });

  // ========== SCÉNARIO 4 : CONNEXION ÉCHOUÉE ==========
  it("connexion échouée (API error)", async () => {
    // ARRANGE : Mock d'une réponse d'erreur de l'API
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Identifiants incorrects" }),
    });

    renderConnexion();
    const user = userEvent.setup();

    // ACT : Remplissage avec des identifiants
    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Mot de passe"), "MotDePasseLong123!");
    
    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    // ASSERT : Vérification du message d'erreur
    expect(await screen.findByText(/Identifiants incorrects/i)).toBeInTheDocument();
  });

  // ========== SCÉNARIO 5 : CONNEXION RÉUSSIE ==========
  it("connexion réussie (login appelé)", async () => {
    // ARRANGE : Mock d'une réponse réussie de l'API
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ email: "test@test.com", nom: "Jean" }),
    });

    renderConnexion();
    const user = userEvent.setup();

    // ACT : Remplissage avec des identifiants valides
    await user.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await user.type(screen.getByPlaceholderText("Mot de passe"), "MotDePasseLong123!");
    
    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    // ASSERT : Vérifications
    // 1. Message de succès
    expect(await screen.findByText(/Connexion réussie/i)).toBeInTheDocument();
    
    // 2. La fonction login du contexte a été appelée avec les bonnes données
    expect(loginMock).toHaveBeenCalledWith({
      email: "test@test.com",
      nom: "Jean",
    });
  });
});