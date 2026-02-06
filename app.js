// ============================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ============================================
let currentSection = 'landing';
let surveyData = {};
let currentQuestionIndex = 0;
let userAnswers = [];
let startTime = null;

// ============================================
// NAVEGACIÓN ENTRE SECCIONES
// ============================================
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    currentSection = sectionId;
}

function startSurvey() {
    showSection('survey');
}

// ============================================
// MANEJO DE ENCUESTA
// ============================================
document.getElementById('surveyForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Recopilar datos de encuesta
    const formData = new FormData(e.target);
    surveyData = Object.fromEntries(formData);
    surveyData.surveyCompleted = true;

    // Iniciar test
    startTime = new Date();
    initializeTest();
    showSection('test');
});

function skipSurvey() {
    // Usuario decide no completar encuesta
    surveyData = {
        name: 'Anónimo',
        email: 'no-proporcionado@andiamo.com',
        surveyCompleted: false
    };

    // Iniciar test
    startTime = new Date();
    initializeTest();
    showSection('test');
}

// ============================================
// INICIALIZACIÓN DEL TEST
// ============================================
function initializeTest() {
    currentQuestionIndex = 0;
    userAnswers = [];

    // Actualizar UI
    document.getElementById('totalQuestions').textContent = allQuestions.length;

    // Renderizar primera pregunta
    renderQuestion();
    updateProgress();
}

// ============================================
// RENDERIZADO DE PREGUNTAS
// ============================================
function renderQuestion() {
    const question = allQuestions[currentQuestionIndex];
    const container = document.getElementById('questionContainer');

    // Determinar sección actual
    let sectionName = '';
    if (currentQuestionIndex < 10) sectionName = '📚 Vocabulario';
    else if (currentQuestionIndex < 20) sectionName = '📝 Gramática';
    else if (currentQuestionIndex < 25) sectionName = '📖 Comprensión';
    else sectionName = '⚠️ Falsos Amigos';

    document.getElementById('sectionLabel').textContent = sectionName;

    // Renderizar pregunta
    container.innerHTML = `
        <div class="question active">
            <h3 class="question-text">${question.question}</h3>
            <div class="options">
                ${question.options.map((option, index) => `
                    <div class="option" data-index="${index}" onclick="selectOption(${index})">
                        ${option}
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Restaurar selección previa si existe
    if (userAnswers[currentQuestionIndex] !== undefined) {
        const selectedIndex = userAnswers[currentQuestionIndex];
        document.querySelectorAll('.option')[selectedIndex]?.classList.add('selected');
    }
}

// ============================================
// SELECCIÓN DE OPCIONES
// ============================================
function selectOption(index) {
    // Remover selección previa
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Agregar nueva selección
    document.querySelectorAll('.option')[index].classList.add('selected');

    // Guardar respuesta
    userAnswers[currentQuestionIndex] = index;

    // Habilitar botón siguiente
    document.getElementById('nextBtn').disabled = false;
}

// ============================================
// NAVEGACIÓN ENTRE PREGUNTAS
// ============================================
function nextQuestion() {
    if (currentQuestionIndex < allQuestions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
        updateProgress();
        updateNavigationButtons();
    } else {
        // Finalizar test
        finishTest();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
        updateProgress();
        updateNavigationButtons();
    }
}

function updateNavigationButtons() {
    document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;

    if (currentQuestionIndex === allQuestions.length - 1) {
        document.getElementById('nextBtn').textContent = 'Ver Resultados →';
    } else {
        document.getElementById('nextBtn').textContent = 'Siguiente →';
    }

    // Deshabilitar siguiente si no hay respuesta
    if (userAnswers[currentQuestionIndex] === undefined) {
        document.getElementById('nextBtn').disabled = true;
    }
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;
    document.getElementById('testProgress').style.width = progress + '%';
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
}

// ============================================
// CÁLCULO DE RESULTADOS
// ============================================
function finishTest() {
    const endTime = new Date();
    const timeSpent = Math.round((endTime - startTime) / 60000); // minutos

    // Calcular puntajes por dimensión
    const scores = calculateScores();

    // Determinar nivel CEFR
    const cefrLevel = determineCEFRLevel(scores);

    // Generar hoja de ruta
    const roadmap = generateRoadmap(scores, cefrLevel);

    // Guardar en Google Sheets
    sendToGoogleSheets({
        ...surveyData,
        ...scores,
        cefrLevel,
        timeSpent,
        timestamp: new Date().toISOString()
    });

    // Mostrar resultados
    displayResults(scores, cefrLevel, roadmap);
    showSection('results');
}

function calculateScores() {
    let vocabularyCorrect = 0;
    let grammarCorrect = 0;
    let comprehensionCorrect = 0;
    let falseFriendsCorrect = 0;

    allQuestions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correct;

        if (index < 10) {
            if (isCorrect) vocabularyCorrect++;
        } else if (index < 20) {
            if (isCorrect) grammarCorrect++;
        } else if (index < 25) {
            if (isCorrect) comprehensionCorrect++;
        } else {
            if (isCorrect) falseFriendsCorrect++;
        }
    });

    return {
        vocabulary: Math.round((vocabularyCorrect / 10) * 100),
        grammar: Math.round((grammarCorrect / 10) * 100),
        comprehension: Math.round((comprehensionCorrect / 5) * 100),
        falseFriends: Math.round((falseFriendsCorrect / 10) * 100)
    };
}

function determineCEFRLevel(scores) {
    // Pesos: vocabulario 40%, gramática 30%, comprensión 20%, falsos amigos 10%
    const overallScore =
        (scores.vocabulary * 0.4) +
        (scores.grammar * 0.3) +
        (scores.comprehension * 0.2) +
        (scores.falseFriends * 0.1);

    if (overallScore <= 40) return 'A1';
    if (overallScore <= 55) return 'A2';
    if (overallScore <= 70) return 'B1';
    if (overallScore <= 78) return 'B1+';
    if (overallScore <= 88) return 'B2';
    return 'C1';
}

function generateRoadmap(scores, level) {
    const roadmap = {
        strengths: [],
        weaknesses: [],
        nextSteps: []
    };

    // Identificar fortalezas y debilidades
    Object.entries(scores).forEach(([dimension, score]) => {
        if (score >= 75) {
            roadmap.strengths.push(dimension);
        } else if (score < 60) {
            roadmap.weaknesses.push(dimension);
        }
    });

    // Generar pasos siguientes basados en nivel y debilidades
    if (level === 'A1' || level === 'A2') {
        roadmap.nextSteps.push("Enfócate en las primeras 750 palabras del Lessico fondamentale de De Mauro");
        roadmap.nextSteps.push("Practica verbos esenciales (essere, avere, fare, andare) usando FSRS");
        roadmap.nextSteps.push("Dedica 10 minutos diarios a input comprensible nivel A1-A2 (videos simples)");
    } else if (level === 'B1' || level === 'B1+') {
        roadmap.nextSteps.push("Completa el Lessico fondamentale (2,000 palabras) para alcanzar 86% de cobertura");
        roadmap.nextSteps.push("Domina el congiuntivo presente y passato prossimo");
        roadmap.nextSteps.push("Aumenta input comprensible a 30 min/día con podcasts nivel B1");
    } else {
        roadmap.nextSteps.push("Expande al Lessico di alto uso (2,001-5,000 palabras)");
        roadmap.nextSteps.push("Practica estructuras avanzadas (congiuntivo imperfetto, condizionale)");
        roadmap.nextSteps.push("Inmersión: consume contenido nativo italiano (noticias, series, libros)");
    }

    // Agregar paso específico para falsos amigos si es debilidad
    if (scores.falseFriends < 60) {
        roadmap.nextSteps.push("⚠️ CRÍTICO: Estudia los 10 falsos amigos principales (burro, salire, pronto, etc.) con tarjetas FSRS de alta dificultad");
    }

    return roadmap;
}

// ============================================
// VISUALIZACIÓN DE RESULTADOS
// ============================================
function displayResults(scores, cefrLevel, roadmap) {
    // Actualizar badge de nivel
    const levelDescriptions = {
        'A1': 'Principiante',
        'A2': 'Elemental',
        'B1': 'Intermedio',
        'B1+': 'Intermedio Alto',
        'B2': 'Intermedio Avanzado',
        'C1': 'Avanzado'
    };

    document.querySelector('.level-badge').textContent = cefrLevel;
    document.querySelector('.level-description').textContent = levelDescriptions[cefrLevel];

    // Crear radar chart
    createRadarChart(scores);

    // Mostrar desglose por competencia
    displayCompetencies(scores);

    // Mostrar hoja de ruta
    displayRoadmap(roadmap, cefrLevel);
}

function createRadarChart(scores) {
    const ctx = document.getElementById('radarChart').getContext('2d');

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Vocabulario', 'Gramática', 'Comprensión', 'Falsos Amigos'],
            datasets: [{
                label: 'Tu Nivel',
                data: [scores.vocabulary, scores.grammar, scores.comprehension, scores.falseFriends],
                backgroundColor: 'rgba(214, 169, 74, 0.2)',
                borderColor: '#D6A94A',
                borderWidth: 3,
                pointBackgroundColor: '#0F4C5C',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#D6A94A'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        color: '#0F4C5C'
                    },
                    grid: {
                        color: 'rgba(15, 76, 92, 0.1)'
                    },
                    pointLabels: {
                        color: '#0F4C5C',
                        font: {
                            size: 14,
                            family: 'Poppins'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function displayCompetencies(scores) {
    const dimensionNames = {
        vocabulary: 'Vocabulario',
        grammar: 'Gramática',
        comprehension: 'Comprensión',
        falseFriends: 'Falsos Amigos'
    };

    const container = document.getElementById('competencyList');
    container.innerHTML = Object.entries(scores).map(([key, value]) => `
        <div class="competency-item">
            <span class="competency-name">${dimensionNames[key]}</span>
            <span class="competency-score">${value}%</span>
        </div>
    `).join('');
}

function displayRoadmap(roadmap, level) {
    const container = document.getElementById('roadmapContent');

    let html = '';

    if (roadmap.strengths.length > 0) {
        html += `
            <div class="roadmap-section">
                <h4>✨ Fortalezas</h4>
                <ul>
                    ${roadmap.strengths.map(s => `<li>${capitalizeFirst(s)}: Excelente dominio en esta área</li>`).join('')}
                </ul>
            </div>
        `;
    }

    if (roadmap.weaknesses.length > 0) {
        html += `
            <div class="roadmap-section">
                <h4>🎯 Áreas de Mejora</h4>
                <ul>
                    ${roadmap.weaknesses.map(w => `<li>${capitalizeFirst(w)}: Necesita más práctica</li>`).join('')}
                </ul>
            </div>
        `;
    }

    html += `
        <div class="roadmap-section">
            <h4>🚀 Próximos Pasos Recomendados</h4>
            <ul>
                ${roadmap.nextSteps.map(step => `<li>${step}</li>`).join('')}
            </ul>
        </div>
    `;

    container.innerHTML = html;
}

function capitalizeFirst(str) {
    const names = {
        vocabulary: 'Vocabulario',
        grammar: 'Gramática',
        comprehension: 'Comprensión',
        falseFriends: 'Falsos Amigos'
    };
    return names[str] || str;
}

// ============================================
// INTEGRACIÓN CON GOOGLE SHEETS
// ============================================
function sendToGoogleSheets(data) {
    // URL del Google Apps Script Web App
    const GOOGLE_SCRIPT_URL = 'TU_SCRIPT_URL_AQUI'; // Lo configuraremos después

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).catch(err => {
        console.log('Datos guardados localmente:', data);
        // Fallback: guardar en localStorage
        saveToLocalStorage(data);
    });
}

function saveToLocalStorage(data) {
    const savedResults = JSON.parse(localStorage.getItem('testResults') || '[]');
    savedResults.push(data);
    localStorage.setItem('testResults', JSON.stringify(savedResults));
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================
function downloadPDF() {
    alert('Funcionalidad de descarga PDF en desarrollo. Por ahora puedes tomar un screenshot de tus resultados.');
    window.print();
}

function restartTest() {
    if (confirm('¿Estás seguro de que quieres reiniciar el test? Se perderán tus respuestas actuales.')) {
        location.reload();
    }
}

// ============================================
// EXPORTACIÓN DE DATOS (SOLO ADMIN)
// ============================================
function exportToCSV() {
    const savedResults = JSON.parse(localStorage.getItem('testResults') || '[]');

    if (savedResults.length === 0) {
        alert('No hay datos para exportar. Los datos se guardan en Google Sheets automáticamente.');
        return;
    }

    // Crear CSV
    const headers = ['Timestamp', 'Nombre', 'Email', 'Género', 'Edad', 'Idioma Nativo', 'Idiomas Previos',
        'Tiempo Estudio', 'Motivación', 'Estudio Diario', 'Vocabulario %', 'Gramática %',
        'Comprensión %', 'Falsos Amigos %', 'Nivel CEFR', 'Tiempo (min)', 'Encuesta Completada'];

    let csv = headers.join(',') + '\n';

    savedResults.forEach(result => {
        const row = [
            result.timestamp,
            result.name || 'N/A',
            result.email || 'N/A',
            result.gender || 'N/A',
            result.age || 'N/A',
            result.nativeLanguage || 'N/A',
            result.previousLanguages || 'N/A',
            result.studyTime || 'N/A',
            result.motivation || 'N/A',
            result.dailyStudy || 'N/A',
            result.vocabulary || 0,
            result.grammar || 0,
            result.comprehension || 0,
            result.falseFriends || 0,
            result.cefrLevel || 'N/A',
            result.timeSpent || 0,
            result.surveyCompleted ? 'Sí' : 'No'
        ];
        csv += row.join(',') + '\n';
    });

    // Descargar archivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `evaluaciones-andiamo-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
