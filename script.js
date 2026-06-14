document.addEventListener("DOMContentLoaded", function() {
    console.log("🚀 Script iniciado");

    // ========== MÚSICA ==========
    const botaoMusica = document.getElementById("btnMusica");
    const audio = document.getElementById("musicaFundo");
    let musicaTocando = false;
    if (botaoMusica && audio) {
        audio.addEventListener("canplaythrough", () => console.log("✅ Música carregada."));
        audio.addEventListener("error", () => console.error("❌ Erro ao carregar musica.mp3"));
        audio.load();
        botaoMusica.addEventListener("click", () => {
            if (musicaTocando) {
                audio.pause();
                botaoMusica.textContent = "🎵";
                musicaTocando = false;
            } else {
                audio.play().then(() => {
                    musicaTocando = true;
                    botaoMusica.textContent = "🔊";
                }).catch(e => console.error(e));
            }
        });
    }

    // ========== FALLBACK ABELHA ==========
    const abelhaImg = document.getElementById('abelha');
    let abelhaElement = abelhaImg;
    if (abelhaImg) {
        abelhaImg.onerror = function() {
            const emoji = document.createElement('div');
            emoji.textContent = '🐝';
            emoji.style.cssText = 'position:absolute; font-size:80px; z-index:15; animation:flutuar 0.3s infinite alternate; pointer-events:none;';
            emoji.style.left = (window.innerWidth * 0.45) + 'px';
            emoji.style.top = (window.innerHeight / 2 - 50) + 'px';
            abelhaImg.style.display = 'none';
            abelhaImg.parentNode.appendChild(emoji);
            abelhaElement = emoji;
            window.abelhaElement = emoji;
            console.log("🐝 Usando emoji para abelha");
        };
        if (abelhaImg.complete) window.abelhaElement = abelhaImg;
        else abelhaImg.onload = () => { window.abelhaElement = abelhaImg; };
    }

    // Remove fundo branco personagens
    document.querySelectorAll('.adelita, .adelita-final').forEach(el => el.style.mixBlendMode = 'multiply');

    // ========== TELA INICIAL -> INTRODUÇÃO ==========
    const telaInicial = document.getElementById("telaInicial");
    const introducao = document.getElementById("introducao");
    const btnComecar = document.getElementById("btnComecar");
    if (btnComecar && telaInicial && introducao) {
        btnComecar.addEventListener("click", () => {
            telaInicial.classList.remove("ativa");
            introducao.classList.add("ativa");
            mostrarFala();
        });
    } else console.error("Botão COMEÇAR não encontrado");

    // ========== DIÁLOGOS ==========
    let nomeJogador = "", personagemEscolhido = "", falaAtual = 0;
    const falas = [
        "Olá! Eu sou a Adelita e faço parte dos AgroHeróis!\n\nQual é o seu nome?",
        "Que nome lindo, [NOME]!\n\nHoje você vai participar de uma missão muito importante.\n\nEscolha seu personagem.",
        "UAL!!!\n\nO tema da nossa aventura é:\n\nAgro Forte, Futuro Sustentável:\nEquilíbrio entre Produção e Meio Ambiente.",
        "Para produzir alimentos e cuidar da natureza ao mesmo tempo, precisamos da ajuda de muitos seres vivos.\n\nUm dos mais importantes é a abelha.",
        "As abelhas realizam a polinização, um processo que ajuda as plantas a produzir flores, frutos e sementes.",
        "Graças à polinização, podemos ter alimentos como: Maçã, Morango, Melancia, Pepino, Café.",
        "Sem as abelhas, a produção de alimentos seria muito menor. Por isso, sua missão será ajudar uma abelha a coletar flores.",
        "Como jogar: ↑ Seta para cima = subir, ↓ Seta para baixo = descer",
        "Seu objetivo: coletar 10 flores. Cada flor aumenta sua pontuação.",
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
        let texto = falas[falaAtual].replace("[NOME]", nomeJogador);
        textoDialogo.innerText = texto;
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

    // ========== FASE ABELHA (centralizada a 45%) ==========
    let jogoRodando = false, floresColetadas = 0, vidas = 3, posYAbelha = 300;
    let intervaloObjetos, animacaoLoop, velocidadeAtual = 2.8, acelerou = false, vitoria = false;
    const faseAbelha = document.getElementById("faseAbelha");
    const objetosJogo = document.getElementById("objetosJogo");
    const contadorFloresSpan = document.getElementById("contadorFlores");
    const vidasSpan = document.getElementById("vidas");
    const sucessoAbelha = document.getElementById("sucessoAbelha");
    const msgSucesso = document.getElementById("msgSucesso");

    function setAbelhaTop(top) { if (abelhaElement) abelhaElement.style.top = top + "px"; }
    function setAbelhaLeft(left) { if (abelhaElement) abelhaElement.style.left = left + "px"; }

    function iniciarFaseAbelha() {
        console.log("🐝 Iniciando fase abelha");
        faseAbelha.classList.add("ativa");
        jogoRodando = true;
        floresColetadas = 0;
        vidas = 3;
        acelerou = false;
        vitoria = false;
        velocidadeAtual = 2.8;
        posYAbelha = window.innerHeight / 2 - 50;
        const leftPos = (window.innerWidth * 0.45) + "px";
        setAbelhaLeft(leftPos);
        setAbelhaTop(posYAbelha);
        atualizarHUD();
        if (intervaloObjetos) clearInterval(intervaloObjetos);
        intervaloObjetos = setInterval(criarObjeto, 2000);
        animacaoLoop = requestAnimationFrame(loopJogo);
    }

    function atualizarHUD() {
        contadorFloresSpan.innerText = `🌸 Flores: ${floresColetadas} / 10`;
        vidasSpan.innerText = `❤️ Vidas: ${vidas}`;
    }

    function criarObjeto() {
        if (!jogoRodando) return;
        const obj = document.createElement("img");
        const rand = Math.floor(Math.random() * 5);
        if (rand === 0 || rand === 1) {
            const tipos = ["flor.png", "milho.png", "soja.png"];
            obj.src = tipos[Math.floor(Math.random() * 3)];
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

    document.addEventListener("keydown", (e) => {
        if (!jogoRodando) return;
        if (e.key === "ArrowUp") {
            posYAbelha = Math.max(20, posYAbelha - 30);
            setAbelhaTop(posYAbelha);
        } else if (e.key === "ArrowDown") {
            posYAbelha = Math.min(window.innerHeight - 80, posYAbelha + 30);
            setAbelhaTop(posYAbelha);
        }
    });

    function colidiu(a, b) {
        const r1 = a.getBoundingClientRect(), r2 = b.getBoundingClientRect();
        return !(r1.top > r2.bottom || r1.bottom < r2.top || r1.left > r2.right || r1.right < r2.left);
    }

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
                        console.log("🚀 Acelerou!");
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

    const btnProxCompostagem = document.getElementById("btnProxCompostagem");
    if (btnProxCompostagem) {
        btnProxCompostagem.addEventListener("click", () => {
            sucessoAbelha.classList.remove("ativa");
            iniciarDialogosCompostagem();
        });
    }

    // ========== COMPOSTAGEM (resumida, mas funcional) ==========
    const transicaoCompostagem = document.getElementById("transicaoCompostagem");
    const textoCompostagemDiv = document.getElementById("textoCompostagem");
    const btnProxFalaCompostagem = document.getElementById("btnProxFalaCompostagem");
    const btnIniciarCompostagem = document.getElementById("btnIniciarCompostagem");
    const compostagemTela = document.getElementById("compostagemTela");
    const contadorCompostagemSpan = document.getElementById("contadorCompostagem");

    const falasComp = [
        "Muito bem, [NOME]! Agora vamos aprender sobre compostagem.",
        "Arraste os materiais corretos (melancia, banana, maçã, ovo) para a composteira.",
        "Não arraste lata ou metal! Separe corretamente.",
        "Clique em COMEÇAR."
    ];
    let falaCompAtual = 0;

    function iniciarDialogosCompostagem() {
        transicaoCompostagem.classList.add("ativa");
        falaCompAtual = 0;
        mostrarFalaComp();
        btnProxFalaCompostagem.style.display = "block";
        btnIniciarCompostagem.style.display = "none";
    }
    function mostrarFalaComp() {
        let txt = falasComp[falaCompAtual].replace("[NOME]", nomeJogador);
        textoCompostagemDiv.innerText = txt;
        if (falaCompAtual === falasComp.length - 1) {
            btnProxFalaCompostagem.style.display = "none";
            btnIniciarCompostagem.style.display = "block";
        } else {
            btnProxFalaCompostagem.style.display = "block";
            btnIniciarCompostagem.style.display = "none";
        }
    }
    btnProxFalaCompostagem.addEventListener("click", () => {
        if (falaCompAtual < falasComp.length - 1) {
            falaCompAtual++;
            mostrarFalaComp();
        }
    });
    btnIniciarCompostagem.addEventListener("click", () => {
        transicaoCompostagem.classList.remove("ativa");
        iniciarCompostagem();
    });

    let acertosComp = 0;
    function iniciarCompostagem() {
        compostagemTela.classList.add("ativa");
        acertosComp = 0;
        contadorCompostagemSpan.innerText = "Acertos: 0 / 4";
        document.querySelectorAll("#itensCompostagem .item").forEach(item => {
            item.setAttribute("draggable", "true");
            item.style.display = "inline-block";
            item.addEventListener("dragstart", e => {
                e.dataTransfer.setData("text/plain", e.target.src);
                dragSrc = e.target;
            });
        });
        const composteira = document.getElementById("composteira");
        composteira.addEventListener("dragover", e => e.preventDefault());
        composteira.addEventListener("drop", dropComp);
    }
    let dragSrc = null;
    function dropComp(e) {
        e.preventDefault();
        const item = dragSrc;
        if (!item) return;
        const isCorreto = item.getAttribute("data-correto") === "true";
        if (isCorreto) {
            acertosComp++;
            contadorCompostagemSpan.innerText = `Acertos: ${acertosComp} / 4`;
            item.style.display = "none";
            if (acertosComp >= 4) {
                alert(`Parabéns ${nomeJogador}! Adubo natural produzido!`);
                compostagemTela.classList.remove("ativa");
                iniciarDialogosPlantio();
            }
        } else alert("❌ Esse material NÃO deve ir para a composteira!");
        dragSrc = null;
    }

    // ========== PLANTIO (corrigido para todas as sementes) ==========
    const transicaoPlantio = document.getElementById("transicaoPlantio");
    const textoPlantioDiv = document.getElementById("textoPlantio");
    const btnProxFalaPlantio = document.getElementById("btnProxFalaPlantio");
    const btnIniciarPlantio = document.getElementById("btnIniciarPlantio");
    const plantioTela = document.getElementById("plantioTela");
    const regador = document.getElementById("regador");
    const setaRegador = document.getElementById("setaRegador");
    const plantinha = document.getElementById("plantinha");
    const areaPlantio = document.getElementById("areaPlantio");
    let sementeEscolhida = "";

    const falasPlantio = [
        "Parabéns, [NOME]! Você produziu adubo natural.",
        "O solo está preparado! Lembra das abelhas? Elas ajudam a produzir frutos.",
        "Escolha uma semente: Milho, Tomate ou Soja.",
        "Regue a plantinha. Clique em COMEÇAR."
    ];
    let falaPlantioAtual = 0;

    function iniciarDialogosPlantio() {
        transicaoPlantio.classList.add("ativa");
        falaPlantioAtual = 0;
        mostrarFalaPlantio();
        btnProxFalaPlantio.style.display = "block";
        btnIniciarPlantio.style.display = "none";
    }
    function mostrarFalaPlantio() {
        let txt = falasPlantio[falaPlantioAtual].replace("[NOME]", nomeJogador);
        textoPlantioDiv.innerText = txt;
        if (falaPlantioAtual === falasPlantio.length - 1) {
            btnProxFalaPlantio.style.display = "none";
            btnIniciarPlantio.style.display = "block";
        } else {
            btnProxFalaPlantio.style.display = "block";
            btnIniciarPlantio.style.display = "none";
        }
    }
    btnProxFalaPlantio.addEventListener("click", () => {
        if (falaPlantioAtual < falasPlantio.length - 1) {
            falaPlantioAtual++;
            mostrarFalaPlantio();
        }
    });
    btnIniciarPlantio.addEventListener("click", () => {
        transicaoPlantio.classList.remove("ativa");
        iniciarPlantioFase();
    });

    function iniciarPlantioFase() {
        console.log("🌱 Iniciando fase plantio");
        plantioTela.classList.add("ativa");
        sementeEscolhida = "";
        regador.style.display = "none";
        plantinha.style.display = "none";
        setaRegador.style.display = "none";
        const plantaExistente = document.getElementById("plantaFinal");
        if (plantaExistente) plantaExistente.remove();

        // Recriar sementes para garantir eventos frescos
        const sementes = document.querySelectorAll(".semente");
        sementes.forEach(s => {
            const clone = s.cloneNode(true);
            s.parentNode.replaceChild(clone, s);
        });
        const novasSementes = document.querySelectorAll(".semente");
        console.log("Sementes encontradas:", novasSementes.length);

        novasSementes.forEach((semente, index) => {
            semente.addEventListener("click", function(e) {
                e.stopPropagation();
                if (sementeEscolhida !== "") {
                    console.log("Semente já escolhida:", sementeEscolhida);
                    return;
                }
                sementeEscolhida = this.dataset.semente;
                console.log("Semente escolhida:", sementeEscolhida);
                novasSementes.forEach(s => s.style.display = "none");
                this.style.display = "block";
                alert(`🌱 Você escolheu ${sementeEscolhida}! Agora regue a planta.`);
                regador.style.display = "block";
                setaRegador.style.display = "block";
                
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
        const plantaFinal = document.createElement("img");
        let src = "";
        if (tipo === "milho") src = "milhocresce.png";
        else if (tipo === "tomate") src = "tomatecresce.png";
        else src = "sojacrece.png";
        plantaFinal.src = src;
        plantaFinal.id = "plantaFinal";
        plantaFinal.style.cssText = "position:absolute; bottom:80px; left:50%; transform:translateX(-50%); width:100px; transition:width 0.1s linear;";
        areaPlantio.appendChild(plantaFinal);
        let tamanho = 100;
        const intervalo = setInterval(() => {
            tamanho += 12;
            plantaFinal.style.width = tamanho + "px";
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
        mensagemFinal.innerHTML = `Parabéns, <strong>${nomeJogador}</strong>!<br><br>Você ajudou as abelhas, fez compostagem, plantou uma semente e cuidou da sua planta.<br><br>Muito obrigado!<br><br>Você é um <strong>AgroHerói do Futuro Sustentável</strong>.<br><br>Desenvolvido por Matheus Souza Nascimento – 2º D Noturno<br>Colégio Estadual Antonio Tortato<br>Professora Patrícia Ferro`;
    }

    // ========== CERTIFICADO ==========
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
            const conteudo = `<html><head><title>Certificado</title><style>body{font-family:Arial;text-align:center;padding:40px}.cert{border:10px solid #2f9e44;background:white;padding:40px;max-width:800px;margin:auto;border-radius:20px}</style></head><body><div class="cert"><h1>CERTIFICADO DE AGROHERÓI</h1><p>Certificamos que</p><h2>${nomeJogador}</h2><p>concluiu as missões do projeto<br>Agro Forte, Futuro Sustentável</p><ul><li>Polinização</li><li>Compostagem</li><li>Plantio</li><li>Sustentabilidade</li></ul><h3>AGROHERÓI DO FUTURO SUSTENTÁVEL</h3><p>Adelita – AgroHeróis</p></div></body></html>`;
            const win = window.open();
            win.document.write(conteudo);
            win.document.close();
            win.print();
        });
    }

    console.log("✅ Jogo AgroHeróis carregado – abelha a 45%, todas as sementes funcionam.");
});
