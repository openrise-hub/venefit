migrate((db) => {
  const collection = Dao(db).findCollectionByNameOrId("exercises");

  const exercises = [
    // 1. Pectoral
    { name: 'Press de banca plano con barra', muscle_groups: ['Pectoral', 'Tríceps', 'Hombro'], equipment: 'Peso Libre' },
    { name: 'Press inclinado con mancuernas', muscle_groups: ['Pectoral', 'Hombro'], equipment: 'Peso Libre' },
    { name: 'Aperturas (Flyes) planas o inclinadas con mancuernas', muscle_groups: ['Pectoral'], equipment: 'Peso Libre' },
    { name: 'Cruce de poleas altas (enfocado en pectoral inferior)', muscle_groups: ['Pectoral'], equipment: 'Poleas' },
    { name: 'Cruce de poleas bajas (enfocado en pectoral superior)', muscle_groups: ['Pectoral'], equipment: 'Poleas' },
    { name: 'Press con poleas a la altura del pecho', muscle_groups: ['Pectoral'], equipment: 'Poleas' },
    { name: 'Press de pecho sentado (Chest Press machine)', muscle_groups: ['Pectoral', 'Tríceps'], equipment: 'Máquinas' },
    { name: 'Aperturas en máquina Peck-Deck / Contractora', muscle_groups: ['Pectoral'], equipment: 'Máquinas' },
    { name: 'Press inclinado en máquina Hammer Strength', muscle_groups: ['Pectoral', 'Hombro'], equipment: 'Máquinas' },

    // 2. Hombro (Deltoides)
    { name: 'Press militar de pie con barra (Deltoides anterior/general)', muscle_groups: ['Hombro', 'Tríceps'], equipment: 'Peso Libre' },
    { name: 'Elevaciones laterales con mancuernas (Deltoides lateral)', muscle_groups: ['Hombro'], equipment: 'Peso Libre' },
    { name: 'Pájaro / Elevaciones posteriores con mancuernas (Deltoides posterior)', muscle_groups: ['Hombro', 'Espalda'], equipment: 'Peso Libre' },
    { name: 'Elevaciones laterales a una mano con polea baja', muscle_groups: ['Hombro'], equipment: 'Poleas' },
    { name: 'Face pull en polea alta con cuerda (Deltoides posterior y trapecio)', muscle_groups: ['Hombro', 'Espalda'], equipment: 'Poleas' },
    { name: 'Elevación frontal con barra en polea baja', muscle_groups: ['Hombro'], equipment: 'Poleas' },
    { name: 'Press de hombros sentado en máquina', muscle_groups: ['Hombro', 'Tríceps'], equipment: 'Máquinas' },
    { name: 'Elevaciones laterales en máquina', muscle_groups: ['Hombro'], equipment: 'Máquinas' },
    { name: 'Aperturas invertidas en máquina Peck-Deck (para posterior)', muscle_groups: ['Hombro', 'Espalda'], equipment: 'Máquinas' },

    // 3. Espalda
    { name: 'Remo con barra inclinado (Dorsal y zona media)', muscle_groups: ['Espalda', 'Bíceps'], equipment: 'Peso Libre' },
    { name: 'Remo con mancuerna a una mano (Dorsal)', muscle_groups: ['Espalda', 'Bíceps'], equipment: 'Peso Libre' },
    { name: 'Peso muerto convencional o sumo (Cadena posterior completa)', muscle_groups: ['Espalda', 'Isquiotibiales', 'Glúteo'], equipment: 'Peso Libre' },
    { name: 'Jalón al pecho con agarre ancho o estrecho', muscle_groups: ['Espalda', 'Bíceps'], equipment: 'Poleas' },
    { name: 'Remo sentado en polea baja (Gironda)', muscle_groups: ['Espalda', 'Bíceps'], equipment: 'Poleas' },
    { name: 'Jalón con brazos rectos (Pull-over en polea alta)', muscle_groups: ['Espalda'], equipment: 'Poleas' },
    { name: 'Remo Hammer Strength articulado', muscle_groups: ['Espalda', 'Bíceps'], equipment: 'Máquinas' },
    { name: 'Jalón en máquina con palancas', muscle_groups: ['Espalda', 'Bíceps'], equipment: 'Máquinas' },
    { name: 'Dominadas asistidas en máquina', muscle_groups: ['Espalda', 'Bíceps'], equipment: 'Máquinas' },

    // 4. Bíceps
    { name: 'Curl de bíceps de pie con barra recta o Z', muscle_groups: ['Bíceps', 'Antebrazo'], equipment: 'Peso Libre' },
    { name: 'Curl alterno de pie o sentado con mancuernas (con supinación)', muscle_groups: ['Bíceps', 'Antebrazo'], equipment: 'Peso Libre' },
    { name: 'Curl en banco Scott (Predicador) con barra Z o mancuerna', muscle_groups: ['Bíceps'], equipment: 'Peso Libre' },
    { name: 'Curl de bíceps con barra recta o cuerda en polea baja', muscle_groups: ['Bíceps'], equipment: 'Poleas' },
    { name: 'Curl de bíceps tumbado en polea baja', muscle_groups: ['Bíceps'], equipment: 'Poleas' },
    { name: 'Curl tipo "Cristo" en poleas altas opuestas', muscle_groups: ['Bíceps'], equipment: 'Poleas' },
    { name: 'Curl de bíceps en máquina de predicador', muscle_groups: ['Bíceps'], equipment: 'Máquinas' },
    { name: 'Curl de bíceps sentado articulado', muscle_groups: ['Bíceps'], equipment: 'Máquinas' },

    // 5. Tríceps
    { name: 'Press francés con barra Z o mancuernas tumbado', muscle_groups: ['Tríceps'], equipment: 'Peso Libre' },
    { name: 'Extensión trasnuca con mancuerna a dos manos', muscle_groups: ['Tríceps'], equipment: 'Peso Libre' },
    { name: 'Press de banca con agarre cerrado', muscle_groups: ['Tríceps', 'Pectoral'], equipment: 'Peso Libre' },
    { name: 'Extensión de tríceps en polea alta con cuerda', muscle_groups: ['Tríceps'], equipment: 'Poleas' },
    { name: 'Extensión de tríceps en polea alta con barra recta o en "V"', muscle_groups: ['Tríceps'], equipment: 'Poleas' },
    { name: 'Extensión Katana / trasnuca en polea baja o media', muscle_groups: ['Tríceps'], equipment: 'Poleas' },
    { name: 'Extensión de tríceps en máquina sentada', muscle_groups: ['Tríceps'], equipment: 'Máquinas' },
    { name: 'Fondos (Dips) asistidos en máquina', muscle_groups: ['Tríceps', 'Pectoral'], equipment: 'Máquinas' },

    // 6. Abdomen
    { name: 'Crunch abdominal en suelo (con disco o mancuerna sobre el pecho)', muscle_groups: ['Abdomen'], equipment: 'Peso Libre' },
    { name: 'Elevación de piernas estiradas en suelo o banco plano', muscle_groups: ['Abdomen'], equipment: 'Peso Libre' },
    { name: 'Rueda abdominal (Ab wheel)', muscle_groups: ['Abdomen'], equipment: 'Peso Libre' },
    { name: 'Crunch abdominal de rodillas en polea alta (con cuerda)', muscle_groups: ['Abdomen'], equipment: 'Poleas' },
    { name: 'Woodchoppers (Leñadores) en polea media o alta', muscle_groups: ['Abdomen'], equipment: 'Poleas' },
    { name: 'Elevación de rodillas en polea baja', muscle_groups: ['Abdomen'], equipment: 'Poleas' },
    { name: 'Máquina de crunch abdominal', muscle_groups: ['Abdomen'], equipment: 'Máquinas' },
    { name: 'Máquina de rotación del torso (oblicuos)', muscle_groups: ['Abdomen'], equipment: 'Máquinas' },

    // 7. Cuádriceps
    { name: 'Sentadilla trasera con barra (Back Squat)', muscle_groups: ['Cuádriceps', 'Glúteo'], equipment: 'Peso Libre' },
    { name: 'Sentadilla frontal con barra (Front Squat)', muscle_groups: ['Cuádriceps', 'Core'], equipment: 'Peso Libre' },
    { name: 'Zancadas / Stiff-leg Lunges con mancuernas o barra', muscle_groups: ['Cuádriceps', 'Glúteo'], equipment: 'Peso Libre' },
    { name: 'Sentadilla Goblet asistida con cable/polea baja', muscle_groups: ['Cuádriceps'], equipment: 'Poleas' },
    { name: 'Zancadas o paso atrás conectado a polea baja', muscle_groups: ['Cuádriceps', 'Glúteo'], equipment: 'Poleas' },
    { name: 'Extensión de cuádriceps individual con correa de tobillo en polea baja', muscle_groups: ['Cuádriceps'], equipment: 'Poleas' },
    { name: 'Extensión de piernas en máquina (Leg Extension)', muscle_groups: ['Cuádriceps'], equipment: 'Máquinas' },
    { name: 'Prensa inclinada a 45°', muscle_groups: ['Cuádriceps', 'Glúteo'], equipment: 'Máquinas' },
    { name: 'Sentadilla Hack (Hack Squat)', muscle_groups: ['Cuádriceps', 'Glúteo'], equipment: 'Máquinas' },

    // 8. Isquiotibiales / Isquiosurales
    { name: 'Peso muerto rumano con barra o mancuernas', muscle_groups: ['Isquiotibiales', 'Glúteo', 'Espalda'], equipment: 'Peso Libre' },
    { name: 'Buenos días con barra', muscle_groups: ['Isquiotibiales', 'Glúteo', 'Espalda'], equipment: 'Peso Libre' },
    { name: 'Peso muerto a una pierna con mancuerna', muscle_groups: ['Isquiotibiales', 'Glúteo'], equipment: 'Peso Libre' },
    { name: 'Curl femoral de pie con correa de tobillo en polea baja', muscle_groups: ['Isquiotibiales'], equipment: 'Poleas' },
    { name: 'Peso muerto rumano en polea baja', muscle_groups: ['Isquiotibiales', 'Glúteo'], equipment: 'Poleas' },
    { name: 'Pull-through en polea baja entre las piernas', muscle_groups: ['Isquiotibiales', 'Glúteo'], equipment: 'Poleas' },
    { name: 'Curl femoral tumbado', muscle_groups: ['Isquiotibiales'], equipment: 'Máquinas' },
    { name: 'Curl femoral sentado', muscle_groups: ['Isquiotibiales'], equipment: 'Máquinas' },
    { name: 'Banco de hiperextensiones a 45° (enfocado en femorales)', muscle_groups: ['Isquiotibiales', 'Glúteo'], equipment: 'Máquinas' },

    // 9. Aductores
    { name: 'Sentadilla Sumo con barra o mancuerna pesada', muscle_groups: ['Aductores', 'Cuádriceps', 'Glúteo'], equipment: 'Peso Libre' },
    { name: 'Zancadas laterales con mancuernas', muscle_groups: ['Aductores', 'Cuádriceps'], equipment: 'Peso Libre' },
    { name: 'Cossack Squats (Sentadillas cosacas)', muscle_groups: ['Aductores', 'Cuádriceps'], equipment: 'Peso Libre' },
    { name: 'Aducción de cadera cruzando la pierna con correa de tobillo en polea baja', muscle_groups: ['Aductores'], equipment: 'Poleas' },
    { name: 'Máquina específica de aductores (Aductor sentado)', muscle_groups: ['Aductores'], equipment: 'Máquinas' },

    // 10. Glúteo
    { name: 'Hip Thrust (Empuje de cadera) con barra', muscle_groups: ['Glúteo', 'Isquiotibiales'], equipment: 'Peso Libre' },
    { name: 'Zancadas búlgaras con mancuernas', muscle_groups: ['Glúteo', 'Cuádriceps'], equipment: 'Peso Libre' },
    { name: 'Step-ups (subidas a cajón) con mancuernas', muscle_groups: ['Glúteo', 'Cuádriceps'], equipment: 'Peso Libre' },
    { name: 'Patada de glúteo hacia atrás con correa de tobillo en polea baja', muscle_groups: ['Glúteo'], equipment: 'Poleas' },
    { name: 'Abducción de cadera lateral con correa de tobillo en polea baja', muscle_groups: ['Glúteo'], equipment: 'Poleas' },
    { name: 'Pull-through en polea baja', muscle_groups: ['Glúteo', 'Isquiotibiales'], equipment: 'Poleas' },
    { name: 'Máquina específica de Hip Thrust', muscle_groups: ['Glúteo'], equipment: 'Máquinas' },
    { name: 'Máquina de abducción de cadera sentada (Abductor)', muscle_groups: ['Glúteo'], equipment: 'Máquinas' },
    { name: 'Máquina de patada de glúteo (Glute Kickback)', muscle_groups: ['Glúteo'], equipment: 'Máquinas' },

    // 11. Gemelos (Gastronemios y Sóleo)
    { name: 'Elevación de talones de pie a una mano cargando mancuerna', muscle_groups: ['Gemelos'], equipment: 'Peso Libre' },
    { name: 'Elevación de talones estilo "Donkey" (con compañero o peso encorvado)', muscle_groups: ['Gemelos'], equipment: 'Peso Libre' },
    { name: 'Elevación de talones sentado con barra sobre los muslos', muscle_groups: ['Gemelos'], equipment: 'Peso Libre' },
    { name: 'Elevación de talones de pie sobre un escalón/bloque conectado a polea baja', muscle_groups: ['Gemelos'], equipment: 'Poleas' },
    { name: 'Elevación de gemelos de pie en máquina', muscle_groups: ['Gemelos'], equipment: 'Máquinas' },
    { name: 'Elevación de gemelos sentado en máquina (enfocado en el sóleo)', muscle_groups: ['Gemelos'], equipment: 'Máquinas' },
    { name: 'Elevación de talones en prensa de piernas', muscle_groups: ['Gemelos'], equipment: 'Máquinas' },

    // 12. Antebrazo
    { name: 'Curl de muñeca en pronación (palmas hacia abajo) con barra o mancuernas', muscle_groups: ['Antebrazo'], equipment: 'Peso Libre' },
    { name: 'Curl de muñeca en supinación (palmas hacia arriba) con barra', muscle_groups: ['Antebrazo'], equipment: 'Peso Libre' },
    { name: 'Paseo del granjero (Farmer’s Walk) con mancuernas pesadas', muscle_groups: ['Antebrazo', 'Core'], equipment: 'Peso Libre' },
    { name: 'Curl de muñeca en supinación en polea baja', muscle_groups: ['Antebrazo'], equipment: 'Poleas' },
    { name: 'Curl de muñeca en pronación en polea baja', muscle_groups: ['Antebrazo'], equipment: 'Poleas' },
    { name: 'Enrollamiento de cuerda con peso sujeto a polea baja', muscle_groups: ['Antebrazo'], equipment: 'Poleas' },
    { name: 'Máquina específica de flexión/extensión de muñeca', muscle_groups: ['Antebrazo'], equipment: 'Máquinas' },
    { name: 'Uso de Grippers o prensas mecánicas de mano', muscle_groups: ['Antebrazo'], equipment: 'Máquinas' }
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
