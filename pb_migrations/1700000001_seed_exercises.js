migrate((db) => {
  const collection = Dao(db).findCollectionByNameOrId("exercises");

  const exercises = [
    { name: "Press de Banca con Barra", muscle_groups: ["Pecho", "Tríceps", "Hombro"], equipment: "Barra" },
    { name: "Press Inclinado con Mancuernas", muscle_groups: ["Pecho", "Hombro"], equipment: "Mancuernas" },
    { name: "Aperturas en Polea / Pec Deck", muscle_groups: ["Pecho"], equipment: "Polea / Máquina" },
    { name: "Fondos en Paralelas", muscle_groups: ["Pecho", "Tríceps"], equipment: "Peso Corporal" },
    { name: "Dominadas", muscle_groups: ["Espalda", "Bíceps"], equipment: "Peso Corporal" },
    { name: "Jalón al Pecho", muscle_groups: ["Espalda", "Bíceps"], equipment: "Polea" },
    { name: "Remo con Barra", muscle_groups: ["Espalda"], equipment: "Barra" },
    { name: "Remo en Polea Baja", muscle_groups: ["Espalda"], equipment: "Polea" },
    { name: "Remo Unilateral con Mancuerna", muscle_groups: ["Espalda"], equipment: "Mancuernas" },
    { name: "Sentadilla Trasera con Barra", muscle_groups: ["Pierna", "Cuádriceps", "Glúteo"], equipment: "Barra" },
    { name: "Prensa de Piernas", muscle_groups: ["Pierna", "Cuádriceps"], equipment: "Máquina" },
    { name: "Extensión de Cuádriceps", muscle_groups: ["Pierna", "Cuádriceps"], equipment: "Máquina" },
    { name: "Curl Femoral Tumbado / Sentado", muscle_groups: ["Pierna", "Femoral", "Isquios"], equipment: "Máquina" },
    { name: "Peso Muerto Rumano", muscle_groups: ["Pierna", "Femoral", "Glúteo"], equipment: "Barra / Mancuernas" },
    { name: "Hip Thrust con Barra", muscle_groups: ["Pierna", "Glúteo"], equipment: "Barra" },
    { name: "Elevaciones de Talones (Gemelos)", muscle_groups: ["Pierna", "Gemelos"], equipment: "Máquina" },
    { name: "Press Militar", muscle_groups: ["Hombro", "Tríceps"], equipment: "Barra / Mancuernas" },
    { name: "Elevaciones Laterales", muscle_groups: ["Hombro"], equipment: "Mancuernas / Polea" },
    { name: "Pájaros / Deltoides Posterior", muscle_groups: ["Hombro", "Espalda"], equipment: "Mancuernas / Polea" },
    { name: "Curl de Bíceps con Barra", muscle_groups: ["Bíceps"], equipment: "Barra" },
    { name: "Curl Martillo", muscle_groups: ["Bíceps", "Antebrazo"], equipment: "Mancuernas" },
    { name: "Extensiones de Tríceps en Polea", muscle_groups: ["Tríceps"], equipment: "Polea" },
    { name: "Press Francés", muscle_groups: ["Tríceps"], equipment: "Barra Z" },
    { name: "Plancha Abdominal", muscle_groups: ["Core", "Abdomen"], equipment: "Peso Corporal" },
    { name: "Crunch en Polea", muscle_groups: ["Core", "Abdomen"], equipment: "Polea" }
  ];

  for (const ex of exercises) {
    const record = new Record(collection, {
      name: ex.name,
      muscle_groups: ex.muscle_groups,
      description: "",
      equipment: ex.equipment
    });
    Dao(db).saveRecord(record);
  }
}, (db) => {
  return null;
});
