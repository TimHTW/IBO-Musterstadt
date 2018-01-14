# IBO-Musterstadt

# Ziel des Projektes: Automatisierung

# Probleme: - diverse katastrophale Fehler (keine strukturrellen) in der process.json
#           - Unterschideliche json => process.json beinhaltet eine andere Struktur als der Link
#           - Rechtschreibfehler in der json (Bsp.: Standtanzeiger, zwei Leerzeichen hintereinander usw.) führen dazu, 
#             dass passendes Result-Image bzw. Result-PDF nicht geladen werden
#           - optional-value in der json hindert teilweise das Auslesen benötigter Daten (Bsp.: Stakeholder)
#           - Nummern vor den result-files (PDF, Image) passen teilweise nicht zum Prozess-key (Bsp.: 32 Baubeginn_dummy.jpg)