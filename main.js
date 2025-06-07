
const blagdani = [
    "01-01", "01-06", "04-01", "05-01", "05-30", "06-19", "06-22", "06-25",
    "08-05", "08-15", "11-01", "11-18", "12-25", "12-26"
];

const mjesecSelect = document.getElementById("mjesec");
for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = i;
    if (i === new Date().getMonth() + 1) option.selected = true;
    mjesecSelect.appendChild(option);
}

function generirajDane() {
    const mjesec = parseInt(document.getElementById("mjesec").value);
    const godina = parseInt(document.getElementById("godina").value);
    const tbody = document.querySelector("#tabela tbody");
    tbody.innerHTML = "";
    const brojDana = new Date(godina, mjesec, 0).getDate();

    for (let i = 1; i <= brojDana; i++) {
        const datum = new Date(godina, mjesec - 1, i);
        const iso = datum.toISOString().split("T")[0];
        const mmdd = iso.slice(5);
        const dan = datum.toLocaleDateString("hr-HR", { weekday: "long" });
        const vrsta = blagdani.includes(mmdd)
            ? "Blagdan"
            : datum.getDay() === 0
            ? "Nedjelja"
            : "Radni dan";
        const tr = document.createElement("tr");
        tr.className = vrsta === "Blagdan" ? "blagdan" : vrsta === "Nedjelja" ? "nedjelja" : "";
        tr.innerHTML = `
            <td>${datum.toLocaleDateString("hr-HR")}</td>
            <td>${dan}</td>
            <td>${vrsta}</td>
            <td contenteditable="true"></td>
            <td></td>
            <td></td>
        `;
        tbody.appendChild(tr);
    }
}

function izracunajSatnicu(smjena, vrsta) {
    if (smjena === "N") return 12;
    if (vrsta === "Blagdan" || vrsta === "Nedjelja") return 12;
    return 8;
}

function izracunajPlacu() {
    const rows = document.querySelectorAll("#tabela tbody tr");
    let ukupno = 0;

    rows.forEach(row => {
        const smjena = row.children[3].textContent.trim();
        const vrsta = row.children[2].textContent.trim();
        let satnica = 0, zarada = 0;

        if (smjena) {
            satnica = izracunajSatnicu(smjena, vrsta);
            zarada = satnica * 8;
            ukupno += zarada;
        }

        row.children[4].textContent = satnica ? satnica.toFixed(2) : "";
        row.children[5].textContent = zarada ? zarada.toFixed(2) : "";
    });

    document.getElementById("rezultat").textContent = `Ukupna plaća: ${(ukupno + 50).toFixed(2)} EUR (uklj. prijevoz)`;
}

function spremiPlacu() {
    const mjesec = document.getElementById("mjesec").value;
    const godina = document.getElementById("godina").value;
    const iznos = document.getElementById("rezultat").textContent.replace("Ukupna plaća: ", "").replace(" EUR (uklj. prijevoz)", "");
    const kljuc = `${mjesec.padStart(2, "0")}/${godina}`;
    const data = { [kljuc]: iznos };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "placa.json";
    a.click();
}
