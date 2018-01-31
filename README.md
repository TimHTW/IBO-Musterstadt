Der Inhalt der json wurde noch vor Weihnachten aus der Angegeben Quelle (sh. Slack => http://141.56.131.7:5984/musterstadt/561fc59f9dcdde3b9bd540334a0005ca) geladen.

In der von mir verwendeten Version der .json wurde das Feld, welches die Kindprozesse enthält, als 
'children' bezeichnet. In der aktuell abrufbaren process.json im Google-Drive wurde das angesprochene
Feld mit 'childs' bezeichnet. Bei Verwendung einer aktuelleren Version sollte demzufolge explizit
darauf geachtet werden.

Anpassungen an der von mir verwendeten process.json:
    - Am Aufbau bzw. der Struktur der json wurden keine Veränderungen vorgenommen!
    - Um die Ergebnisse (Results) der jeweiligen Teilprozesse auslesen zu können, wurde der Parameter
      '(optional)' entfernt. (von: 'results (optional)' zu: 'results').
    - Zudem wurden die Namen der jeweiligen results so angepasst, dass sie mit dem zugehörigen
      Dateinamen übereinstimmen. Bei Bilddateien wurde die Endung .jpg angefügt
    - Um an Kontaktinformation der Stakeholder zu gelangen wurde hier ebenfalls teils der '(optional)'
      Parameter entfernt. Für den Beleg ist dies aber nicht mehr von Belangen, da diese Daten im aktuellen Stand 
      nicht abgerufen werden.
    - In der alten, abgerufenen Version wurden die Initiatoren der jeweilgen Prozesse mit dem Namen angegeben (z.B. stakeholder_3).
      In der neueren Version (aus dem Google Drive) wird die jeweilge ID des Stakeholders verwendet. 
      Um den Stakeholder zu ermitteln, ist ein Vergleich über den Namen ist auch möglich, über die ID ist dies allerdings "sauberer". Daher wurde der Name durch die jeweilige ID ersetzt. Gleiches betrifft auch die Locatiuons.


Verwendet wurde Bootstrap 4, jQuery, timelify (zur Darstellung des Zeitstrahles) und fontawesome (Icons).


Um dieses Darstellungsproblem: https://github.com/twbs/bootstrap/issues/21547 von table-cells in Chrome zu lösen,
wurde speziell in Chrome mit table-layout: fixed; gearbeitet.



