// ============================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ============================================
let currentSection = 'landing';
let surveyData = {};
let currentQuestionIndex = 0;
let userAnswers = [];
let startTime = null;
let shuffledQuestions = [];

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
// FUNCIÓN AUXILIAR: MEZCLAR ARRAY
// ============================================
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ============================================
// INICIALIZACIÓN DEL TEST
// ============================================
function initializeTest() {
    // Mezclar preguntas aleatoriamente
    shuffledQuestions = shuffleArray(allQuestions);
    currentQuestionIndex = 0;
    userAnswers = [];

    // Actualizar UI
    document.getElementById('totalQuestions').textContent = shuffledQuestions.length;

    // Renderizar primera pregunta
    renderQuestion();
    updateProgress();
}

// ============================================
// RENDERIZADO DE PREGUNTAS
// ============================================
function renderQuestion() {
    const question = shuffledQuestions[currentQuestionIndex];
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
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
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

    if (currentQuestionIndex === shuffledQuestions.length - 1) {
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
    const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
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

    shuffledQuestions.forEach((question, index) => {
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

    // Mostrar revisión de errores
    displayErrorReview();
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
// REVISIÓN DE ERRORES
// ============================================
function displayErrorReview() {
    const container = document.getElementById('errorReviewContent');
    if (!container) return;

    let errorCount = 0;
    let html = '';

    shuffledQuestions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const correctAnswer = question.correct;

        if (userAnswer !== correctAnswer) {
            errorCount++;
            const userSelectedText = question.options[userAnswer] || 'No respondida';
            const correctText = question.options[correctAnswer];

            html += `
                <div class="error-item">
                    <p class="error-question"><strong>Pregunta ${index + 1}:</strong> ${question.question}</p>
                    <p class="error-user-answer">❌ Tu respuesta: ${userSelectedText}</p>
                    <p class="error-correct-answer">✅ Respuesta correcta: ${correctText}</p>
                    <p class="error-explanation">💡 ${question.explanation}</p>
                </div>
            `;
        }
    });

    if (errorCount === 0) {
        html = '<p class="perfect-score">🎉 ¡Perfecto! Respondiste todas las preguntas correctamente.</p>';
    } else {
        html = `<p class="error-count">Respondiste ${errorCount} pregunta(s) incorrectamente:</p>` + html;
    }

    container.innerHTML = html;
}

// ============================================
// INTEGRACIÓN CON GOOGLE SHEETS
// ============================================
function sendToGoogleSheets(data) {
    // URL del Google Apps Script Web App
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwRjdZV9MT2DQc6E90DTWqGQhLscMwkBmLtxmP2-GfStzIRkw7r-3_zRdJqQKFr5JW2/exec';

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
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configuración
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 20;
    let yPos = 20;

    // Título
    doc.setFontSize(22);
    doc.setTextColor(15, 76, 92);
    doc.text('Resultados - Evaluación de Italiano', pageWidth / 2, yPos, { align: 'center' });

    yPos += 15;

    // Información del usuario
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    if (surveyData.name && surveyData.name !== 'Anónimo') {
        doc.text(`Nombre: ${surveyData.name}`, marginLeft, yPos);
        yPos += 8;
    }

    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, marginLeft, yPos);
    yPos += 15;

    // Nivel CEFR
    doc.setFontSize(16);
    doc.setTextColor(15, 76, 92);
    const cefrLevel = document.querySelector('.level-badge').textContent;
    const cefrDesc = document.querySelector('.level-description').textContent;
    doc.text(`Nivel: ${cefrLevel} - ${cefrDesc}`, marginLeft, yPos);

    yPos += 15;

    // Competencias
    doc.setFontSize(14);
    doc.text('Análisis por Competencias:', marginLeft, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    const competencies = document.querySelectorAll('.competency-item');
    competencies.forEach(comp => {
        const name = comp.querySelector('.competency-name').textContent;
        const score = comp.querySelector('.competency-score').textContent;
        doc.text(`• ${name}: ${score}`, marginLeft + 5, yPos);
        yPos += 7;
    });

    yPos += 10;

    // Hoja de Ruta
    if (yPos > 240) {
        doc.addPage();
        yPos = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(15, 76, 92);
    doc.text('Hoja deRuta Personalizada:', marginLeft, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    const roadmapSections = document.querySelectorAll('.roadmap-section');
    roadmapSections.forEach(section => {
        const title = section.querySelector('h4').textContent;
        doc.setFont(undefined, 'bold');
        doc.text(title, marginLeft, yPos);
        yPos += 7;
        doc.setFont(undefined, 'normal');

        const items = section.querySelectorAll('li');
        items.forEach(item => {
            const text = item.textContent;
            const lines = doc.splitTextToSize(text, pageWidth - marginLeft * 2);
            lines.forEach(line => {
                if (yPos > 280) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(`  - ${line}`, marginLeft + 5, yPos);
                yPos += 6;
            });
        });
        yPos += 5;
    });

    // Pie de página
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(`Andiamo - Evaluación Científica de Italiano | Página ${i} de ${totalPages}`,
            pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }

    // Descargar
    const fileName = `Resultados_Italiano_${cefrLevel}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
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
