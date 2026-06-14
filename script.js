document.addEventListener("DOMContentLoaded", function() {
    // CONTROLE DE MÚSICA
    const botaoMusica = document.getElementById("btnMusica");
    const audio = document.getElementById("musicaFundo");
    let musicaTocando = false;

    if (botaoMusica && audio) {
        audio.addEventListener("canplaythrough", () => console.log("✅ Música carregada."));
        audio.addEventListener("error", () => {
            console.error("❌ Erro ao carregar musica.mp3");
            botaoMusica.disabled = true;
            botaoMusica.style.opacity = "0.5";
        });
        audio.load();
        botaoMusica.addEventListener("click", function() {
            if (musicaTocando) {
                audio.pause();
                botaoMusica.textContent = "🎵";
                musicaTocando = false;
            } else {
                audio.play().then(() => {
                    musicaTocando = true;
                    botaoMusica.textContent = "🔊";
                }).catch(err => alert("Clique novamente para tocar a música."));
            }
        });
    }

    // FALLBACK DA ABELHA (caso a.png não exista)
    const abelhaImg = document.getElementById('abelha');
    let abelhaElement = abelhaImg;
    if (abelhaImg) {
        abelhaImg.onerror = function() {
            const emojiBee = document.createElement('div');
            emojiBee.id = 'abelha-emoji';
            emojiBee.textContent = '🐝';
            emojiBee.style.cssText = 'position:absolute; font-size:80px; width:auto; height:auto; z-index:15; animation:flutuar 0.3s infinite alternate; pointer-events:none;';
            emojiBee.style.left = abelhaImg.style.left || (window.innerWidth * 0.45) + 'px';
            emojiBee.style.top = abelhaImg.style.top || (window.innerHeight / 2 - 50) + 'px';
            abelhaImg.style.display = 'none';
            abelhaImg.parentNode.appendChild(emojiBee);
            abelhaElement = emojiBee;
            window.abelhaElement = emojiBee;
        };
        abelhaImg.onload = function() {
            window.abelhaElement = abelhaImg;
            abelhaElement = abelhaImg;
        };
        if (abelhaImg.complete) {
            window.abelhaElement = abelhaImg;
            abelhaElement = abelhaImg;
        }
    }

    // Remove fundo branco das personagens
    document.querySelectorAll('.adelita, .adelita-final').forEach(el => {
        if (el) el.style.mixBlendMode = 'multiply';
    });

    // TRANSIÇÃO INICIAL
    const telaInicial = document.getElementById("telaInicial");
    const introducao = document.getElementById("introducao");
    const btnComecar = document.getElementById("btnComecar");

    if (btnComecar && telaInicial && introducao) {
        btnComecar.addEventListener("click", function() {
            telaInicial.classList.remove("ativa");
            introducao.classList.add("ativa");
            mostrarFala();
        });
    }

    // DIÁLOGOS
    let nomeJogador = "", personagemEscolhido = "", falaAtual = 0;
    const falas = [
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

    btnProximo.addEventListener("click", function() {
        if (falaAtual === 0) {
            nomeJogador = nomeInput.value.trim();
            if (!nomeJogador) return alert("Digite seu nome.");
        }
        if (falaAtual === 1 && !personagemEscolhido) {
            return alert("Escolha um personagem.");
        }
        falaAtual++;
        if (falaAtual < falas.length) {
            mostrarFala();
        } else {
            introducao.classList.remove("ativa");
            iniciarFaseAbelha();
        }
    });

    menina.addEventListener("click", function() {
        personagemEscolhido = "menina";
        menina.style.border = "4px solid green";
        menino.style.border = "none";
    });
    menino.addEventListener("click", function() {
        personagemEscolhido = "menino";
        menino.style.border = "4px solid green";
        menina.style.border = "none";
    });

    // FASE ABELHA (abelha centralizada a 45%)
    let jogoRodando = false;
    let floresColetadas = 0;
    let vidas = 3;
    let posYAbelha = 300;
    let intervaloObjetos;
    let animacaoLoop;
    let velocidadeAtual = 2.8;
    let acelerou = false;
    let vitoria = false;

    const faseAbelha = document.getElementById("faseAbelha");
    const objetosJogo = document.getElementById("objetosJogo");
    const contadorFloresSpan = document.getElementById("contadorFlores");
    const vidasSpan = document.getElementById("vidas");
    const sucessoAbelha = document.getElementById("sucessoAbelha");
    const msgSucesso = document.getElementById("msgSucesso");

    function setAbelhaTop(top) { if (abelhaElement) abelhaElement.style.top = top + "px"; }
    function setAbelhaLeft(left) { if (abelhaElement) abelhaElement.style.left = left + "px"; }

    function iniciarFaseAbelha() {
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
        const objeto = document.createElement("img");
        const rand = Math.floor(Math.random() * 5);
        if (rand === 0 || rand === 1) {
            const tiposFlor = ["flor.png", "milho.png", "soja.png"];
            objeto.src = tiposFlor[Math.floor(Math.random() * 3)];
            objeto.dataset.tipo = "flor";
        } else if (rand === 2) {
            objeto.src = "fogo.png";
            objeto.dataset.tipo = "fogo";
        } else {
            objeto.src = "fumaça.png";
            objeto.dataset.tipo = "fumaca";
        }
        objeto.classList.add("objeto");
        objeto.style.left = window.innerWidth + "px";
        objeto.style.top = Math.random() * (window.innerHeight - 100) + 20 + "px";
        objetosJogo.appendChild(objeto);
    }

    document.addEventListener("keydown", function(e) {
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
        const r1 = a.getBoundingClientRect();
        const r2 = b.getBoundingClientRect();
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
        msgSucesso.innerText = `Parabéns ${nomeJogador}! Você ajudou as abelhas e coletou 10 flores!`;
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
        btnProxCompostagem.addEventListener("click", function() {
            sucessoAbelha.classList.remove("ativa");
            iniciarDialogosCompostagem();
        });
    }

    // COMPOSTAGEM
    const transicaoCompostagem = document.getElementById("transicaoCompostagem");
    const textoCompostagemDiv = document.getElementById("textoCompostagem");
    const btnProxFalaCompostagem = document.getElementById("btnProxFalaCompostagem");
    const btnIniciarCompostagem = document.getElementById("btnIniciarCompostagem");
    const compostagemTela = document.getElementById("compostagemTela");
    const contadorCompostagemSpan = document.getElementById("contadorCompostagem");

    const falasCompostagem = [
        "Muito bem, [NOME]!\n\nAgora vamos aprender sobre a compostagem.\nA compostagem transforma restos de alimentos e folhas em adubo natural.",
        "Sua missão: arraste os materiais corretos para a composteira.\n✅ Pode colocar: cascas de frutas, cascas de legumes, folhas secas.",
        "❌ Não pode colocar: plástico, vidro, latas.\nSepare os resíduos corretamente.",
        "Clique em COMEÇAR para iniciar."
    ];
    let falaCompAtual = 0;

    function iniciarDialogosCompostagem() {
        transicaoCompostagem.classList.add("ativa");
        falaCompAtual = 0;
        mostrarFalaCompostagem();
        btnProxFalaCompostagem.style.display = "block";
        btnIniciarCompostagem.style.display = "none";
    }

    function mostrarFalaCompostagem() {
        let txt = falasCompostagem[falaCompAtual].replace("[NOME]", nomeJogador);
        textoCompostagemDiv.innerText = txt;
        if (falaCompAtual === falasCompostagem.length - 1) {
            btnProxFalaCompostagem.style.display = "none";
            btnIniciarCompostagem.style.display = "block";
        } else {
            btnProxFalaCompostagem.style.display = "block";
            btnIniciarCompostagem.style.display = "none";
        }
    }

    btnProxFalaCompostagem.addEventListener("click", function() {
        if (falaCompAtual < falasCompostagem.length - 1) {
            falaCompAtual++;
            mostrarFalaCompostagem();
        }
    });
    btnIniciarCompostagem.addEventListener("click", function() {
        transicaoCompostagem.classList.remove("ativa");
        iniciarCompostagem();
    });

    let acertosCompostagem = 0;
    function iniciarCompostagem() {
        compostagemTela.classList.add("ativa");
        acertosCompostagem = 0;
        contadorCompostagemSpan.innerText = "Acertos: 0 / 4";
        document.querySelectorAll("#itensCompostagem .item").forEach(item => {
            item.setAttribute("draggable", "true");
            item.style.display = "inline-block";
            item.addEventListener("dragstart", dragStart);
        });
        const composteira = document.getElementById("composteira");
        composteira.addEventListener("dragover", e => e.preventDefault());
        composteira.addEventListener("drop", dropNaComposteira);
    }

    let dragSrc = null;
    function dragStart(e) {
        dragSrc = e.target;
        e.dataTransfer.setData("text/plain", e.target.src);
    }
    function dropNaComposteira(e) {
        e.preventDefault();
        const item = dragSrc;
        if (!item) return;
        const isCorreto = item.getAttribute("data-correto") === "true";
        if (isCorreto) {
            acertosCompostagem++;
            contadorCompostagemSpan.innerText = `Acertos: ${acertosCompostagem} / 4`;
            item.style.display = "none";
            if (acertosCompostagem >= 4) {
                alert(`Parabéns ${nomeJogador}! Você produziu adubo natural!`);
                compostagemTela.classList.remove("ativa");
                iniciarDialogosPlantio();
            }
        } else {
            alert("❌ Esse material NÃO deve ir para a composteira!");
        }
        dragSrc = null;
    }

    // PLANTIO (corrigido: todas as sementes funcionam)
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
        "Parabéns, [NOME]! Você separou os resíduos corretamente e produziu adubo natural.",
        "Agora o solo está preparado! Lembra das abelhas? Elas ajudam as plantas a produzir frutos.",
        "Sua próxima missão: escolha uma semente para plantar: Milho, Tomate ou Soja.",
        "Depois regue sua plantinha. Clique em COMEÇAR."
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
    btnProxFalaPlantio.addEventListener("click", function() {
        if (falaPlantioAtual < falasPlantio.length - 1) {
            falaPlantioAtual++;
            mostrarFalaPlantio();
        }
    });
    btnIniciarPlantio.addEventListener("click", function() {
        transicaoPlantio.classList.remove("ativa");
        iniciarPlantioFase();
    });

    function iniciarPlantioFase() {
        plantioTela.classList.add("ativa");
        sementeEscolhida = "";
        regador.style.display = "none";
        plantinha.style.display = "none";
        setaRegador.style.display = "none";
        const plantaExistente = document.getElementById("plantaFinal");
        if (plantaExistente) plantaExistente.remove();

        // Recriar sementes para garantir eventos limpos
        const sementes = document.querySelectorAll(".semente");
        sementes.forEach(s => {
            const clone = s.cloneNode(true);
            s.parentNode.replaceChild(clone, s);
        });
        const novasSementes = document.querySelectorAll(".semente");
        
        novasSementes.forEach(semente => {
            semente.addEventListener("click", function(e) {
                e.stopPropagation();
                if (sementeEscolhida !== "") return;
                sementeEscolhida = this.dataset.semente;
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
        mensagemFinal.innerHTML = `Parabéns, <strong>${nomeJogador}</strong>!<br><br>Você ajudou as abelhas, fez compostagem, plantou uma semente e cuidou da sua planta até ela crescer.<br><br>Muito obrigada pela sua ajuda!<br><br>Agora você é um verdadeiro <strong>AgroHerói do Futuro Sustentável</strong>.<br><br>Agro Forte, Futuro Sustentável: equilíbrio entre produção e meio ambiente.<br><br>Desenvolvido pelo aluno Matheus – 2º D Noturno<br>Colégio Estadual Antonio Tortato<br>Professora Patrícia Ferro`;
    }

    // CERTIFICADO E PDF
    const btnCertificado = document.getElementById("btnCertificado");
    const certificadoTela = document.getElementById("certificadoTela");
    const nomeCertificadoSpan = document.getElementById("nomeCertificado");
    if (btnCertificado) {
        btnCertificado.addEventListener("click", function() {
            document.getElementById("telaFinal").classList.remove("ativa");
            certificadoTela.classList.add("ativa");
            nomeCertificadoSpan.innerText = nomeJogador;
        });
    }

    const btnPDF = document.getElementById("baixarPDF");
    if (btnPDF) {
        btnPDF.addEventListener("click", function() {
            const conteudo = `<html><head><title>Certificado AgroHerói</title><style>body{font-family:Arial;text-align:center;padding:40px;background:#f4f4f4}.cert{border:10px solid #2f9e44;background:white;padding:40px;max-width:800px;margin:auto;border-radius:20px}h1{color:#2f9e44}ul{text-align:left;display:inline-block}</style></head><body><div class="cert"><h1>CERTIFICADO DE AGROHERÓI</h1><p>A equipe dos AgroHeróis certifica que</p><h2>${nomeJogador}</h2><p>concluiu com sucesso todas as missões do projeto<br>Agro Forte, Futuro Sustentável</p><p>Demonstrando conhecimento sobre:</p><ul><li>Polinização e a importância das abelhas</li><li>Compostagem e reciclagem de nutrientes</li><li>Plantio e cuidados com as plantas</li><li>Sustentabilidade e preservação ambiental</li></ul><h3>AGROHERÓI DO FUTURO SUSTENTÁVEL</h3><div class="assinatura">Adelita – AgroHeróis</div></div></body></html>`;
            const win = window.open();
            win.document.write(conteudo);
            win.document.close();
            win.print();
        });
    }

    console.log("✅ Jogo AgroHeróis carregado – abelha centralizada, todas as sementes funcionam.");
});
