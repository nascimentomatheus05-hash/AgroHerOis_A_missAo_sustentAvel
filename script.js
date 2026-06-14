document.addEventListener("DOMContentLoaded", function() {
    console.log("🚀 AgroHeróis iniciado");

    // --- Música (opcional) ---
    const btnMusica = document.getElementById("btnMusica");
    const audio = document.getElementById("musicaFundo");
    let musicaTocando = false;
    if (btnMusica && audio) {
        audio.load();
        btnMusica.addEventListener("click", () => {
            if (musicaTocando) {
                audio.pause();
                btnMusica.textContent = "🎵";
                musicaTocando = false;
            } else {
                audio.play().then(() => {
                    musicaTocando = true;
                    btnMusica.textContent = "🔊";
                }).catch(e => console.warn("Música não disponível"));
            }
        });
    }

    // --- ABELHA (imagem a.png) - Posição 35% da largura ---
    const abelhaImg = document.getElementById("abelha");
    let abelhaElement = abelhaImg;       // elemento que será movido (imagem ou emoji)
    const ABELHA_X = window.innerWidth * 0.35; // 35% da tela
    let abelhaY = window.innerHeight / 2 - 50; // posição vertical inicial

    // Fallback se a imagem não existir
    if (abelhaImg) {
        abelhaImg.onerror = () => {
            console.warn("🐝 Imagem a.png não encontrada. Usando emoji.");
            const emoji = document.createElement("div");
            emoji.id = "abelha-emoji";
            emoji.textContent = "🐝";
            emoji.style.cssText = "position:absolute; font-size:80px; z-index:15; animation:flutuar 0.3s infinite alternate; pointer-events:none;";
            emoji.style.left = ABELHA_X + "px";
            emoji.style.top = abelhaY + "px";
            abelhaImg.style.display = "none";
            abelhaImg.parentNode.appendChild(emoji);
            abelhaElement = emoji;
            window.abelhaElement = emoji;
        };
        if (abelhaImg.complete) {
            abelhaElement = abelhaImg;
            window.abelhaElement = abelhaImg;
        } else {
            abelhaImg.onload = () => {
                abelhaElement = abelhaImg;
                window.abelhaElement = abelhaImg;
            };
        }
        // Posiciona horizontalmente
        abelhaImg.style.left = ABELHA_X + "px";
        abelhaImg.style.top = abelhaY + "px";
    }

    // Remove fundo branco das personagens
    document.querySelectorAll(".adelita, .adelita-final").forEach(el => el.style.mixBlendMode = "multiply");

    // --- TELA INICIAL -> INTRODUÇÃO ---
    const telaInicial = document.getElementById("telaInicial");
    const introducao = document.getElementById("introducao");
    const btnComecar = document.getElementById("btnComecar");
    if (btnComecar) {
        btnComecar.addEventListener("click", () => {
            telaInicial.classList.remove("ativa");
            introducao.classList.add("ativa");
            mostrarFala();
        });
    }

    // --- DIÁLOGOS (resumidos mas funcionais) ---
    let nomeJogador = "",
        personagemEscolhido = "",
        falaAtual = 0;
    const falas = [
        "Olá! Eu sou a Adelita e faço parte dos AgroHeróis!\n\nQual é o seu nome?",
        "Que nome lindo, [NOME]!\n\nHoje você vai participar de uma missão muito importante.\n\nEscolha seu personagem.",
        "UAL!!!\n\nO tema da nossa aventura é:\n\nAgro Forte, Futuro Sustentável:\nEquilíbrio entre Produção e Meio Ambiente.",
        "Para produzir alimentos e cuidar da natureza, precisamos da ajuda de muitos seres vivos.\n\nUm dos mais importantes é a abelha.",
        "As abelhas realizam a polinização, ajudando as plantas a produzir flores, frutos e sementes.",
        "Graças à polinização, temos maçã, morango, melancia, pepino, café...",
        "Sem abelhas, a produção de alimentos seria muito menor.\n\nSua missão: ajudar a abelha a coletar flores.",
        "Como jogar:\n⬆️ Seta para cima = subir\n⬇️ Seta para baixo = descer",
        "Objetivo: coletar 10 flores. Cada flor aumenta sua pontuação.",
        "Cuidado! Não toque no fogo nem na fumaça, senão perderá energia.",
        "Ao coletar 10 flores, você mostrará como a polinização é essencial.",
        "Clique para começar sua missão."
    ];

    const textoDialogo = document.getElementById("textoDialogo");
    const entradaNomeDiv = document.getElementById("entradaNome");
    const escolhaPersonagemDiv = document.getElementById("escolhaPersonagem");
    const nomeInput = document.getElementById("nomeJogador");
    const btnProximo = document.getElementById("btnProximo");
    const menina = document.getElementById("menina");
    const menino = document.getElementById("menino");

    function mostrarFala() {
        if (falaAtual >= falas.length) return;
        let txt = falas[falaAtual].replace("[NOME]", nomeJogador);
        textoDialogo.innerText = txt;
        if (falaAtual === 0) {
            entradaNomeDiv.style.display = "block";
            escolhaPersonagemDiv.style.display = "none";
        } else if (falaAtual === 1) {
            entradaNomeDiv.style.display = "none";
            escolhaPersonagemDiv.style.display = "block";
        } else {
            entradaNomeDiv.style.display = "none";
            escolhaPersonagemDiv.style.display = "none";
        }
    }

    btnProximo.addEventListener("click", () => {
        if (falaAtual === 0) {
            nomeJogador = nomeInput.value.trim();
            if (!nomeJogador) return alert("Digite seu nome.");
        }
        if (falaAtual === 1 && !personagemEscolhido)
            return alert("Escolha um personagem.");
        falaAtual++;
        if (falaAtual < falas.length) mostrarFala();
        else {
            introducao.classList.remove("ativa");
            iniciarFaseAbelha();
        }
    });

    menina.addEventListener("click", () => {
        personagemEscolhido = "menina";
        menina.style.border = "4px solid green";
        menino.style.border = "none";
    });
    menino.addEventListener("click", () => {
        personagemEscolhido = "menino";
        menino.style.border = "4px solid green";
        menina.style.border = "none";
    });

    // ==================== FASE ABELHA (com movimentação garantida) ====================
    let jogoRodando = false;
    let floresColetadas = 0;
    let vidas = 3;
    let velocidadeAtual = 2.8;
    let acelerou = false;
    let vitoria = false;
    let intervaloObjetos;
    let animacaoLoop;

    const faseAbelha = document.getElementById("faseAbelha");
    const objetosJogo = document.getElementById("objetosJogo");
    const contadorFloresSpan = document.getElementById("contadorFlores");
    const vidasSpan = document.getElementById("vidas");
    const sucessoAbelha = document.getElementById("sucessoAbelha");
    const msgSucesso = document.getElementById("msgSucesso");

    function atualizarHUD() {
        contadorFloresSpan.innerText = `🌸 Flores: ${floresColetadas} / 10`;
        vidasSpan.innerText = `❤️ Vidas: ${vidas}`;
    }

    function criarObjeto() {
        if (!jogoRodando) return;
        const obj = document.createElement("img");
        const rand = Math.floor(Math.random() * 5);
        if (rand < 2) {
            const tiposFlor = ["flor.png", "milho.png", "soja.png"];
            obj.src = tiposFlor[Math.floor(Math.random() * 3)];
            obj.dataset.tipo = "flor";
        } else if (rand === 2) {
            obj.src = "fogo.png";
            obj.dataset.tipo = "fogo";
        } else {
            obj.src = "fumaça.png";
            obj.dataset.tipo = "fumaca";
        }
        obj.classList.add("objeto");
        obj.style.left = window.innerWidth + "px";
        obj.style.top = Math.random() * (window.innerHeight - 100) + 20 + "px";
        objetosJogo.appendChild(obj);
    }

    function colidiu(a, b) {
        const r1 = a.getBoundingClientRect();
        const r2 = b.getBoundingClientRect();
        return !(r1.top > r2.bottom || r1.bottom < r2.top || r1.left > r2.right || r1.right < r2.left);
    }

    // ========== MOVIMENTO DA ABELHA ==========
    // Evento de teclado com log para depuração
    document.addEventListener("keydown", function(e) {
        if (!jogoRodando) {
            console.log("Jogo não está rodando, tecla ignorada.");
            return;
        }
        if (e.key === "ArrowUp") {
            console.log("⬆️ Seta para cima pressionada");
            abelhaY = Math.max(20, abelhaY - 30);
            if (abelhaElement) abelhaElement.style.top = abelhaY + "px";
            e.preventDefault();
        } else if (e.key === "ArrowDown") {
            console.log("⬇️ Seta para baixo pressionada");
            abelhaY = Math.min(window.innerHeight - 80, abelhaY + 30);
            if (abelhaElement) abelhaElement.style.top = abelhaY + "px";
            e.preventDefault();
        }
    });

    function loopJogo() {
        if (!jogoRodando || vitoria) return;
        const objetos = document.querySelectorAll(".objeto");
        objetos.forEach(obj => {
            let x = parseFloat(obj.style.left);
            x -= velocidadeAtual;
            obj.style.left = x + "px";
            if (x + obj.offsetWidth < 0) obj.remove();
            if (abelhaElement && colidiu(abelhaElement, obj)) {
                if (obj.dataset.tipo === "flor") {
                    floresColetadas++;
                    atualizarHUD();
                    obj.remove();
                    if (floresColetadas >= 5 && !acelerou) {
                        acelerou = true;
                        velocidadeAtual = 4.2;
                        console.log("🚀 Velocidade aumentada para 4.2");
                    }
                    if (floresColetadas >= 10 && !vitoria) {
                        vitoria = true;
                        vencerFaseAbelha();
                    }
                } else {
                    if (!obj.dataset.hit) {
                        obj.dataset.hit = "true";
                        vidas--;
                        atualizarHUD();
                        if (vidas <= 0 && !vitoria) {
                            vitoria = true;
                            perderFase();
                        }
                    }
                    obj.remove();
                }
            }
        });
        requestAnimationFrame(loopJogo);
    }

    function iniciarFaseAbelha() {
        console.log("🐝 Fase abelha iniciada");
        faseAbelha.classList.add("ativa");
        jogoRodando = true;
        floresColetadas = 0;
        vidas = 3;
        velocidadeAtual = 2.8;
        acelerou = false;
        vitoria = false;
        // Reinicia a posição Y e garante a posição X
        abelhaY = window.innerHeight / 2 - 50;
        if (abelhaElement) {
            abelhaElement.style.top = abelhaY + "px";
            abelhaElement.style.left = ABELHA_X + "px";
        }
        atualizarHUD();
        if (intervaloObjetos) clearInterval(intervaloObjetos);
        intervaloObjetos = setInterval(criarObjeto, 2000);
        if (animacaoLoop) cancelAnimationFrame(animacaoLoop);
        animacaoLoop = requestAnimationFrame(loopJogo);
        console.log("Abelha posicionada em X:", ABELHA_X, "Y:", abelhaY);
    }

    function vencerFaseAbelha() {
        jogoRodando = false;
        clearInterval(intervaloObjetos);
        cancelAnimationFrame(animacaoLoop);
        objetosJogo.innerHTML = "";
        faseAbelha.classList.remove("ativa");
        msgSucesso.innerText = `Parabéns ${nomeJogador}! Você coletou 10 flores!`;
        sucessoAbelha.classList.add("ativa");
    }

    function perderFase() {
        jogoRodando = false;
        clearInterval(intervaloObjetos);
        cancelAnimationFrame(animacaoLoop);
        alert("❌ Você perdeu todas as vidas! O jogo vai reiniciar.");
        location.reload();
    }

    // Avançar para a compostagem
    const btnProxComp = document.getElementById("btnProxCompostagem");
    if (btnProxComp) {
        btnProxComp.addEventListener("click", () => {
            sucessoAbelha.classList.remove("ativa");
            iniciarCompostagem();
        });
    }

    // ==================== COMPOSTAGEM (drag and drop) ====================
    const compostagemTela = document.getElementById("compostagemTela");
    const itensComp = document.querySelectorAll("#itensCompostagem .item");
    const contadorComp = document.getElementById("contadorCompostagem");
    let acertosComp = 0;

    function iniciarCompostagem() {
        compostagemTela.classList.add("ativa");
        acertosComp = 0;
        contadorComp.innerText = "Acertos: 0 / 4";
        const composteira = document.getElementById("composteira");
        composteira.addEventListener("dragover", e => e.preventDefault());
        composteira.addEventListener("drop", e => {
            e.preventDefault();
            const src = e.dataTransfer.getData("text/plain");
            const item = document.querySelector(`.item[src="${src}"]`);
            if (!item) return;
            const isCorreto = item.getAttribute("data-correto") === "true";
            if (isCorreto) {
                acertosComp++;
                contadorComp.innerText = `Acertos: ${acertosComp} / 4`;
                item.style.display = "none";
                if (acertosComp >= 4) {
                    alert(`Parabéns ${nomeJogador}! Você produziu adubo natural!`);
                    compostagemTela.classList.remove("ativa");
                    iniciarPlantio();
                }
            } else {
                alert("❌ Esse material NÃO deve ir para a composteira!");
            }
        });
        itensComp.forEach(item => {
            item.setAttribute("draggable", "true");
            item.addEventListener("dragstart", e => {
                e.dataTransfer.setData("text/plain", e.target.src);
            });
        });
    }

    // ==================== PLANTIO (todas as sementes funcionam) ====================
    const plantioTela = document.getElementById("plantioTela");
    const regador = document.getElementById("regador");
    const setaRegador = document.getElementById("setaRegador");
    const plantinha = document.getElementById("plantinha");
    const areaPlantio = document.getElementById("areaPlantio");

    function iniciarPlantio() {
        plantioTela.classList.add("ativa");
        // Recriar sementes para evitar eventos duplicados
        const sementesOriginais = document.querySelectorAll(".semente");
        sementesOriginais.forEach(s => {
            const clone = s.cloneNode(true);
            s.parentNode.replaceChild(clone, s);
        });
        const sementes = document.querySelectorAll(".semente");
        let sementeEscolhida = "";

        sementes.forEach(s => {
            s.addEventListener("click", function(e) {
                if (sementeEscolhida !== "") return;
                sementeEscolhida = this.dataset.semente; // "milho", "tomate" ou "soja"
                console.log(`🌱 Semente escolhida: ${sementeEscolhida}`);
                alert(`Você escolheu ${sementeEscolhida}! Agora regue a planta.`);
                sementes.forEach(s2 => s2.style.display = "none");
                this.style.display = "block";
                regador.style.display = "block";
                setaRegador.style.display = "block";

                // Recriar regador para garantir evento único
                const regadorElem = document.getElementById("regador");
                const novoRegador = regadorElem.cloneNode(true);
                regadorElem.parentNode.replaceChild(novoRegador, regadorElem);
                const regadorFinal = document.getElementById("regador");
                regadorFinal.addEventListener("click", function regar() {
                    if (!sementeEscolhida) return;
                    regadorFinal.style.display = "none";
                    setaRegador.style.display = "none";
                    plantinha.style.display = "block";
                    setTimeout(() => crescerPlanta(sementeEscolhida), 2000);
                }, { once: true });
            });
        });
    }

    function crescerPlanta(tipo) {
        plantinha.remove();
        const planta = document.createElement("img");
        let imgSrc = "";
        if (tipo === "milho") imgSrc = "milhocresce.png";
        else if (tipo === "tomate") imgSrc = "tomatecresce.png";
        else imgSrc = "sojacrece.png";
        planta.src = imgSrc;
        planta.id = "plantaFinal";
        planta.style.cssText = "position:absolute; bottom:80px; left:50%; transform:translateX(-50%); width:100px; transition:width 0.1s linear;";
        areaPlantio.appendChild(planta);
        let tamanho = 100;
        const intervalo = setInterval(() => {
            tamanho += 12;
            planta.style.width = tamanho + "px";
            if (tamanho >= 350) {
                clearInterval(intervalo);
                setTimeout(() => {
                    plantioTela.classList.remove("ativa");
                    mostrarTelaFinal();
                }, 1000);
            }
        }, 100);
    }

    function mostrarTelaFinal() {
        const telaFinal = document.getElementById("telaFinal");
        const mensagemFinal = document.getElementById("mensagemFinal");
        telaFinal.classList.add("ativa");
        mensagemFinal.innerHTML = `Parabéns, <strong>${nomeJogador}</strong>!<br><br>
        Você ajudou as abelhas, fez compostagem, plantou uma semente e cuidou da sua planta até ela crescer.<br><br>
        Muito obrigada pela sua ajuda!<br><br>
        Agora você é um verdadeiro <strong>AgroHerói do Futuro Sustentável</strong>.<br><br>
        Agro Forte, Futuro Sustentável: equilíbrio entre produção e meio ambiente.<br><br>
        Desenvolvido pelo aluno Matheus – 2º D Noturno<br>
        Colégio Estadual Antonio Tortato<br>
        Professora Patrícia Ferro`;
    }

    // ==================== CERTIFICADO PDF ====================
    const btnCertificado = document.getElementById("btnCertificado");
    const certificadoTela = document.getElementById("certificadoTela");
    const nomeCertificadoSpan = document.getElementById("nomeCertificado");
    if (btnCertificado) {
        btnCertificado.addEventListener("click", () => {
            document.getElementById("telaFinal").classList.remove("ativa");
            certificadoTela.classList.add("ativa");
            nomeCertificadoSpan.innerText = nomeJogador;
        });
    }
    const btnPDF = document.getElementById("baixarPDF");
    if (btnPDF) {
        btnPDF.addEventListener("click", () => {
            const conteudo = `<html><head><title>Certificado AgroHerói</title><style>body{font-family:Arial;text-align:center;padding:40px}.cert{border:10px solid #2f9e44;background:white;padding:40px;max-width:800px;margin:auto;border-radius:20px}h1{color:#2f9e44}ul{text-align:left;display:inline-block}</style></head><body><div class="cert"><h1>CERTIFICADO DE AGROHERÓI</h1><p>A equipe dos AgroHeróis certifica que</p><h2>${nomeJogador}</h2><p>concluiu com sucesso todas as missões do projeto<br>Agro Forte, Futuro Sustentável</p><p>Demonstrando conhecimento sobre:</p><ul><li>Polinização e a importância das abelhas</li><li>Compostagem e reciclagem de nutrientes</li><li>Plantio e cuidados com as plantas</li><li>Sustentabilidade e preservação ambiental</li></ul><h3>AGROHERÓI DO FUTURO SUSTENTÁVEL</h3><div class="assinatura">Adelita – AgroHeróis</div></div></body></html>`;
            const win = window.open();
            win.document.write(conteudo);
            win.document.close();
            win.print();
        });
    }

    console.log("✅ Jogo pronto: abelha em 35%, movimentação restaurada, todas as sementes funcionam.");
});
