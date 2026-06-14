document.addEventListener("DOMContentLoaded", function() {
    console.log("🚀 AgroHeróis iniciado");

    // ==================== MÚSICA ====================
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

    // ==================== ABELHA (centralizada a 35%) ====================
    const abelhaImg = document.getElementById('abelha');
    let abelhaElement = abelhaImg;
    const ABELHA_X = window.innerWidth * 0.35; // 35% da largura (mais central)
    if (abelhaImg) {
        abelhaImg.onerror = () => {
            console.warn("🐝 Usando emoji para abelha (a.png não encontrado)");
            const emoji = document.createElement('div');
            emoji.textContent = '🐝';
            emoji.style.cssText = 'position:absolute; font-size:80px; z-index:15; animation:flutuar 0.3s infinite alternate;';
            emoji.style.left = ABELHA_X + 'px';
            emoji.style.top = (window.innerHeight/2 - 50) + 'px';
            abelhaImg.style.display = 'none';
            abelhaImg.parentNode.appendChild(emoji);
            abelhaElement = emoji;
        };
        if (abelhaImg.complete) abelhaElement = abelhaImg;
        else abelhaImg.onload = () => { abelhaElement = abelhaImg; };
        abelhaImg.style.left = ABELHA_X + 'px';
    }

    // Remove fundo branco das personagens (se houver)
    document.querySelectorAll('.adelita, .adelita-final').forEach(el => el.style.mixBlendMode = 'multiply');

    // ==================== TELA INICIAL -> INTRODUÇÃO ====================
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

    // ==================== DIÁLOGOS ====================
    let nomeJogador = "", personagemEscolhido = "", falaAtual = 0;
    const falas = [
        "Olá! Eu sou a Adelita e faço parte dos AgroHeróis!\n\nQual é o seu nome?",
        "Que nome lindo, [NOME]!\n\nEscolha seu personagem.",
        "UAL!!! O tema é: Agro Forte, Futuro Sustentável!",
        "Precisamos da ajuda de muitos seres vivos... a abelha é essencial.",
        "As abelhas realizam a polinização, ajudando as plantas a produzir flores e frutos.",
        "Com a polinização, temos maçã, morango, melancia, café...",
        "Sem abelhas, a produção seria muito menor. Sua missão: ajudar a abelha a coletar flores.",
        "Como jogar: ↑ sobe, ↓ desce.",
        "Objetivo: coletar 10 flores. Cada flor vale 1 ponto.",
        "Cuidado: fogo e fumaça reduzem sua energia!",
        "Ao coletar 10 flores, você mostra a importância da polinização.",
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
        if (falaAtual === 1 && !personagemEscolhido) return alert("Escolha um personagem.");
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

    // ==================== FASE ABELHA ====================
    let jogoRodando = false, flores = 0, vidas = 3, posY = 300;
    let intervaloObjetos, animacao;
    let velocidade = 2.8, acelerou = false;
    const faseAbelha = document.getElementById("faseAbelha");
    const objetosJogo = document.getElementById("objetosJogo");
    const contadorFlores = document.getElementById("contadorFlores");
    const vidasSpan = document.getElementById("vidas");
    const sucessoAbelha = document.getElementById("sucessoAbelha");
    const msgSucesso = document.getElementById("msgSucesso");

    function atualizarHUD() {
        contadorFlores.innerText = `🌸 Flores: ${flores} / 10`;
        vidasSpan.innerText = `❤️ Vidas: ${vidas}`;
    }

    function criarObjeto() {
        if (!jogoRodando) return;
        const obj = document.createElement("img");
        const rand = Math.floor(Math.random() * 5);
        if (rand < 2) { // flor
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
        const r1 = a.getBoundingClientRect(), r2 = b.getBoundingClientRect();
        return !(r1.top > r2.bottom || r1.bottom < r2.top || r1.left > r2.right || r1.right < r2.left);
    }

    function loopJogo() {
        if (!jogoRodando) return;
        const objetos = document.querySelectorAll(".objeto");
        objetos.forEach(obj => {
            let x = parseFloat(obj.style.left);
            x -= velocidade;
            obj.style.left = x + "px";
            if (x + obj.offsetWidth < 0) obj.remove();

            if (abelhaElement && colidiu(abelhaElement, obj)) {
                if (obj.dataset.tipo === "flor") {
                    flores++;
                    atualizarHUD();
                    obj.remove();
                    if (flores >= 5 && !acelerou) {
                        acelerou = true;
                        velocidade = 4.2;
                        console.log("🚀 Velocidade aumentada para 4.2");
                    }
                    if (flores >= 10) vencerFase();
                } else {
                    if (!obj.dataset.hit) {
                        obj.dataset.hit = "true";
                        vidas--;
                        atualizarHUD();
                        if (vidas <= 0) perderFase();
                    }
                    obj.remove();
                }
            }
        });
        requestAnimationFrame(loopJogo);
    }

    function iniciarFaseAbelha() {
        faseAbelha.classList.add("ativa");
        jogoRodando = true;
        flores = 0;
        vidas = 3;
        velocidade = 2.8;
        acelerou = false;
        posY = window.innerHeight / 2 - 50;
        if (abelhaElement) {
            abelhaElement.style.top = posY + "px";
            abelhaElement.style.left = ABELHA_X + "px";
        }
        atualizarHUD();
        if (intervaloObjetos) clearInterval(intervaloObjetos);
        intervaloObjetos = setInterval(criarObjeto, 2000);
        animacao = requestAnimationFrame(loopJogo);
    }

    function vencerFase() {
        jogoRodando = false;
        clearInterval(intervaloObjetos);
        cancelAnimationFrame(animacao);
        objetosJogo.innerHTML = "";
        faseAbelha.classList.remove("ativa");
        msgSucesso.innerText = `Parabéns ${nomeJogador}! Você coletou 10 flores!`;
        sucessoAbelha.classList.add("ativa");
    }

    function perderFase() {
        jogoRodando = false;
        clearInterval(intervaloObjetos);
        cancelAnimationFrame(animacao);
        alert("❌ Você perdeu todas as vidas! O jogo vai reiniciar.");
        location.reload();
    }

    // Avançar para a próxima fase (compostagem)
    const btnProxComp = document.getElementById("btnProxCompostagem");
    if (btnProxComp) {
        btnProxComp.addEventListener("click", () => {
            sucessoAbelha.classList.remove("ativa");
            iniciarCompostagem();
        });
    }

    // ==================== COMPOSTAGEM (simplificada para testes) ====================
    const compostagemTela = document.getElementById("compostagemTela");
    const itens = document.querySelectorAll("#itensCompostagem .item");
    const contadorComp = document.getElementById("contadorCompostagem");
    let acertos = 0;

    function iniciarCompostagem() {
        compostagemTela.classList.add("ativa");
        acertos = 0;
        contadorComp.innerText = "Acertos: 0 / 4";
        // Configurar drag and drop
        const composteira = document.getElementById("composteira");
        composteira.addEventListener("dragover", e => e.preventDefault());
        composteira.addEventListener("drop", e => {
            e.preventDefault();
            const src = e.dataTransfer.getData("text/plain");
            const item = document.querySelector(`[src="${src}"]`);
            if (!item) return;
            const isCorreto = item.getAttribute("data-correto") === "true";
            if (isCorreto) {
                acertos++;
                contadorComp.innerText = `Acertos: ${acertos} / 4`;
                item.style.display = "none";
                if (acertos >= 4) {
                    alert("Adubo natural produzido!");
                    compostagemTela.classList.remove("ativa");
                    iniciarPlantio();
                }
            } else {
                alert("❌ Material incorreto para compostagem!");
            }
        });
        itens.forEach(item => {
            item.setAttribute("draggable", "true");
            item.addEventListener("dragstart", e => {
                e.dataTransfer.setData("text/plain", e.target.src);
            });
        });
    }

    // ==================== PLANTIO (todas as sementes funcionam) ====================
    const plantioTela = document.getElementById("plantioTela");
    const sementesContainer = document.getElementById("sementes");
    const regador = document.getElementById("regador");
    const setaRegador = document.getElementById("setaRegador");
    const plantinha = document.getElementById("plantinha");
    const areaPlantio = document.getElementById("areaPlantio");

    function iniciarPlantio() {
        plantioTela.classList.add("ativa");
        // Recriar sementes para garantir eventos limpos
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
                console.log(`Semente escolhida: ${sementeEscolhida}`);
                alert(`🌱 Você escolheu ${sementeEscolhida}!`);
                sementes.forEach(s2 => s2.style.display = "none");
                this.style.display = "block"; // mostra apenas a escolhida
                regador.style.display = "block";
                setaRegador.style.display = "block";
                // Evento do regador (único)
                const regadorElem = document.getElementById("regador");
                const novoRegador = regadorElem.cloneNode(true);
                regadorElem.parentNode.replaceChild(novoRegador, regadorElem);
                const regadorFinal = document.getElementById("regador");
                regadorFinal.addEventListener("click", function regar() {
                    if (!sementeEscolhida) return;
                    regadorFinal.style.display = "none";
                    setaRegador.style.display = "none";
                    plantinha.style.display = "block";
                    setTimeout(() => {
                        crescerPlanta(sementeEscolhida);
                    }, 2000);
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
        const mensagem = document.getElementById("mensagemFinal");
        telaFinal.classList.add("ativa");
        mensagem.innerHTML = `Parabéns, <strong>${nomeJogador}</strong>!<br><br>
        Você ajudou as abelhas, fez compostagem e plantou sua semente!<br><br>
        Agora você é um verdadeiro <strong>AgroHerói do Futuro Sustentável</strong>.<br><br>
        Agro Forte, Futuro Sustentável: equilíbrio entre produção e meio ambiente.<br><br>
        Desenvolvido por Matheus – 2º D Noturno<br>
        Colégio Estadual Antonio Tortato<br>
        Professora Patrícia Ferro`;
    }

    // ==================== CERTIFICADO PDF ====================
    const btnCert = document.getElementById("btnCertificado");
    const certTela = document.getElementById("certificadoTela");
    const nomeCert = document.getElementById("nomeCertificado");
    if (btnCert) {
        btnCert.addEventListener("click", () => {
            document.getElementById("telaFinal").classList.remove("ativa");
            certTela.classList.add("ativa");
            nomeCert.innerText = nomeJogador;
        });
    }
    const btnPDF = document.getElementById("baixarPDF");
    if (btnPDF) {
        btnPDF.addEventListener("click", () => {
            const conteudo = `<html><head><title>Certificado</title><style>body{font-family:Arial;text-align:center;padding:40px}.cert{border:10px solid #2f9e44;background:white;padding:40px;margin:auto;border-radius:20px}</style></head><body><div class="cert"><h1>CERTIFICADO DE AGROHERÓI</h1><p>Certificamos que</p><h2>${nomeJogador}</h2><p>concluiu as missões do projeto<br>Agro Forte, Futuro Sustentável</p><ul><li>Polinização</li><li>Compostagem</li><li>Plantio</li><li>Sustentabilidade</li></ul><h3>AGROHERÓI DO FUTURO SUSTENTÁVEL</h3><p>Adelita – AgroHeróis</p></div></body></html>`;
            const win = window.open();
            win.document.write(conteudo);
            win.document.close();
            win.print();
        });
    }

    console.log("✅ Jogo pronto: abelha em 35%, todas as sementes funcionam.");
});
