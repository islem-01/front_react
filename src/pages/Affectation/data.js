// ════════════════════════════════════════════════════════
//  DATA STORE  — shared mock data used across Affectation
// ════════════════════════════════════════════════════════

export const NIVEAUX = [
  { id: "L1", name: "1ère Année Licence",           type: "Licence",   filieres: ["Informatique", "Mathématiques", "Physique", "Chimie"] },
  { id: "L2", name: "2ème Année Licence",           type: "Licence",   filieres: ["Informatique", "Réseaux", "Multimédia", "Mathématiques"] },
  { id: "L3", name: "3ème Année Licence",           type: "Licence",   filieres: ["Génie Logiciel", "Sécurité Informatique", "Intelligence Artificielle"] },
  { id: "M1", name: "1ère Année Master",            type: "Master",    filieres: ["IA & Data Science", "Cyber Sécurité", "Cloud Computing"] },
  { id: "M2", name: "2ème Année Master",            type: "Master",    filieres: ["Data Science", "DevOps & Cloud", "Architecture SI"] },
  { id: "I1", name: "1ère Année Cycle Ingénieur",  type: "Ingénieur", filieres: ["Informatique", "Réseaux & Télécoms", "Systèmes Embarqués"] },
  { id: "I2", name: "2ème Année Cycle Ingénieur",  type: "Ingénieur", filieres: ["Informatique", "Réseaux & Télécoms", "Systèmes Embarqués"] },
  { id: "I3", name: "3ème Année Cycle Ingénieur",  type: "Ingénieur", filieres: ["Informatique", "Réseaux & Télécoms", "Systèmes Embarqués"] },
];

// Generate realistic students
const firstNames = ["Ahmed","Sofia","Yassine","Nadia","Karim","Leila","Oussama","Amira","Mohamed","Ines","Hichem","Fatima","Rami","Mariem","Omar","Sana","Bilel","Rim","Walid","Yasmine","Anir","Chaima","Seifeddine","Hajer","Khaled"];
const lastNames  = ["Ben Ali","Touati","Khelil","Mansouri","Bennour","Saidi","Hamdi","Chenini","Salah","Trabelsi","Jaouadi","Zahra","Gharbi","Mabrouk","Chakroun","Belhadj","Khemiri","Jerbi","Miled","Dridi","Boughanmi","Riahi","Nasr","Belhaj"];
const villes     = ["Tunis","Sfax","Sousse","Bizerte","Nabeul","Monastir","Kairouan","Gafsa","Gabès"];
const rues       = ["Habib Bourguiba","Farhat Hached","Mohamed V","de la Liberté","de Carthage","Ibn Khaldoun","14 Janvier"];

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rndBetween(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

let _sid = 1;
function makeStudent(niveau, filiere, groupe) {
  const fn = rnd(firstNames);
  const ln = rnd(lastNames);
  const ville = rnd(villes);
  const id = `IIT${String(_sid++).padStart(5, "0")}`;
  return {
    id,
    prenom: fn,
    nom: ln,
    sexe: ["Ahmed","Yassine","Karim","Oussama","Mohamed","Hichem","Rami","Omar","Bilel","Walid","Anir","Seifeddine","Khaled"].includes(fn) ? "M" : "F",
    niveau,
    filiere,
    groupe,
    email: `${fn.toLowerCase().replace(/ /g,".")}.${ln.toLowerCase().replace(/ /g,".")}@iit.tn`,
    phone: `+216 ${rndBetween(20,99)} ${rndBetween(100,999)} ${rndBetween(100,999)}`,
    cin: `${rndBetween(10000000, 19999999)}`,
    dateNaissance: `${rndBetween(1,28).toString().padStart(2,"0")}/${rndBetween(1,12).toString().padStart(2,"0")}/${rndBetween(1995,2003)}`,
    lieuNaissance: ville,
    adresse: `${rndBetween(1,150)} Rue ${rnd(rues)}, ${ville}`,
    inscription: `202${rndBetween(0,3)}`,
    moyenne: (Math.random() * 8 + 9).toFixed(2),
    statut: Math.random() > 0.1 ? "Actif" : "Suspendu",
    seatNumber: null, // assigned during affectation
  };
}

// Build pools per niveau/filiere/groupe
export const STUDENTS_DB = [];
NIVEAUX.forEach(niv => {
  niv.filieres.forEach(fil => {
    ["A","B"].forEach(grp => {
      const count = rndBetween(22, 36);
      for (let i = 0; i < count; i++) {
        STUDENTS_DB.push(makeStudent(niv.name, fil, grp));
      }
    });
  });
});

export const PROFESSORS = [
  { id: 101, name: "Dr. Karim Benali",    grade: "Maître de conférences", specialite: "Informatique",       email: "karim.benali@iit.tn",    phone: "+216 98 123 456" },
  { id: 102, name: "Pr. Salima Mansouri", grade: "Professeur",            specialite: "Réseaux",            email: "salima.mansouri@iit.tn", phone: "+216 99 234 567" },
  { id: 103, name: "Dr. Amine Touati",    grade: "Maître assistant",      specialite: "Mathématiques",      email: "amine.touati@iit.tn",    phone: "+216 97 345 678" },
  { id: 104, name: "Pr. Nadia Khelil",    grade: "Professeur",            specialite: "Génie Logiciel",     email: "nadia.khelil@iit.tn",    phone: "+216 98 456 789" },
  { id: 105, name: "Dr. Hichem Jaouadi",  grade: "Maître de conférences", specialite: "Sécurité",           email: "hichem.jaouadi@iit.tn",  phone: "+216 96 567 890" },
  { id: 106, name: "Pr. Leila Saidi",     grade: "Professeur",            specialite: "IA",                 email: "leila.saidi@iit.tn",     phone: "+216 95 678 901" },
  { id: 107, name: "Dr. Omar Gharbi",     grade: "Maître assistant",      specialite: "Cloud",              email: "omar.gharbi@iit.tn",     phone: "+216 94 789 012" },
  { id: 108, name: "Mme. Fatima Zahra",   grade: "Assistante pédagogique",specialite: "—",                  email: "fatima.zahra@iit.tn",    phone: "+216 93 890 123" },
  { id: 109, name: "M. Bilel Riahi",      grade: "Surveillant",           specialite: "—",                  email: "bilel.riahi@iit.tn",     phone: "+216 92 901 234" },
];

// ── ROOMS ────────────────────────────────────────────────
// Each room has a realistic grid layout (rows x cols) and
// a list of desk objects {id, row, col, seatIndex}
function buildRoomDesks(rows, cols, teacherRow, teacherCol, skipPositions = []) {
  const desks = [];
  let seatIdx = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r}-${c}`;
      if (skipPositions.includes(key)) continue;
      if (r === teacherRow && c === teacherCol) {
        desks.push({ id: `T`, row: r, col: c, type: "teacher", seatIndex: 0, studentId: null });
      } else {
        desks.push({ id: `S${seatIdx}`, row: r, col: c, type: "desk", seatIndex: seatIdx++, studentId: null });
      }
    }
  }
  return { desks, capacity: seatIdx - 1 };
}

export const ROOMS = (() => {
  const list = [];

  // S1.01 — petite salle 4×7=28 places
  const r1 = buildRoomDesks(5, 7, 0, 0, ["0-0"]);
  list.push({ id: "S1.01", name: "Salle S1.01", floor: "1 er étage", rows: 5, cols: 7, ...r1,
    equipement: ["Tableau blanc","Climatisation"], color: "#dbeafe" });

  // S1.05 — salle standard 5×8=40 places
  const r2 = buildRoomDesks(6, 8, 0, 0, ["0-0","0-1"]);
  list.push({ id: "S1.05", name: "Salle S1.05", floor: "1 er étage", rows: 6, cols: 8, ...r2,
    equipement: ["Projecteur","Tableau blanc","Climatisation"], color: "#dcfce7" });

  // S2.08 — salle moyenne 6×7=42 places
  const r3 = buildRoomDesks(7, 7, 0, 0, ["0-0"]);
  list.push({ id: "S2.08", name: "Salle S2.08", floor: "2ème étage", rows: 7, cols: 7, ...r3,
    equipement: ["Projecteur","Tableau blanc","Climatisation","WiFi"], color: "#fef9c3" });

  // S2.12 — salle moyenne
  const r4 = buildRoomDesks(6, 8, 0, 0, ["0-0"]);
  list.push({ id: "S2.12", name: "Salle S2.12", floor: "2ème étage", rows: 6, cols: 8, ...r4,
    equipement: ["Tableau blanc","Climatisation"], color: "#fce7f3" });

  // S3.11 — grande salle 7×9=63 places
  const r5 = buildRoomDesks(8, 9, 0, 0, ["0-0","0-1"]);
  list.push({ id: "S3.11", name: "Salle S3.11", floor: "3ème étage", rows: 8, cols: 9, ...r5,
    equipement: ["Projecteur","Tableau blanc","Climatisation","WiFi"], color: "#ede9fe" });

  // Amphithéâtre A — grand amphi 10×12=120 places
  const r6 = buildRoomDesks(10, 12, 0, 5, ["0-4","0-6"]);
  list.push({ id: "AmpA", name: "Amphithéâtre A", floor: "4ème étage", rows: 10, cols: 12, ...r6,
    equipement: ["Scène","Projecteur","Sonorisation","Climatisation"], color: "#fee2e2" });

  return list;
})();

export const INITIAL_AFFECTATIONS = [
  {
    id: 1,
    niveau: "3ème Année Licence",
    filiere: "Génie Logiciel",
    groupe: "A",
    examName: "Architecture des Ordinateurs",
    examDate: "2026-06-10",
    examStart: "09:00",
    examEnd: "12:00",
    professorId: 101,
    coSupervisorId: 108,
    roomId: "S3.11",
    observations: "",
    status: "confirme",
    dateAffectation: "2026-05-20",
    seatMap: {},
  },
  {
    id: 2,
    niveau: "1ère Année Cycle Ingénieur",
    filiere: "Réseaux & Télécoms",
    groupe: "B",
    examName: "Réseaux et Télécommunications",
    examDate: "2026-06-11",
    examStart: "14:00",
    examEnd: "17:00",
    professorId: 102,
    coSupervisorId: null,
    roomId: "S2.08",
    observations: "",
    status: "en_attente",
    dateAffectation: "2026-05-21",
    seatMap: {},
  },
];
