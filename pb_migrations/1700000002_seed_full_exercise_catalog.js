migrate((db) => {
  const collection = Dao(db).findCollectionByNameOrId("exercises");

  const catalog = [
    // 1. PECTORAL
    {
      name: "Press de banca plano con barra",
      primary_muscle: "Pectoral",
      muscle_groups: ["Pectoral", "Tríceps", "Deltoides anterior"],
      modality: "Peso Libre",
      equipment: "Barra y Banco Plano",
      description: "Ejercicio multiarticular básico para el desarrollo del pectoral mayor y fuerza de empuje."
    },
    {
      name: "Press inclinado con mancuernas",
      primary_muscle: "Pectoral",
      muscle_groups: ["Pectoral", "Deltoides anterior", "Tríceps"],
      modality: "Peso Libre",
      equipment: "Mancuernas y Banco Inclinado",
      description: "Enfocado en el haz clavicular (pectoral superior) con mayor rango de recorrido."
    },
    {
      name: "Aperturas (Flyes) planas o inclinadas con mancuernas",
      primary_muscle: "Pectoral",
      muscle_groups: ["Pectoral"],
      modality: "Peso Libre",
      equipment: "Mancuernas",
      description: "Aislamiento de pectoral enfocado en estiramiento bajo tensión en la fase excéntrica."
    },
    {
      name: "Cruce de poleas altas (enfocado en pectoral inferior)",
      primary_muscle: "Pectoral",
      muscle_groups: ["Pectoral", "Pectoral inferior"],
      modality: "Poleas",
      equipment: "Polea Doble Alta",
      description: "Aducción horizontal en ángulo descendente para enfatizar la porción costal/inferior."
    },
    {
      name: "Cruce de poleas bajas (enfocado en pectoral superior)",
      primary_muscle: "Pectoral",
      muscle_groups: ["Pectoral", "Pectoral superior"],
      modality: "Poleas",
      equipment: "Polea Doble Baja",
      description: "Aducción en ángulo ascendente manteniendo tensión constante en el haz clavicular."
    },
    {
      name: "Press con poleas a la altura del pecho",
      primary_muscle: "Pectoral",
      muscle_groups: ["Pectoral", "Tríceps"],
      modality: "Poleas",
      equipment: "Polea Media",
      description: "Empuje horizontal con poleas permitiendo convergencia de brazos en contracción."
    },
    {
      name: "Press de pecho sentado (Chest Press machine)",
      primary_muscle: "Pectoral",
      muscle_groups: ["Pectoral", "Tríceps", "Deltoides anterior"],
      modality: "Máquinas",
      equipment: "Máquina Selectorizada",
      description: "Movimiento guiado ideal para trabajar cerca del fallo con máxima estabilidad."
    },
    {
      name: "Aperturas en máquina Peck-Deck / Contractora",
      primary_muscle: "Pectoral",
      muscle_groups: ["Pectoral"],
      modality: "Máquinas",
      equipment: "Máquina Peck-Deck",
      description: "Aislamiento estricto con curva de resistencia óptima en máxima contracción."
    },
    {
      name: "Press inclinado en máquina Hammer Strength",
      primary_muscle: "Pectoral",
      muscle_groups: ["Pectoral", "Pectoral superior", "Tríceps"],
      modality: "Máquinas",
      equipment: "Máquina Hammer Articulada",
      description: "Carga de discos en plano inclinado con trayectoria convergente independiente."
    },

    // 2. HOMBRO (DELTOIDES)
    {
      name: "Press militar de pie con barra",
      primary_muscle: "Hombro",
      muscle_groups: ["Hombro", "Deltoides anterior", "Tríceps", "Core"],
      modality: "Peso Libre",
      equipment: "Barra",
      description: "Empuje vertical vertical básico para deltoides anterior, fuerza y estabilidad del core."
    },
    {
      name: "Elevaciones laterales con mancuernas",
      primary_muscle: "Hombro",
      muscle_groups: ["Hombro", "Deltoides lateral"],
      modality: "Peso Libre",
      equipment: "Mancuernas",
      description: "Abducción de hombro para hipertrofia de la cabeza lateral del deltoides."
    },
    {
      name: "Pájaro / Elevaciones posteriores con mancuernas",
      primary_muscle: "Hombro",
      muscle_groups: ["Hombro", "Deltoides posterior", "Trapecio"],
      modality: "Peso Libre",
      equipment: "Mancuernas",
      description: "Trabajo del deltoides posterior y musculatura escapular en posición inclinada."
    },
    {
      name: "Elevaciones laterales a una mano con polea baja",
      primary_muscle: "Hombro",
      muscle_groups: ["Hombro", "Deltoides lateral"],
      modality: "Poleas",
      equipment: "Polea Baja",
      description: "Tensión uniforme desde el inicio del recorrido para el deltoides lateral."
    },
    {
      name: "Face pull en polea alta con cuerda",
      primary_muscle: "Hombro",
      muscle_groups: ["Hombro", "Deltoides posterior", "Trapecio", "Manguito rotador"],
      modality: "Poleas",
      equipment: "Polea Alta con Cuerda",
      description: "Salud articular del hombro, retracción escapular y deltoides posterior."
    },
    {
      name: "Elevación frontal con barra en polea baja",
      primary_muscle: "Hombro",
      muscle_groups: ["Hombro", "Deltoides anterior"],
      modality: "Poleas",
      equipment: "Polea Baja con Barra",
      description: "Flexión de hombro con tensión continua en el deltoides anterior."
    },
    {
      name: "Press de hombros sentado en máquina",
      primary_muscle: "Hombro",
      muscle_groups: ["Hombro", "Deltoides anterior", "Tríceps"],
      modality: "Máquinas",
      equipment: "Máquina Selectorizada",
      description: "Empuje vertical con trayectoria guiada y soporte lumbar seguro."
    },
    {
      name: "Elevaciones laterales en máquina",
      primary_muscle: "Hombro",
      muscle_groups: ["Hombro", "Deltoides lateral"],
      modality: "Máquinas",
      equipment: "Máquina de Elevaciones Laterales",
      description: "Aislamiento del deltoides medio reduciendo la intervención del antebrazo y trapecio."
    },
    {
      name: "Aperturas invertidas en máquina Peck-Deck",
      primary_muscle: "Hombro",
      muscle_groups: ["Hombro", "Deltoides posterior"],
      modality: "Máquinas",
      equipment: "Máquina Peck-Deck Invertida",
      description: "Aislamiento guiado del deltoides posterior con máxima estabilidad."
    },

    // 3. ESPALDA
    {
      name: "Remo con barra inclinado",
      primary_muscle: "Espalda",
      muscle_groups: ["Espalda", "Dorsal", "Trapecio", "Zona lumbar"],
      modality: "Peso Libre",
      equipment: "Barra",
      description: "Constructor básico de densidad y grosor de espalda."
    },
    {
      name: "Remo con mancuerna a una mano",
      primary_muscle: "Espalda",
      muscle_groups: ["Espalda", "Dorsal ancho", "Bíceps"],
      modality: "Peso Libre",
      equipment: "Mancuerna y Banco",
      description: "Trabajo unilateral para corregir asimetrías y maximizar el rango del dorsal."
    },
    {
      name: "Peso muerto convencional o sumo",
      primary_muscle: "Espalda",
      muscle_groups: ["Espalda", "Cadena posterior", "Glúteo", "Isquiotibiales", "Erectores espinales"],
      modality: "Peso Libre",
      equipment: "Barra Olímpica",
      description: "Ejercicio rey para fuerza global y cadena posterior completa."
    },
    {
      name: "Jalón al pecho con agarre ancho o estrecho",
      primary_muscle: "Espalda",
      muscle_groups: ["Espalda", "Dorsal ancho", "Bíceps"],
      modality: "Poleas",
      equipment: "Polea Alta (Lat Pulldown)",
      description: "Tracción vertical fundamental para amplitud dorsal."
    },
    {
      name: "Remo sentado en polea baja (Gironda)",
      primary_muscle: "Espalda",
      muscle_groups: ["Espalda", "Dorsal", "Romboides", "Bíceps"],
      modality: "Poleas",
      equipment: "Polea Baja con Agarre Estrecho",
      description: "Tracción horizontal con énfasis en zona media de la espalda y dorsales."
    },
    {
      name: "Jalón con brazos rectos (Pull-over en polea alta)",
      primary_muscle: "Espalda",
      muscle_groups: ["Espalda", "Dorsal ancho", "Pectoral menor"],
      modality: "Poleas",
      equipment: "Polea Alta con Barra o Cuerda",
      description: "Aislamiento puro del dorsal ancho sin fatiga del bíceps."
    },
    {
      name: "Remo Hammer Strength articulado",
      primary_muscle: "Espalda",
      muscle_groups: ["Espalda", "Dorsal", "Romboides"],
      modality: "Máquinas",
      equipment: "Máquina Hammer Articulada",
      description: "Remo con apoyo en pecho para anular tensión lumbar y aislar dorsales."
    },
    {
      name: "Jalón en máquina con palancas",
      primary_muscle: "Espalda",
      muscle_groups: ["Espalda", "Dorsal ancho"],
      modality: "Máquinas",
      equipment: "Máquina de Jalón Convergente",
      description: "Trayectoria biomecánica optimizada y tracción divergente para el dorsal."
    },
    {
      name: "Dominadas asistidas en máquina",
      primary_muscle: "Espalda",
      muscle_groups: ["Espalda", "Dorsal", "Bíceps"],
      modality: "Máquinas",
      equipment: "Máquina Asistida con Contrapeso",
      description: "Permite regular el peso corporal para mantener técnica estricta y volumen de trabajo."
    },

    // 4. BÍCEPS
    {
      name: "Curl de bíceps de pie con barra recta o Z",
      primary_muscle: "Bíceps",
      muscle_groups: ["Bíceps", "Braquial", "Antebrazo"],
      modality: "Peso Libre",
      equipment: "Barra Recta o Barra Z",
      description: "Constructor básico de fuerza y masa en los flexores de codo."
    },
    {
      name: "Curl alterno de pie o sentado con mancuernas (con supinación)",
      primary_muscle: "Bíceps",
      muscle_groups: ["Bíceps", "Braquial"],
      modality: "Peso Libre",
      equipment: "Mancuernas",
      description: "Supinación activa de muñeca para máxima activación del bíceps braquial."
    },
    {
      name: "Curl en banco Scott (Predicador) con barra Z o mancuerna",
      primary_muscle: "Bíceps",
      muscle_groups: ["Bíceps", "Braquial anterior"],
      modality: "Peso Libre",
      equipment: "Banco Scott y Barra Z",
      description: "Elimina inercia y aísla la cabeza corta en la porción inicial del movimiento."
    },
    {
      name: "Curl de bíceps con barra recta o cuerda en polea baja",
      primary_muscle: "Bíceps",
      muscle_groups: ["Bíceps", "Braquial"],
      modality: "Poleas",
      equipment: "Polea Baja",
      description: "Tensión constante durante todo el rango articular sin puntos muertos."
    },
    {
      name: "Curl de bíceps tumbado en polea baja",
      primary_muscle: "Bíceps",
      muscle_groups: ["Bíceps"],
      modality: "Poleas",
      equipment: "Polea Baja y Banco/Suelo",
      description: "Anula balanceo del cuerpo y aísla bíceps con estricta fijación escapular."
    },
    {
      name: "Curl tipo 'Cristo' en poleas altas opuestas",
      primary_muscle: "Bíceps",
      muscle_groups: ["Bíceps", "Cabeza corta"],
      modality: "Poleas",
      equipment: "Doble Polea Alta",
      description: "Flexión de codo con brazos en abducción para pico de contracción."
    },
    {
      name: "Curl de bíceps en máquina de predicador",
      primary_muscle: "Bíceps",
      muscle_groups: ["Bíceps", "Braquial"],
      modality: "Máquinas",
      equipment: "Máquina Selectorizada Scott",
      description: "Soporte rígido de brazos y curva de fuerza uniforme."
    },
    {
      name: "Curl de bíceps sentado articulado",
      primary_muscle: "Bíceps",
      muscle_groups: ["Bíceps"],
      modality: "Máquinas",
      equipment: "Máquina Articulada de Bíceps",
      description: "Movimiento convergente guiado para máxima congestión muscular."
    },

    // 5. TRÍCEPS
    {
      name: "Press francés con barra Z o mancuernas tumbado",
      primary_muscle: "Tríceps",
      muscle_groups: ["Tríceps", "Cabeza larga"],
      modality: "Peso Libre",
      equipment: "Barra Z o Mancuernas y Banco Plano",
      description: "Extensión de codo en decúbito supino con gran énfasis en cabeza larga."
    },
    {
      name: "Extensión trasnuca con mancuerna a dos manos",
      primary_muscle: "Tríceps",
      muscle_groups: ["Tríceps", "Cabeza larga"],
      modality: "Peso Libre",
      equipment: "Mancuerna Pesada",
      description: "Máximo estiramiento del tríceps por encima de la cabeza."
    },
    {
      name: "Press de banca con agarre cerrado",
      primary_muscle: "Tríceps",
      muscle_groups: ["Tríceps", "Pectoral", "Deltoides anterior"],
      modality: "Peso Libre",
      equipment: "Barra y Banco Plano",
      description: "Ejercicio compuesto básico de sobrecarga para fuerza de tríceps."
    },
    {
      name: "Extensión de tríceps en polea alta con cuerda",
      primary_muscle: "Tríceps",
      muscle_groups: ["Tríceps", "Cabeza lateral"],
      modality: "Poleas",
      equipment: "Polea Alta con Cuerda",
      description: "Permite abrir la cuerda al final para una contracción completa."
    },
    {
      name: "Extensión de tríceps en polea alta con barra recta o en 'V'",
      primary_muscle: "Tríceps",
      muscle_groups: ["Tríceps", "Cabeza lateral y medial"],
      modality: "Poleas",
      equipment: "Polea Alta con Barra en V",
      description: "Permite mover mayor carga con agarre firme y estable."
    },
    {
      name: "Extensión Katana / trasnuca en polea baja o media",
      primary_muscle: "Tríceps",
      muscle_groups: ["Tríceps", "Cabeza larga"],
      modality: "Poleas",
      equipment: "Polea Cruzada Media/Baja",
      description: "Extensión unilateral o bilateral alineada con las fibras de la cabeza larga."
    },
    {
      name: "Extensión de tríceps en máquina sentada",
      primary_muscle: "Tríceps",
      muscle_groups: ["Tríceps"],
      modality: "Máquinas",
      equipment: "Máquina Selectorizada de Tríceps",
      description: "Aislamiento seguro para trabajar series pesadas o técnicas de fallo."
    },
    {
      name: "Fondos (Dips) asistidos en máquina",
      primary_muscle: "Tríceps",
      muscle_groups: ["Tríceps", "Pectoral inferior", "Deltoides anterior"],
      modality: "Máquinas",
      equipment: "Máquina de Fondos Asistida",
      description: "Excelente para sobrecarga de tríceps con tronco recto y asistencia de peso."
    },

    // 6. ABDOMEN
    {
      name: "Crunch abdominal en suelo (con disco o mancuerna sobre el pecho)",
      primary_muscle: "Abdomen",
      muscle_groups: ["Abdomen", "Recto abdominal"],
      modality: "Peso Libre",
      equipment: "Disco o Mancuerna y Colchoneta",
      description: "Flexión espinal controlada con resistencia adicional sobre el torso."
    },
    {
      name: "Elevación de piernas estiradas en suelo o banco plano",
      primary_muscle: "Abdomen",
      muscle_groups: ["Abdomen", "Psoas", "Recto abdominal inferior"],
      modality: "Peso Libre",
      equipment: "Banco Plano o Suelo",
      description: "Elevación pélvica controlada para la región inferior del abdomen."
    },
    {
      name: "Rueda abdominal (Ab wheel)",
      primary_muscle: "Abdomen",
      muscle_groups: ["Abdomen", "Core", "Erectores espinales", "Dorsales"],
      modality: "Peso Libre",
      equipment: "Rueda Abdominal",
      description: "Antiextensión espinal de alta exigencia para todo el core."
    },
    {
      name: "Crunch abdominal de rodillas en polea alta (con cuerda)",
      primary_muscle: "Abdomen",
      muscle_groups: ["Abdomen", "Recto abdominal"],
      modality: "Poleas",
      equipment: "Polea Alta con Cuerda",
      description: "Flexión del torso contra resistencia progresiva sin sobrecargar el psoas."
    },
    {
      name: "Woodchoppers (Leñadores) en polea media o alta",
      primary_muscle: "Abdomen",
      muscle_groups: ["Abdomen", "Oblicuos", "Core rotacional"],
      modality: "Poleas",
      equipment: "Polea Media con Agarre D",
      description: "Rotación y estabilidad del torso para potencia y definición de oblicuos."
    },
    {
      name: "Elevación de rodillas en polea baja",
      primary_muscle: "Abdomen",
      muscle_groups: ["Abdomen", "Flexores de cadera"],
      modality: "Poleas",
      equipment: "Polea Baja con Correas de Tobillo",
      description: "Tensión añadida a la elevación de piernas desde el suelo."
    },
    {
      name: "Máquina de crunch abdominal",
      primary_muscle: "Abdomen",
      muscle_groups: ["Abdomen", "Recto abdominal"],
      modality: "Máquinas",
      equipment: "Máquina de Crunch Selectorizada",
      description: "Sobrecarga progresiva guiada con ajuste preciso de carga."
    },
    {
      name: "Máquina de rotación del torso (oblicuos)",
      primary_muscle: "Abdomen",
      muscle_groups: ["Abdomen", "Oblicuos internos y externos"],
      modality: "Máquinas",
      equipment: "Máquina Torso Rotary",
      description: "Aislamiento rotacional seguro para cintura y oblicuos."
    },

    // 7. CUÁDRICEPS
    {
      name: "Sentadilla trasera con barra (Back Squat)",
      primary_muscle: "Cuádriceps",
      muscle_groups: ["Cuádriceps", "Glúteo", "Aductores", "Core"],
      modality: "Peso Libre",
      equipment: "Barra Olímpica y Rack",
      description: "Ejercicio rey para desarrollo de masa muscular y fuerza en miembros inferiores."
    },
    {
      name: "Sentadilla frontal con barra (Front Squat)",
      primary_muscle: "Cuádriceps",
      muscle_groups: ["Cuádriceps", "Core", "Glúteo"],
      modality: "Peso Libre",
      equipment: "Barra Olímpica y Rack",
      description: "Torso más vertical con mayor estímulo directo en cuádriceps y demanda de core."
    },
    {
      name: "Zancadas / Stiff-leg Lunges con mancuernas o barra",
      primary_muscle: "Cuádriceps",
      muscle_groups: ["Cuádriceps", "Glúteo", "Isquiotibiales"],
      modality: "Peso Libre",
      equipment: "Mancuernas o Barra",
      description: "Trabajo unilateral para equilibrio, estabilidad y masa muscular de piernas."
    },
    {
      name: "Sentadilla Goblet asistida con cable/polea baja",
      primary_muscle: "Cuádriceps",
      muscle_groups: ["Cuádriceps", "Glúteo", "Core"],
      modality: "Poleas",
      equipment: "Polea Baja",
      description: "Vector de fuerza hacia adelante que favorece flexión profunda de rodilla."
    },
    {
      name: "Zancadas o paso atrás conectado a polea baja",
      primary_muscle: "Cuádriceps",
      muscle_groups: ["Cuádriceps", "Glúteo"],
      modality: "Poleas",
      equipment: "Polea Baja con Cinturón o Agarre",
      description: "Tensión horizontal continua durante la fase excéntrica y concéntrica."
    },
    {
      name: "Extensión de cuádriceps individual con correa de tobillo en polea baja",
      primary_muscle: "Cuádriceps",
      muscle_groups: ["Cuádriceps", "Recto femoral"],
      modality: "Poleas",
      equipment: "Polea Baja con Correa de Tobillo",
      description: "Extensión unilateral en polea para aislar cuádriceps con recorrido libre."
    },
    {
      name: "Extensión de piernas en máquina (Leg Extension)",
      primary_muscle: "Cuádriceps",
      muscle_groups: ["Cuádriceps", "Recto femoral"],
      modality: "Máquinas",
      equipment: "Máquina Selectorizada de Cuádriceps",
      description: "Aislamiento total del cuádriceps en su posición de máxima contracción acortada."
    },
    {
      name: "Prensa inclinada a 45°",
      primary_muscle: "Cuádriceps",
      muscle_groups: ["Cuádriceps", "Glúteo", "Aductores"],
      modality: "Máquinas",
      equipment: "Prensa 45 Grados",
      description: "Gran sobrecarga mecánica para piernas sin fatiga axial en la columna vertebral."
    },
    {
      name: "Sentadilla Hack (Hack Squat)",
      primary_muscle: "Cuádriceps",
      muscle_groups: ["Cuádriceps", "Glúteo"],
      modality: "Máquinas",
      equipment: "Máquina Hack Squat",
      description: "Soporte de espalda que permite gran flexión de rodilla y foco absoluto en cuádriceps."
    },

    // 8. ISQUIOTIBIALES / ISQUIOSURALES
    {
      name: "Peso muerto rumano con barra o mancuernas",
      primary_muscle: "Isquiotibiales",
      muscle_groups: ["Isquiotibiales", "Glúteo", "Erectores espinales"],
      modality: "Peso Libre",
      equipment: "Barra o Mancuernas",
      description: "Bisagra de cadera básica para hipertrofia en estiramiento de femorales."
    },
    {
      name: "Buenos días con barra",
      primary_muscle: "Isquiotibiales",
      muscle_groups: ["Isquiotibiales", "Glúteo", "Erectores espinales"],
      modality: "Peso Libre",
      equipment: "Barra Olímpica",
      description: "Flexión de cadera con barra sobre hombros para cadena posterior."
    },
    {
      name: "Peso muerto a una pierna con mancuerna",
      primary_muscle: "Isquiotibiales",
      muscle_groups: ["Isquiotibiales", "Glúteo medio", "Core"],
      modality: "Peso Libre",
      equipment: "Mancuerna",
      description: "Trabajo unilateral para equilibrio, propiocepción y fuerza de isquiosurales."
    },
    {
      name: "Curl femoral de pie con correa de tobillo en polea baja",
      primary_muscle: "Isquiotibiales",
      muscle_groups: ["Isquiotibiales"],
      modality: "Poleas",
      equipment: "Polea Baja con Tobillera",
      description: "Flexión unilateral de rodilla con tensión constante."
    },
    {
      name: "Peso muerto rumano en polea baja",
      primary_muscle: "Isquiotibiales",
      muscle_groups: ["Isquiotibiales", "Glúteo"],
      modality: "Poleas",
      equipment: "Polea Baja con Barra",
      description: "Vector diagonal que mantiene tensión continua en el punto más alto."
    },
    {
      name: "Pull-through en polea baja entre las piernas",
      primary_muscle: "Isquiotibiales",
      muscle_groups: ["Isquiotibiales", "Glúteo mayor"],
      modality: "Poleas",
      equipment: "Polea Baja con Cuerda",
      description: "Bisagra de cadera segura con mínimo estrés en espalda baja."
    },
    {
      name: "Curl femoral tumbado",
      primary_muscle: "Isquiotibiales",
      muscle_groups: ["Isquiotibiales"],
      modality: "Máquinas",
      equipment: "Máquina Femoral Tumbado",
      description: "Flexión de rodilla en posición prona para contracción completa de femorales."
    },
    {
      name: "Curl femoral sentado",
      primary_muscle: "Isquiotibiales",
      muscle_groups: ["Isquiotibiales"],
      modality: "Máquinas",
      equipment: "Máquina Femoral Sentado",
      description: "Isquiotibiales en estiramiento de cadera previo, óptimo para hipertrofia."
    },
    {
      name: "Banco de hiperextensiones a 45° (enfocado en femorales)",
      primary_muscle: "Isquiotibiales",
      muscle_groups: ["Isquiotibiales", "Glúteo", "Erectores espinales"],
      modality: "Máquinas",
      equipment: "Banco Hiperextensiones 45°",
      description: "Extensión de cadera con espalda neutra o redondeada para enfatizar isquios y glúteos."
    },

    // 9. ADUCTORES
    {
      name: "Sentadilla Sumo con barra o mancuerna pesada",
      primary_muscle: "Aductores",
      muscle_groups: ["Aductores", "Glúteo", "Cuádriceps"],
      modality: "Peso Libre",
      equipment: "Barra o Mancuerna Pesada",
      description: "Postura amplia con pies en rotación externa que enfatiza aductores y glúteo."
    },
    {
      name: "Zancadas laterales con mancuernas",
      primary_muscle: "Aductores",
      muscle_groups: ["Aductores", "Cuádriceps", "Glúteos"],
      modality: "Peso Libre",
      equipment: "Mancuernas",
      description: "Desplazamiento lateral en plano frontal que estira y activa los aductores."
    },
    {
      name: "Cossack Squats (Sentadillas cosacas)",
      primary_muscle: "Aductores",
      muscle_groups: ["Aductores", "Movilidad de cadera", "Cuádriceps"],
      modality: "Peso Libre",
      equipment: "Peso Corporal o Pesa Rusa",
      description: "Profundidad unilateral en plano frontal para fuerza y flexibilidad de aductores."
    },
    {
      name: "Aducción de cadera cruzando la pierna con correa de tobillo en polea baja",
      primary_muscle: "Aductores",
      muscle_groups: ["Aductores"],
      modality: "Poleas",
      equipment: "Polea Baja con Tobillera",
      description: "Aislamiento en polea cruzando la pierna por delante del cuerpo."
    },
    {
      name: "Máquina específica de aductores (Aductor sentado)",
      primary_muscle: "Aductores",
      muscle_groups: ["Aductores"],
      modality: "Máquinas",
      equipment: "Máquina Selectorizada de Aductores",
      description: "Aislamiento biomecánico cómodo y efectivo para progresión de cargas."
    },

    // 10. GLÚTEO
    {
      name: "Hip Thrust (Empuje de cadera) con barra",
      primary_muscle: "Glúteo",
      muscle_groups: ["Glúteo mayor", "Isquiotibiales"],
      modality: "Peso Libre",
      equipment: "Barra y Banco Acolchado",
      description: "Ejercicio de mayor activación y sobrecarga concéntrica para el glúteo mayor."
    },
    {
      name: "Zancadas búlgaras con mancuernas",
      primary_muscle: "Glúteo",
      muscle_groups: ["Glúteo mayor", "Cuádriceps", "Aductores"],
      modality: "Peso Libre",
      equipment: "Mancuernas y Banco",
      description: "Pie trasero elevado e inclinación de torso para máximo estiramiento del glúteo."
    },
    {
      name: "Step-ups (subidas a cajón) con mancuernas",
      primary_muscle: "Glúteo",
      muscle_groups: ["Glúteo mayor", "Cuádriceps"],
      modality: "Peso Libre",
      equipment: "Mancuernas y Cajón Pliométrico",
      description: "Empuje vertical unilateral enfatizando extensión de cadera en la pierna de apoyo."
    },
    {
      name: "Patada de glúteo hacia atrás con correa de tobillo en polea baja",
      primary_muscle: "Glúteo",
      muscle_groups: ["Glúteo mayor"],
      modality: "Poleas",
      equipment: "Polea Baja con Tobillera",
      description: "Extensión pura de cadera con trayectoria controlada y tensión uniforme."
    },
    {
      name: "Abducción de cadera lateral con correa de tobillo en polea baja",
      primary_muscle: "Glúteo",
      muscle_groups: ["Glúteo medio", "Glúteo menor"],
      modality: "Poleas",
      equipment: "Polea Baja con Tobillera",
      description: "Fortalecimiento de abductores y estabilidad pélvica."
    },
    {
      name: "Pull-through en polea baja",
      primary_muscle: "Glúteo",
      muscle_groups: ["Glúteo mayor", "Isquiotibiales"],
      modality: "Poleas",
      equipment: "Polea Baja con Cuerda",
      description: "Bisagra de cadera con pico de tensión en máxima extensión de cadera."
    },
    {
      name: "Máquina específica de Hip Thrust",
      primary_muscle: "Glúteo",
      muscle_groups: ["Glúteo mayor"],
      modality: "Máquinas",
      equipment: "Máquina Hip Thrust Articulada",
      description: "Facilidad de colocación y estabilidad perfecta para empuje de cadera."
    },
    {
      name: "Máquina de abducción de cadera sentada (Abductor)",
      primary_muscle: "Glúteo",
      muscle_groups: ["Glúteo medio", "Glúteo menor", "Tensor de fascia lata"],
      modality: "Máquinas",
      equipment: "Máquina Selectorizada de Abductores",
      description: "Aislamiento estricto de glúteo medio y superior."
    },
    {
      name: "Máquina de patada de glúteo (Glute Kickback)",
      primary_muscle: "Glúteo",
      muscle_groups: ["Glúteo mayor"],
      modality: "Máquinas",
      equipment: "Máquina Glute Kickback",
      description: "Movimiento guiado para contracción máxima del glúteo mayor."
    },

    // 11. GEMELOS (GASTRONEMIOS Y SÓLEO)
    {
      name: "Elevación de talones de pie a una mano cargando mancuerna",
      primary_muscle: "Gemelos",
      muscle_groups: ["Gemelos", "Gastronemios"],
      modality: "Peso Libre",
      equipment: "Mancuerna y Escalón/Bloque",
      description: "Trabajo unilateral con rango completo de flexión dorsal y plantar."
    },
    {
      name: "Elevación de talones estilo 'Donkey' (con compañero o peso encorvado)",
      primary_muscle: "Gemelos",
      muscle_groups: ["Gemelos", "Gastronemios"],
      modality: "Peso Libre",
      equipment: "Escalón y Peso/Compañero",
      description: "Cadera flexionada a 90° para estiramiento adicional de gastronemios."
    },
    {
      name: "Elevación de talones sentado con barra sobre los muslos",
      primary_muscle: "Gemelos",
      muscle_groups: ["Gemelos", "Sóleo"],
      modality: "Peso Libre",
      equipment: "Barra, Almohadilla y Banco",
      description: "Rodillas flexionadas para aislar el sóleo anulando gastronemios."
    },
    {
      name: "Elevación de talones de pie sobre un escalón/bloque conectado a polea baja",
      primary_muscle: "Gemelos",
      muscle_groups: ["Gemelos", "Gastronemios"],
      modality: "Poleas",
      equipment: "Polea Baja con Cinturón/Agarre",
      description: "Carga continua directa sobre los hombros o cintura."
    },
    {
      name: "Elevación de gemelos de pie en máquina",
      primary_muscle: "Gemelos",
      muscle_groups: ["Gemelos", "Gastronemios"],
      modality: "Máquinas",
      equipment: "Máquina de Gemelos de Pie",
      description: "Apoyo en hombros con recorrido completo y pausa en estiramiento."
    },
    {
      name: "Elevación de gemelos sentado en máquina (enfocado en el sóleo)",
      primary_muscle: "Gemelos",
      muscle_groups: ["Gemelos", "Sóleo"],
      modality: "Máquinas",
      equipment: "Máquina de Sóleo Sentado",
      description: "Almohadillas sobre los muslos para aislamiento absoluto del sóleo."
    },
    {
      name: "Elevación de talones en prensa de piernas",
      primary_muscle: "Gemelos",
      muscle_groups: ["Gemelos", "Gastronemios"],
      modality: "Máquinas",
      equipment: "Prensa de Piernas 45°",
      description: "Excelente estabilidad para mover grandes cargas con piernas extendidas."
    },

    // 12. ANTEBRAZO
    {
      name: "Curl de muñeca en pronación (palmas hacia abajo) con barra o mancuernas",
      primary_muscle: "Antebrazo",
      muscle_groups: ["Antebrazo", "Extensores de muñeca"],
      modality: "Peso Libre",
      equipment: "Barra o Mancuernas",
      description: "Fortalecimiento de extensores del antebrazo y estabilidad de muñeca."
    },
    {
      name: "Curl de muñeca en supinación (palmas hacia arriba) con barra",
      primary_muscle: "Antebrazo",
      muscle_groups: ["Antebrazo", "Flexores de muñeca"],
      modality: "Peso Libre",
      equipment: "Barra y Banco",
      description: "Fortalecimiento de flexores del antebrazo y grosor del brazo inferior."
    },
    {
      name: "Paseo del granjero (Farmer’s Walk) con mancuernas pesadas",
      primary_muscle: "Antebrazo",
      muscle_groups: ["Antebrazo", "Agarre", "Trapecios", "Core"],
      modality: "Peso Libre",
      equipment: "Mancuernas Pesadas o Barras Farmer",
      description: "Fuerza de agarre isométrica, estabilidad del core y resistencia general."
    },
    {
      name: "Curl de muñeca en supinación en polea baja",
      primary_muscle: "Antebrazo",
      muscle_groups: ["Antebrazo", "Flexores de muñeca"],
      modality: "Poleas",
      equipment: "Polea Baja con Barra Corta",
      description: "Tensión constante en flexión de muñeca."
    },
    {
      name: "Curl de muñeca en pronación en polea baja",
      primary_muscle: "Antebrazo",
      muscle_groups: ["Antebrazo", "Extensores de muñeca"],
      modality: "Poleas",
      equipment: "Polea Baja con Barra Corta",
      description: "Tensión uniforme para extensores sin pérdidas de tensión en la parte superior."
    },
    {
      name: "Enrollamiento de cuerda con peso sujeto a polea baja",
      primary_muscle: "Antebrazo",
      muscle_groups: ["Antebrazo", "Flexores y extensores"],
      modality: "Poleas",
      equipment: "Polea Baja o Wrist Roller",
      description: "Resistencia continua en rotación de muñecas para congestión extrema de antebrazos."
    },
    {
      name: "Máquina específica de flexión/extensión de muñeca",
      primary_muscle: "Antebrazo",
      muscle_groups: ["Antebrazo"],
      modality: "Máquinas",
      equipment: "Máquina de Antebrazo",
      description: "Movimiento guiado y cómodo para antebrazos con regulación milimétrica."
    },
    {
      name: "Uso de Grippers o prensas mecánicas de mano",
      primary_muscle: "Antebrazo",
      muscle_groups: ["Antebrazo", "Fuerza de agarre / Crush Grip"],
      modality: "Máquinas",
      equipment: "Hand Gripper / Prensa de Mano",
      description: "Desarrollo de fuerza de cierre y aplastamiento en la mano y dedos."
    }
  ];

  for (const ex of catalog) {
    // Check if exercise with this name already exists in database
    const existing = Dao(db).findFirstRecordByData("exercises", "name", ex.name);
    if (!existing) {
      const record = new Record(collection, {
        name: ex.name,
        primary_muscle: ex.primary_muscle,
        muscle_groups: ex.muscle_groups,
        modality: ex.modality,
        equipment: ex.equipment,
        description: ex.description
      });
      Dao(db).saveRecord(record);
    }
  }
}, (db) => {
  return null;
});
