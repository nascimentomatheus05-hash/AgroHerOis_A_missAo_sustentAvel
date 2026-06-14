// ============================================================
// AGROHERÓIS - JOGO COMPLETO
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 AgroHeróis carregado");

    // ---------- MÚSICA ----------
    const musicBtn = document.getElementById("btnMusica");
    const audio = document.getElementById("musicaFundo");
    let musicPlaying = false;
    if (musicBtn && audio) {
        audio.load();
        musicBtn.addEventListener("click", () => {
            if (musicPlaying) {
                audio.pause();
                musicBtn.textContent = "🎵";
            } else {
                audio.play().catch(e => console.log("Áudio: interação necessária"));
                musicBtn.textContent = "🔊";
            }
            musicPlaying = !musicPlaying;
        });
    }

    // ---------- AJUSTES GLOBAIS ----------
    // Remove fundo branco das imagens dos personagens
    document.querySelectorAll(".adelita, .adelita-final").forEach(el => {
        if (el) el.style.mixBlendMode = "multiply";
    });

    // ---------- VARIÁVEIS DA FASE ABELHA ----------
    let gameRunning = false;
    let flowersCollected = 0;
    let lives = 3;
    let currentSpeed = 2.8;
    let spedUp = false;
    let winFlag = false;
    let spawnInterval;
    let animationId;
    const beeImg = document.getElementById("abelha");
    let beeElement = beeImg;
    const gameArea = document.getElementById("objetosJogo");
    const flowersSpan = document.getElementById("contadorFlores");
    const livesSpan = document.getElementById("vidas");
    const successScreen = document.getElementById("sucessoAbelha");
    const successMsg = document.getElementById("msgSucesso");

    // Fallback da abelha (emoji se imagem falhar)
    if (beeImg) {
        beeImg.onerror = () => {
            const emoji = document.createElement("div");
            emoji.id = "abelha-emoji";
            emoji.textContent = "🐝";
            emoji.style.cssText = "position:absolute; font-size:80px; z-index:15; animation:flutuar 0.3s infinite alternate; pointer-events:none;";
            emoji.style.left = beeImg.style.left;
            emoji.style.top = beeImg.style.top;
            beeImg.style.display = "none";
            beeImg.parentNode.appendChild(emoji);
            beeElement = emoji;
        };
        beeElement = beeImg;
    } else {
        // Cria emoji diretamente se não existir img
        const emoji = document.createElement("div");
        emoji.id = "abelha-emoji";
        emoji.textContent = "🐝";
        emoji.style.cssText = "position:absolute; font-size:80px; z-index:15; animation:flutuar 0.3s infinite alternate; pointer-events:none;";
        document.getElementById("faseAbelha").appendChild(emoji);
        beeElement = emoji;
    }

    // Posiciona a abelha (35% da largura)
    const BEE_X = window.innerWidth * 0.35;
    let beeY = window.innerHeight / 2 - 50;
    if (beeElement) {
        beeElement.style.position = "absolute";
        beeElement.style.left = BEE_X + "px";
        beeElement.style.top = beeY + "px";
    }

    // ---------- FUNÇÕES DA FASE ABELHA ----------
    function updateHUD() {
        if (flowersSpan) flowersSpan.innerText = `🌸 Flores: ${flowersCollected} / 10`;
        if (livesSpan) livesSpan.innerText = `❤️ Vidas: ${lives}`;
    }

    function createObject() {
        if (!gameRunning) return;
        const obj = document.createElement("img");
        const r = Math.floor(Math.random() * 5);
        if (r < 2) { // flower
            const flowerTypes = ["flor.png", "milho.png", "soja.png"];
            obj.src = flowerTypes[Math.floor(Math.random() * 3)];
            obj.dataset.type = "flower";
        } else if (r === 2) {
            obj.src = "fogo.png";
            obj.dataset.type = "fire";
        } else {
            obj.src = "fumaça.png";
            obj.dataset.type = "smoke";
        }
        obj.classList.add("objeto");
        obj.style.position = "absolute";
        obj.style.width = "80px";
        obj.style.left = window.innerWidth + "px";
        obj.style.top = Math.random() * (window.innerHeight - 100) + 20 + "px";
        gameArea.appendChild(obj);
    }

    function collision(a, b) {
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        return !(ra.top > rb.bottom || ra.bottom < rb.top || ra.left > rb.right || ra.right < rb.left);
    }

    // Movimento da abelha (setas)
    window.addEventListener("keydown", (e) => {
        if (!gameRunning) return;
        if (e.key === "ArrowUp") {
            beeY = Math.max(20, beeY - 30);
            if (beeElement) beeElement.style.top = beeY + "px";
            e.preventDefault();
        } else if (e.key === "ArrowDown") {
            beeY = Math.min(window.innerHeight - 80, beeY + 30);
            if (beeElement) beeElement.style.top = beeY + "px";
            e.preventDefault();
        }
    });

    function gameLoop() {
        if (!gameRunning || winFlag) return;
        const objects = document.querySelectorAll(".objeto");
        objects.forEach(obj => {
            let x = parseFloat(obj.style.left);
            x -= currentSpeed;
            obj.style.left = x + "px";
            if (x + obj.offsetWidth < 0) obj.remove();
            if (beeElement && collision(beeElement, obj)) {
                if (obj.dataset.type === "flower") {
                    flowersCollected++;
                    updateHUD();
                    obj.remove();
                    if (flowersCollected >= 5 && !spedUp) {
                        spedUp = true;
                        currentSpeed = 4.2;
                        console.log("🚀 Velocidade aumentada!");
                    }
                    if (flowersCollected >= 10) {
                        winFlag = true;
                        gameRunning = false;
                        clearInterval(spawnInterval);
                        cancelAnimationFrame(animationId);
                        gameArea.innerHTML = "";
                        document.getElementById("faseAbelha").classList.remove("ativa");
                        successMsg.innerText = `Parabéns ${playerName}! Você coletou 10 flores!`;
                        successScreen.classList.add("ativa");
                    }
                } else if (obj.dataset.type === "fire" || obj.dataset.type === "smoke") {
                    if (!obj.dataset.hit) {
                        obj.dataset.hit = "true";
                        lives--;
                        updateHUD();
                        if (lives <= 0) {
                            gameRunning = false;
                            clearInterval(spawnInterval);
                            cancelAnimationFrame(animationId);
                            alert("❌ Você perdeu todas as vidas! A página será recarregada.");
                            location.reload();
                        }
                    }
                    obj.remove();
                }
            }
        });
        animationId = requestAnimationFrame(gameLoop);
    }

    function startBeePhase() {
        document.getElementById("faseAbelha").classList.add("ativa");
        gameRunning = true;
        flowersCollected = 0;
        lives = 3;
        currentSpeed = 2.8;
        spedUp = false;
        winFlag = false;
        beeY = window.innerHeight / 2 - 50;
        if (beeElement) beeElement.style.top = beeY + "px";
        updateHUD();
        if (spawnInterval) clearInterval(spawnInterval);
        spawnInterval = setInterval(createObject, 2000);
        if (animationId) cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(gameLoop);
    }

    // ---------- COMPOSTAGEM (drag & drop) ----------
    function initCompostagem() {
        const items = document.querySelectorAll("#itensCompostagem .item");
        const composteira = document.getElementById("composteira");
        const counterComp = document.getElementById("contadorCompostagem");
        let correctCount = 0;

        // Remove qualquer listener antigo clonando
        const newItems = [];
        items.forEach(item => {
            const clone = item.cloneNode(true);
            item.parentNode.replaceChild(clone, item);
            newItems.push(clone);
        });
        const newComposteira = composteira.cloneNode(true);
        composteira.parentNode.replaceChild(newComposteira, composteira);
        const finalComposteira = document.getElementById("composteira");

        newItems.forEach(item => {
            item.setAttribute("draggable", "true");
            item.addEventListener("dragstart", e => {
                e.dataTransfer.setData("text/plain", e.target.src);
            });
        });
        finalComposteira.addEventListener("dragover", e => e.preventDefault());
        finalComposteira.addEventListener("drop", e => {
            e.preventDefault();
            const src = e.dataTransfer.getData("text/plain");
            const droppedItem = newItems.find(i => i.src === src);
            if (!droppedItem) return;
            const isCorrect = droppedItem.getAttribute("data-correto") === "true";
            if (isCorrect) {
                correctCount++;
                counterComp.innerText = `Acertos: ${correctCount} / 4`;
                droppedItem.style.display = "none";
                if (correctCount >= 4) {
                    alert(`Parabéns ${playerName}! Você produziu adubo natural!`);
                    document.getElementById("compostagemTela").classList.remove("ativa");
                    startPlantingPhase();
                }
            } else {
                alert("❌ Esse material NÃO deve ir para a composteira!");
            }
        });
    }

    // ---------- PLANTIO (todas as sementes) ----------
    function startPlantingPhase() {
        const plantScreen = document.getElementById("plantioTela");
        plantScreen.classList.add("ativa");
        const seeds = document.querySelectorAll(".semente");
        const wateringCan = document.getElementById("regador");
        const arrow = document.getElementById("setaRegador");
        const seedling = document.getElementById("plantinha");
        let chosenSeed = "";

        // Recria sementes para eventos limpos
        seeds.forEach(s => {
            const clone = s.cloneNode(true);
            s.parentNode.replaceChild(clone, s);
        });
        const freshSeeds = document.querySelectorAll(".semente");

        freshSeeds.forEach(seed => {
            seed.addEventListener("click", () => {
                if (chosenSeed) return;
                chosenSeed = seed.dataset.semente;
                alert(`🌱 Você escolheu ${chosenSeed}! Agora regue a planta.`);
                freshSeeds.forEach(s => s.style.display = "none");
                seed.style.display = "block";
                wateringCan.style.display = "block";
                arrow.style.display = "block";
                // Recria regador para garantir evento único
                const newCan = wateringCan.cloneNode(true);
                wateringCan.parentNode.replaceChild(newCan, wateringCan);
                const finalCan = document.getElementById("regador");
                finalCan.addEventListener("click", () => {
                    finalCan.style.display = "none";
                    arrow.style.display = "none";
                    seedling.style.display = "block";
                    setTimeout(() => {
                        growPlant(chosenSeed);
                    }, 2000);
                }, { once: true });
            });
        });
    }

    function growPlant(type) {
        const seedling = document.getElementById("plantinha");
        seedling.remove();
        const fullPlant = document.createElement("img");
        let imgSrc = "";
        if (type === "milho") imgSrc = "milhocresce.png";
        else if (type === "tomate") imgSrc = "tomatecresce.png";
        else imgSrc = "sojacrece.png";
        fullPlant.src = imgSrc;
        fullPlant.id = "plantaFinal";
        fullPlant.style.cssText = "position:absolute; bottom:80px; left:50%; transform:translateX(-50%); width:100px; transition:width 0.1s linear;";
        document.getElementById("areaPlantio").appendChild(fullPlant);
        let size = 100;
        const growInterval = setInterval(() => {
            size += 12;
            fullPlant.style.width = size + "px";
            if (size >= 350) {
                clearInterval(growInterval);
                setTimeout(() => {
                    document.getElementById("plantioTela").classList.remove("ativa");
                    showFinalScreen();
                }, 1000);
            }
        }, 100);
    }

    function showFinalScreen() {
        const finalScreen = document.getElementById("telaFinal");
        const msgFinal = document.getElementById("mensagemFinal");
        finalScreen.classList.add("ativa");
        msgFinal.innerHTML = `Parabéns, <strong>${playerName}</strong>!<br><br>
        Você ajudou as abelhas, fez compostagem, plantou uma semente e cuidou da sua planta até ela crescer.<br><br>
        Muito obrigada pela sua ajuda!<br><br>
        Agora você é um verdadeiro <strong>AgroHerói do Futuro Sustentável</strong>.<br><br>
        Agro Forte, Futuro Sustentável: equilíbrio entre produção e meio ambiente.<br><br>
        Desenvolvido pelo aluno Matheus – 2º D Noturno<br>
        Colégio Estadual Antonio Tortato<br>
        Professora Patrícia Ferro`;
    }

    // ---------- DIÁLOGOS (12 falas) ----------
    let playerName = "";
    let chosenCharacter = "";
    let dialogIndex = 0;
    const dialogTexts = [
        "Olá! Eu sou a Adelita e faço parte dos AgroHeróis!\n\nQual é o seu nome?",
        "Que nome lindo, [NOME]!\n\nHoje você vai participar de uma missão muito importante.\n\nEscolha seu personagem.",
        "UAL!!!\n\nO tema da nossa aventura é:\n\nAgro Forte, Futuro Sustentável:\nEquilíbrio entre Produção e Meio Ambiente.",
        "Para produzir alimentos e cuidar da natureza ao mesmo tempo, precisamos da ajuda de muitos seres vivos.\n\nUm dos mais importantes é a abelha.",
        "As abelhas realizam a polinização, um processo que ajuda as plantas a produzir flores, frutos e sementes.\n\nQuando uma abelha visita uma flor, ela transporta o pólen para outras flores.",
        "Graças à polinização, podemos ter alimentos como:\n\n🍎 Maçã, 🍓 Morango, 🍉 Melancia, 🥒 Pepino, ☕ Café",
        "Sem as abelhas e outros polinizadores, a produção de muitos alimentos seria muito menor.\n\nPor isso, sua missão será ajudar uma abelha a coletar flores.",
        "Como jogar:\n\n⬆️ Seta para cima = subir\n⬇️ Seta para baixo = descer",
        "Seu objetivo é:\n\nColetar flores pelo caminho.\nCada flor ajuda na polinização e aumenta sua pontuação.",
        "Mas atenção!\n\n🚫 Não toque no fogo.\n🚫 Não toque na fumaça.\nSe encostar, perderá energia.",
        "Quando você coletar 10 flores, ajudará a natureza e mostrará como a polinização é essencial para um Agro Forte e um Futuro Sustentável.",
        "Clique para começar sua missão."
    ];

    const dialogBox = document.getElementById("textoDialogo");
    const nameDiv = document.getElementById("entradaNome");
    const charDiv = document.getElementById("escolhaPersonagem");
    const nameInput = document.getElementById("nomeJogador");
    const nextBtn = document.getElementById("btnProximo");
    const girlImg = document.getElementById("menina");
    const boyImg = document.getElementById("menino");

    function showDialog() {
        if (dialogIndex >= dialogTexts.length) return;
        let text = dialogTexts[dialogIndex].replace("[NOME]", playerName);
        dialogBox.innerText = text;
        if (dialogIndex === 0) {
            nameDiv.style.display = "block";
            charDiv.style.display = "none";
        } else if (dialogIndex === 1) {
            nameDiv.style.display = "none";
            charDiv.style.display = "block";
        } else {
            nameDiv.style.display = "none";
            charDiv.style.display = "none";
        }
    }

    nextBtn.addEventListener("click", () => {
        if (dialogIndex === 0) {
            playerName = nameInput.value.trim();
            if (!playerName) return alert("Digite seu nome.");
        }
        if (dialogIndex === 1 && !chosenCharacter) return alert("Escolha um personagem.");
        dialogIndex++;
        if (dialogIndex < dialogTexts.length) {
            showDialog();
        } else {
            document.getElementById("introducao").classList.remove("ativa");
            startBeePhase();
        }
    });

    girlImg.addEventListener("click", () => {
        chosenCharacter = "menina";
        girlImg.style.border = "4px solid green";
        boyImg.style.border = "none";
    });
    boyImg.addEventListener("click", () => {
        chosenCharacter = "menino";
        boyImg.style.border = "4px solid green";
        girlImg.style.border = "none";
    });

    // ---------- BOTÕES DE TRANSIÇÃO ----------
    document.getElementById("btnProxCompostagem").addEventListener("click", () => {
        successScreen.classList.remove("ativa");
        document.getElementById("compostagemTela").classList.add("ativa");
        initCompostagem();
    });
    document.getElementById("btnIniciarPlantio").addEventListener("click", () => {
        document.getElementById("transicaoPlantio").classList.remove("ativa");
        startPlantingPhase();
    });
    // Botão para início dos diálogos (tela inicial)
    document.getElementById("btnComecar").addEventListener("click", () => {
        document.getElementById("telaInicial").classList.remove("ativa");
        document.getElementById("introducao").classList.add("ativa");
        showDialog();
    });

    // ---------- CERTIFICADO E PDF ----------
    document.getElementById("btnCertificado").addEventListener("click", () => {
        document.getElementById("telaFinal").classList.remove("ativa");
        document.getElementById("certificadoTela").classList.add("ativa");
        document.getElementById("nomeCertificado").innerText = playerName;
    });
    document.getElementById("baixarPDF").addEventListener("click", () => {
        const content = `<!DOCTYPE html>
        <html>
        <head><title>Certificado AgroHerói</title><style>
            body { font-family: Arial; text-align: center; padding: 40px; background: #f4f4f4; }
            .cert { border: 10px solid #2f9e44; background: white; padding: 40px; max-width: 800px; margin: auto; border-radius: 20px; }
            h1 { color: #2f9e44; }
            ul { text-align: left; display: inline-block; }
        </style></head>
        <body>
            <div class="cert">
                <h1>CERTIFICADO DE AGROHERÓI</h1>
                <p>A equipe dos AgroHeróis certifica que</p>
                <h2>${playerName}</h2>
                <p>concluiu com sucesso todas as missões do projeto<br><strong>Agro Forte, Futuro Sustentável</strong><br>Equilíbrio entre Produção e Meio Ambiente</p>
                <p>Demonstrando conhecimento sobre:</p>
                <ul>
                    <li>Polinização e a importância das abelhas</li>
                    <li>Compostagem e reciclagem de nutrientes</li>
                    <li>Plantio e cuidados com as plantas</li>
                    <li>Sustentabilidade e preservação ambiental</li>
                </ul>
                <h3>AGROHERÓI DO FUTURO SUSTENTÁVEL</h3>
                <div class="assinatura">Adelita – AgroHeróis</div>
            </div>
        </body>
        </html>`;
        const win = window.open();
        win.document.write(content);
        win.document.close();
        win.print();
    });

    console.log("✅ Jogo completo e funcional!");
});
