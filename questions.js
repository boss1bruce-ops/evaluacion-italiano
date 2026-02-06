// ============================================
// BANCO DE PREGUNTAS CIENTÍFICAS
// Basado en Nuovo Vocabolario di Base (De Mauro), CEFR y estudios de interferencia
// ============================================

const questionBank = {
    // SECCIÓN 1: VOCABULARIO (25 preguntas)
    // Basado en Lessico fondamentale, alto uso y alta disponibilità
    vocabulary: [
        // A1 - Lessico fondamentale (top 250)
        {
            id: 1,
            level: "A1",
            question: "¿Qué significa la palabra 'casa' en italiano?",
            options: ["Hotel", "Casa/hogar", "Calle", "Ciudad"],
            correct: 1,
            explanation: "Lessico fondamentale - top 100 palabras"
        },
        {
            id: 2,
            level: "A1",
            question: "Completa: 'Io _____ italiano' (Yo soy italiano)",
            options: ["avere", "fare", "sono", "stare"],
            correct: 2,
            explanation: "Verbo essere - top 10 palabras más frecuentes"
        },
        {
            id: 3,
            level: "A1",
            question: "¿Cuál es el significado de 'giorno'?",
            options: ["Noche", "Año", "Día", "Mes"],
            correct: 2,
            explanation: "Lessico fondamentale - sustantivo temporal básico"
        },

        // A2 -Lessico fondamentale (250-750)
        {
            id: 4,
            level: "A2",
            question: "¿Qué significa 'ragazzo'?",
            options: ["Niño/chico", "Hombre adulto", "Anciano", "Bebé"],
            correct: 0,
            explanation: "Palabra frecuente 251-750"
        },
        {
            id: 5,
            level: "A2",
            question: "Completa: 'Ho _____ fame' (Tengo hambre)",
            options: ["molto", "troppo", "poca", "molta"],
            correct: 3,
            explanation: "Concordancia género - lessico fondamentale"
        },

        // B1 - Lessico fondamentale completo (751-2000)
        {
            id: 6,
            level: "B1",
            question: "¿Qué significa 'atteggiamento'?",
            options: ["Actitud", "Altura", "Atención", "Actividad"],
            correct: 0,
            explanation: "Lessico di alto uso - término abstracto"
        },
        {
            id: 7,
            level: "B1",
            question: "Selecciona el sinónimo de 'ottenere':",
            options: ["Perder", "Conseguir", "Olvidar", "Recordar"],
            correct: 1,
            explanation: "Verbo frecuente nivel B1"
        },

        // B2 - Lessico di alto uso (2001-5000)
        {
            id: 8,
            level: "B2",
            question: "¿Qué significa 'competenza'?",
            options: ["Competencia/habilidad", "Competición", "Compañía", "Com plejidad"],
            correct: 0,
            explanation: "Lessico di alto uso - vocabulario profesional"
        },
        {
            id: 9,
            level: "B2",
            question: "Completa: 'La sua _____ mi ha colpito' (Su elocuencia me impresionó)",
            options: ["eloquenza", "eleganza", "evidenza", "esistenza"],
            correct: 0,
            explanation: "Vocabulario formal nivel B2"
        },

        // C1 - Lessico di alta disponibilità (5001-10000)
        {
            id: 10,
            level: "C1",
            question: "¿Qué significa 'abbronzatura'?",
            options: ["Bronce (metal)", "Bronceado (piel)", "Barnizado", "Abrillantado"],
            correct: 1,
            explanation: "Lessico di alta disponibilità - específico"
        }
    ],

    // SECCIÓN 2: GRAMÁTICA (20 preguntas)
    // Basado en competencias CEFR
    grammar: [
        // A1 - Presente, artículos, pronombres
        {
            id: 11,
            level: "A1",
            question: "Completa: '_____ ragazza è bella' (La chica es bonita)",
            options: ["Il", "La", "Lo", "Le"],
            correct: 1,
            explanation: "Artículo definido femenino singular"
        },
        {
            id: 12,
            level: "A1",
            question: "Conjuga 'avere' (yo tengo):",
            options: ["ho", "hai", "ha", "hanno"],
            correct: 0,
            explanation: "Presente indicativo - verbo avere"
        },

        // A2 - Passato prossimo, imperfetto
        {
            id: 13,
            level: "A2",
            question: "Completa: 'Ieri _____ andato al cinema' (Ayer fui al cine)",
            options: ["ho", "sono", "ero", "avevo"],
            correct: 1,
            explanation: "Passato prossimo con essere (verbo de movimiento)"
        },
        {
            id: 14,
            level: "A2",
            question: "¿Cuál es correcto? 'Quando ero bambino, _____ sempre' (Cuando era niño, jugaba siempre)",
            options: ["gioco", "giocavo", "ho giocato", "giocherò"],
            correct: 1,
            explanation: "Imperfetto para acciones habituales en pasado"
        },

        // B1 - Congiuntivo presente, imperativo
        {
            id: 15,
            level: "B1",
            question: "Completa: 'Penso che lui _____ ragione' (Pienso que él tiene razón)",
            options: ["ha", "abbia", "avesse", "avrà"],
            correct: 1,
            explanation: "Congiuntivo presente después de 'penso che'"
        },
        {
            id: 16,
            level: "B1",
            question: "Imperativo informal (tú): '_____ qui!' (¡Ven aquí!)",
            options: ["Viene", "Vieni", "Venga", "Venite"],
            correct: 1,
            explanation: "Imperativo segunda persona singular"
        },

        // B2 - Congiuntivo imperfetto, condizionale
        {
            id: 17,
            level: "B2",
            question: "Completa: 'Se _____ più tempo, verrei' (Si tuviera más tiempo, vendría)",
            options: ["ho", "avessi", "avrò", "abbia"],
            correct: 1,
            explanation: "Congiuntivo imperfetto en período hipotético"
        },
        {
            id: 18,
            level: "B2",
            question: "Condizionale composto: 'Se l'avessi saputo, _____ diversamente' (Si lo hubiera sabido, habría actuado diferente)",
            options: ["agisco", "ho agito", "agirò", "avrei agito"],
            correct: 3,
            explanation: "Condizionale passato"
        },

        // C1 - Passato remoto, concordancia compleja
        {
            id: 19,
            level: "C1",
            question: "Passato remoto (3ª persona singular) de 'essere':",
            options: ["è stato", "era", "fu", "fosse"],
            correct: 2,
            explanation: "Passato remoto - uso literario"
        },
        {
            id: 20,
            level: "C1",
            question: "Completa correctamente: 'Le decisioni _____ dal comitato furono contestate'",
            options: ["prese", "presi", "presa", "prende"],
            correct: 0,
            explanation: "Concordancia participio plural femenino"
        }
    ],

    // SECCIÓN 3: COMPRENSIÓN (15 preguntas)
    // Basado en Input Hypothesis (Krashen i+1)
    comprehension: [
        // A1
        {
            id: 21,
            level: "A1",
            question: "Lee: 'Mi chiamo Marco. Ho 25 anni.' ¿Qué información da Marco?",
            options: ["Su trabajo", "Su nombre y edad", "Su ciudad", "Su familia"],
            correct: 1,
            explanation: "Comprensión literal - información básica"
        },

        // A2
        {
            id: 22,
            level: "A2",
            question: "Lee: 'Domani andrò al mare con i miei amici.' ¿Qué hará mañana?",
            options: ["Ir a la montaña", "Ir al mar con amigos", "Trabajar", "Estudiar"],
            correct: 1,
            explanation: "Comprensión de planes futuros simples"
        },

        // B1
        {
            id: 23,
            level: "B1",
            question: "Lee: 'Nonostante la pioggia, abbiamo deciso di uscire lo stesso.' ¿Qué hicieron?",
            options: ["Se quedaron en casa por la lluvia", "Salieron a pesar de la lluvia", "Esperaron a que parara de llover", "Cancelaron los planes"],
            correct: 1,
            explanation: "Comprensión de conectores adversativos (nonostante)"
        },

        // B2
        {
            id: 24,
            level: "B2",
            question: "Lee: 'Il governo ha annunciato misure volte a ridurre le emissioni di CO2 entro il 2030.' ¿Cuál es el objetivo?",
            options: ["Aumentar la producción", "Reducir emisiones de CO2 para 2030", "Crear nuevos empleos", "Aumentar impuestos"],
            correct: 1,
            explanation: "Comprensión de texto formal/político"
        },

        // C1
        {
            id: 25,
            level: "C1",
            question: "Lee: 'L'ambiguità del suo discorso ha suscitato perplessità tra gli analisti.' ¿Qué causó el discurso?",
            options: ["Claridad", "Confusión/perplejidad", "Acuerdo unánime", "Indiferencia"],
            correct: 1,
            explanation: "Comprensión de lenguaje abstracto y matizado"
        }
    ],

    // SECCIÓN 4: FALSOS AMIGOS ESPAÑOL-ITALIANO (10 preguntas)
    // Basado en Área 4 - top 10 falsos amigos críticos
    falseFriends: [
        {
            id: 26,
            level: "interferencia",
            question: "¿Qué significa 'burro' en italiano?",
            options: ["Asno/burro (animal)", "Mantequilla", "Burla", "Burocracia"],
            correct: 1,
            explanation: "Falso amigo crítico #1 - IT: burro = mantequilla / ES: burro = asno (IT: asino)"
        },
        {
            id: 27,
            level: "interferencia",
            question: "Traduce al italiano: 'Voy a SALIR' (uscire)",
            options: ["salire", "uscire", "saltare", "salvare"],
            correct: 1,
            explanation: "Falso amigo #2 - IT: salire = subir / ES: salir = uscire"
        },
        {
            id: 28,
            level: "interferencia",
            question: "¿Qué significa 'pronto' en italiano?",
            options: ["Pronto/rápido", "Listo/preparado", "Prensa", "Pronunciar"],
            correct: 1,
            explanation: "Falso amigo #3 - IT: pronto = listo / ES: pronto = veloce/in fretta"
        },
        {
            id: 29,
            level: "interferencia",
            question: "Traduce al italiano: 'Necesito ACEITE de oliva'",
            options: ["aceto", "olio", "acido", "acetone"],
            correct: 1,
            explanation: "Falso amigo #4 - IT: aceto = vinagre / ES: aceite = olio"
        },
        {
            id: 30,
            level: "interferencia",
            question: "¿Qué significa 'gamba' en italiano?",
            options: ["Gamba (mariscos)", "Pierna", "Juego", "Ganancia"],
            correct: 1,
            explanation: "Falso amigo #5 - IT: gamba = pierna / ES: gamba = gambero"
        },
        {
            id: 31,
            level: "interferencia",
            question: "Traduce: 'Voy a GUARDAR el documento'",
            options: ["guardare", "salvare", "conservare", "proteggere"],
            correct: 1,
            explanation: "Falso amigo #6 - IT: guardare = mirar / ES: guardar = salvare"
        },
        {
            id: 32,
            level: "interferencia",
            question: "¿Qué significa 'largo' en italiano?",
            options: ["Largo (longitud)", "Ancho", "Alto", "Corto"],
            correct: 1,
            explanation: "Falso amigo #7 - IT: largo = ancho / ES: largo = lungo"
        },
        {
            id: 33,
            level: "interferencia",
            question: "Traduce: 'Necesito un VASO de agua'",
            options: ["vaso", "bicchiere", "vetro", "coppa"],
            correct: 1,
            explanation: "Falso amigo #8 - IT: vaso = florero/maceta / ES: vaso = bicchiere"
        },
        {
            id: 34,
            level: "interferencia",
            question: "¿Qué significa 'parenti' en italiano?",
            options: ["Padres", "Parientes/familiares", "Pareja", "Parroquianos"],
            correct: 1,
            explanation: "Falso amigo #9 - IT: parenti = familiares / ES: padres = genitori"
        },
        {
            id: 35,
            level: "interferencia",
            question: "Traduce: 'Trabajo en una EMPRESA grande'",
            options: ["firma", "azienda", "impresa", "compañía"],
            correct: 1,
            explanation: "Falso amigo #10 - IT: firma = firma/signature / ES: empresa = azienda"
        }
    ]
};

// Consolidar todas las preguntas en un solo array
const allQuestions = [
    ...questionBank.vocabulary,
    ...questionBank.grammar,
    ...questionBank.comprehension,
    ...questionBank.falseFriends
];
