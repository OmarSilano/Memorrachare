DIST_DIR = dist
BUILD_ARCHIVE = memory-game.zip

.PHONY: all check build clean

all: clean check build

check:
	@echo "[MAKE] Verifica presenza file sorgente Memory Game..."
	@test -f index.html || (echo "[ERROR] index.html non trovato!"; exit 1)
	@test -f style.css || (echo "[ERROR] style.css non trovato!"; exit 1)
	@test -f game.js || (echo "[ERROR] game.js non trovato!"; exit 1)
	@echo "[MAKE] Controllo integrità superato."

build: check
	@echo "[MAKE] Creazione cartella di distribuzione '$(DIST_DIR)'..."
	@mkdir -p $(DIST_DIR)
	@cp -r index.html style.css game.js sw.js manifest.json favicon.ico mascotte-background.jfif audio favicon img $(DIST_DIR)/ 2>/dev/null || cp index.html style.css game.js $(DIST_DIR)/
	@echo "[MAKE] Impacchettamento artefatto in $(BUILD_ARCHIVE)..."
	@zip -r $(BUILD_ARCHIVE) $(DIST_DIR) > /dev/null
	@echo "[MAKE] Build completata con successo! Artefatto generato: $(BUILD_ARCHIVE)"

clean:
	@rm -rf $(DIST_DIR) $(BUILD_ARCHIVE)
	@echo "[MAKE] Pulizia completata."
