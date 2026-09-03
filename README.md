# 🎴 Memorracharé

Welcome to **Memorracharé**, an interactive and custom web memory game based on classic Neapolitan cards. It's not your usual Memory game: besides the classic mode, it introduces a unique strategic variant based on suit affinity!

## ✨ Main Features

*   **Two Game Modes:**
    *   *Classic:* Find the two identical cards.
    *   *Memorracharé:* Match cards by the same **Value** and **Suit Affinity** (Round: Cups ↔ Coins | Long: Clubs ↔ Swords).
*   **Versatile (Solo & Multiplayer):**
    *   *Solo Mode:* Challenge yourself to finish the game in the fewest moves possible. The interface adapts by centering the grid.
    *   *Local Multiplayer (P1 vs P2):* Challenge a friend on the same screen with separate scoreboards.
    *   *P1 vs CPU:* Play against the AI (built with Fuzzy Logic) across 3 difficulty levels (Easy, Medium, Killer).
*   **Juice & Game Feel:**
    *   Complete audio system: Looping reggae background music and sound effects for card flips, matches (cheers!), errors, and game over.
    *   Floating volume control panel.
    *   Rewarding visual animations, like a floating "+1" when successfully matching a pair.
*   **Dynamic & Responsive Layout:** Built entirely with Flexbox, the game board and side panels dynamically adapt based on the selected game mode.

## 💻 Technologies Used

The project was developed in pure Frontend (Vanilla), without the use of external frameworks:
*   **HTML5:** Semantic structure and audio management.
*   **CSS3:** Flexbox layout, CSS animations (Keyframes for popups and cards), and custom variables for the color theme.
*   **JavaScript (ES6):** DOM manipulation, game logic, asynchronous turn management (`setTimeout`), and CPU AI.

## 🎮 How to Play (Live Demo)

You can play directly from your browser with no installation required! 
👉 **[PLAY MEMORRACHARÉ NOW](https://omarsilano.github.io/Memorrachare)

### Memorracharé Mode Rules:
To score a point, you must flip two cards that have the same number (e.g., two Knights) but belong to the same suit "family":
*   🔴 **Round Suits:** Cups (Coppe) & Coins (Denari)
*   ⚔️ **Long Suits:** Clubs (Bastoni) & Swords (Spade)

## 🛠️ Local Setup

If you want to download the code and test it on your machine:
1. Clone the repository: `git clone https://github.com/omarsilano/memorrachare.git`
2. Open the project folder.
3. Double-click the `index.html` file to open it in your default web browser.

---
*Designed and Developed by Omar Silano - 2026*
