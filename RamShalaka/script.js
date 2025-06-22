document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const elements = {
        preloader: document.getElementById('preloader'),
        gridSection: document.getElementById('grid-section'),
        gridContainer: document.getElementById('grid-container'),
        resultSection: document.getElementById('result-section'),
        resultPlaceholder: document.getElementById('result-placeholder'),
        resultContent: document.getElementById('result-content'),
        chaupaiText: document.getElementById('chaupai-text'),
        conclusionText: document.getElementById('conclusion-text'),
        speakResultBtn: document.getElementById('speak-result-btn'),
        printResultBtn: document.getElementById('print-result-btn'),
        resetBtn: document.getElementById('reset-btn'),
    };

    // --- State Management ---
    const state = {
        gridLetters: [],
        chaupais: [],
    };

    const chaupaiData = [
      {
        "id": 1,
        "verse": "सुनु सिय सत्य असीष हमारी। पूजिहिं मन कामना तुम्हारी॥",
        "conclusion": "प्रश्न उत्तम है, कार्य सिद्ध होगा।"
      },
      {
        "id": 2,
        "verse": "प्रबिसि नगर कीजे सब काजा। हृदय राखि कौसलपुर राजा॥",
        "conclusion": "भगवान का स्मरण कर कार्य आरम्भ करें, कार्य सिद्ध होगा।"
      },
      {
        "id": 3,
        "verse": "उबरे अन्त न होई निबाहु। कालनेमि जिमि रावन राहू॥",
        "conclusion": "मध्यम फल। इस कार्य के अंत में भलाई नहीं।"
      },
      {
        "id": 4,
        "verse": "बिधिबश सुजन कुसंगति परहीं। फणिमणि समनिज गुन अनुसरहीं॥",
        "conclusion": "खोटे मनुष्य का संग छोड़े, विलम्ब से कार्य होगा।"
      },
      {
        "id": 5,
        "verse": "होई है सोई जो राम रचि राखा। को करि तर्क बढ़ावहिं शाखा॥",
        "conclusion": "भगवान के ऊपर कार्य छोड़ें, होने में संदेह है।"
      },
      {
        "id": 6,
        "verse": "मुद मंगलमय संत समाजू। जिमि जग जंगम तीरथ राजु॥",
        "conclusion": "प्रश्न अच्छा है, कार्य बनेगा।"
      },
      {
        "id": 7,
        "verse": "गरल सुधा रिपु करे मिताई। गोपद सिन्धु अनल सितलाई॥",
        "conclusion": "प्रश्न उत्तम है, शत्रु से जय होगी।"
      },
      {
        "id": 8,
        "verse": "वरुण कुबेर सुरेश समीरा। रन सनमुख धरि काहु न धीरा॥",
        "conclusion": "फल मध्यम है। कार्य सिद्धि में संदेह है।"
      },
      {
        "id": 9,
        "verse": "सुफल मनोरथ होई तिहारे। राम लखन सुनि भये सुखारे॥",
        "conclusion": "प्रश्न अच्छा है, मनोरथ सिद्ध होंगे, धन की प्राप्ति होगी।"
      }
    ];

    const gridData = [
        'सु', 'प्र', 'उ', 'बि', 'हो', 'मु', 'ग', 'य', 'सु', 'नु', 'चि', 'घ', 'धि', 'इं', 'द',
        'र', 'रु', 'फ', 'सि', 'त्रि', 'रे', 'बस', 'है', 'में', 'ल', 'ण', 'ल', 'य', 'न', 'अं',
        'सु', 'सो', 'ग', 'सु', 'कु', 'म', 'स', 'ग', 'त', 'ज', 'इ', 'ल', 'धा', 'ये', 'नो',
        'त्य', 'र', 'न', 'न', 'जो', 'म', 'रि', 'र', 'र', 'अ', 'की', 'हो', 'कु', 'रा', 'य',
        'पु', 'सु', 'थ', 'गी', 'जे', 'इं', 'ग', 'म', 'सं', 'क', 'रे', 'हो', 'ग', 'सं', 'नि',
        'ग', 'र', 'त', 'र', 'ग्र', 'ई', 'ह', 'व', 'व', 'ति', 'चि', 'स', 'इं', 'स', 'ति',
        'म', 'का', 'र', 'प', 'र', 'मा', 'मि', 'मी', 'हा', 'र', 'जा', 'हूं', 'हीं', 'र', 'जुं',
        'ता', 'रा', 'रे', 'री', 'ह', 'का', 'फ', 'खा', 'जि', 'ई', 'र', 'रा', 'पू', 'द', 'ल',
        'णि', 'को', 'चि', 'गो', 'ण', 'म', 'ज', 'य', 'ने', 'प', 'क', 'ज', 'प', 'स', 'ल',
        'हि', 'रा', 'गि', 'गि', 'रि', 'ग', 'द', 'न', 'ख', 'म', 'खि', 'जि', 'सम', 'त', 'जं',
        'सिं', 'मु', 'न', 'न', 'कौ', 'मि', 'नि', 'र', 'ग', 'न्यु', 'ख', 'सु', 'का', 'श', 'र',
        'ज', 'क', 'म', 'अ', 'ध', 'मि', 'म', 'ल', 'र', 'गु', 'व', 'तो', 'न', 'रि', 'भ',
        'ना', 'पु', 'व', 'ण', 'हा', 'र', 'ल', 'का', 'ए', 'तु', 'र', 'ण', 'अ', 'व', 'ध',
        'सिं', 'हूं', 'सु', 'ह', 'रा', 'र', 'नु', 'हि', 'र', 'त', 'न', 'ख', 'र', 'ज', 'र',
        'सर', 'रा', 'श', 'ला', 'धी', 'र', 'री', 'र', 'हूं', 'हीं', 'खा', 'जू', 'ई', 'रा', 'रे'
    ];

    // --- Initialization ---
    function initialize() {
        state.chaupais = chaupaiData;
        state.gridLetters = gridData;
        createGrid();
        elements.preloader.classList.add('hidden');
    }

    // --- UI Functions ---
    function createGrid() {
        elements.gridContainer.innerHTML = '';
        state.gridLetters.forEach((letter, i) => {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.textContent = letter || '';
            cell.setAttribute('role', 'button');
            cell.setAttribute('aria-label', letter || 'Empty cell');
            cell.tabIndex = 0;

            if (letter) {
                cell.dataset.index = i;
            } else {
                cell.classList.add('empty');
                cell.setAttribute('aria-disabled', 'true');
            }
            elements.gridContainer.appendChild(cell);
        });
    }

    function updateUIForResult(result) {
        elements.chaupaiText.textContent = result.chaupai.verse;
        elements.conclusionText.textContent = result.chaupai.conclusion;

        elements.resultPlaceholder.classList.add('hidden');
        elements.resultContent.classList.remove('hidden');
        elements.resetBtn.classList.remove('hidden');

        animatePath(result.indices);
    }

    function resetUI() {
        elements.resultPlaceholder.classList.remove('hidden');
        elements.resultContent.classList.add('hidden');
        elements.resetBtn.classList.add('hidden');
        
        const cells = elements.gridContainer.children;
        Array.from(cells).forEach(cell => {
            cell.classList.remove('selected', 'path', 'no-click');
        });
    }

    function animatePath(indices) {
        indices.forEach((index, i) => {
            setTimeout(() => {
                const cell = elements.gridContainer.querySelector(`[data-index='${index}']`);
                if (cell) {
                    if (i === 0) {
                        cell.classList.add('selected');
                    } else {
                        cell.classList.add('path');
                    }
                }
            }, i * 100);
        });
    }

    // --- Core Logic ---
    function getChaupai(startIndex) {
        let sequence = "";
        const indices = [];
        let currentIndex = startIndex;

        for (let i = 0; i < 30; i++) {
            const char = state.gridLetters[currentIndex];
            if (char) {
                 sequence += char;
            }
            indices.push(currentIndex);
            const matchingChaupai = state.chaupais.find(c => c.verse.startsWith(sequence));
            if(matchingChaupai) {
                 const remainingVerse = matchingChaupai.verse.substring(sequence.length);
                 for (const remainingChar of remainingVerse) {
                    currentIndex = (currentIndex + 9) % state.gridLetters.length;
                    indices.push(currentIndex);
                 }
                 return { chaupai: matchingChaupai, indices };
            }

            currentIndex = (currentIndex + 9) % state.gridLetters.length;
            if(indices.includes(currentIndex) && i > 0) break;
        }

        const foundChaupai = state.chaupais.find(c => c.verse.startsWith(sequence.substring(0, 5).replace(/\s/g, '')));
        return { chaupai: foundChaupai, indices };
    }


    // --- Event Handlers ---
    function handleGridClick(event) {
        const cell = event.target.closest('.grid-cell');
        if (!cell || cell.classList.contains('empty') || cell.classList.contains('no-click')) {
            return;
        }

        const startIndex = parseInt(cell.dataset.index);
        const result = getChaupai(startIndex);
        
        Array.from(elements.gridContainer.children).forEach(c => c.classList.add('no-click'));

        if (result && result.chaupai) {
            updateUIForResult(result);
        } else {
            alert("A clear answer could not be determined from this position. Please try another.");
            resetUI();
        }
    }

    function handleSpeak() {
        const textToSpeak = `
            The verse is: ${elements.chaupaiText.textContent}.
            The conclusion: ${elements.conclusionText.textContent}.
        `;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'hi-IN';
        speechSynthesis.speak(utterance);
    }

    function handlePrint() {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Shri Ram Shalaka - Divine Answer</title>
                    <style>
                        body { font-family: sans-serif; padding: 20px; }
                        h1 { color: #E68A2E; }
                        .result { border: 1px solid #ccc; padding: 15px; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <h1>Shri Ram Shalaka - Divine Answer</h1>
                    <p>Generated on: ${new Date().toLocaleString()}</p>
                    <hr>
                    <div class="result">
                        <h3>Verse:</h3>
                        <p>${elements.chaupaiText.innerHTML}</p>
                        <h3>Conclusion:</h3>
                        <p>${elements.conclusionText.innerHTML}</p>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
    
    // --- Event Listeners ---
    elements.gridContainer.addEventListener('click', handleGridClick);
    elements.gridContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            handleGridClick(e);
        }
    });
    elements.resetBtn.addEventListener('click', resetUI);
    elements.speakResultBtn.addEventListener('click', handleSpeak);
    elements.printResultBtn.addEventListener('click', handlePrint);

    // --- Start Application ---
    initialize();
}); 