document.addEventListener("DOMContentLoaded", function() {
    // =============================================
    // CONTROLE DE MÚSICA
    // =============================================
    const botaoMusica = document.getElementById("btnMusica");
    const audio = document.getElementById("musicaFundo");
    let musicaTocando = false;
    if (botaoMusica && audio) {
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

    // =============================================
    // ABELHA POSICIONADA A 40% DA LARGURA
    // =============================================
    const abelhaImg = document.getElementById('abelha');
    let abelhaElement = abelhaImg;

    function posicionarAbelhaHorizontal() {
        if (!abelhaElement) return;
        if (abelhaElement.id === 'abelha-emoji') {
            // Fallback emoji: centraliza no ponto 40% da largura
            abelhaElement.style.left = '40%';
            abelhaElement.style.transform = 'translateX(-40%)';
        } else {
            const largura = abelhaElement.offsetWidth;
            // Posição = 40% da largura da tela - metade da largura da imagem
            let posX = (window.innerWidth * 0.4) - (largura / 2);
            posX = Math.max(0, Math.min(posX, window.innerWidth - largura));
            abelhaElement.style.left = posX + 'px';
            abelhaElement.style.transform = 'none'; // remove qualquer transform
        }
    }

    function setAbelhaTop(top) {
        if (abelhaElement) abelhaElement.style.top = top + "px";
    }

    // Fallback: se a imagem a.png não existir
    if (abelhaImg) {
        abelhaImg.onerror = function() {
            const emojiBee = document.createElement('div');
            emojiBee.id = 'abelha-emoji';
            emojiBee.textContent = '🐝';
            emojiBee.style.cssText = 'position:absolute; font-size:80px; z-index:15; animation:flutuar 0.3s infinite alternate; pointer-events:none;';
            emojiBee.style.left = '40%';
            emojiBee.style.transform = 'translateX(-40%)';
            emojiBee.style.top = (window.innerHeight / 2 - 50) + 'px';
            abelhaImg.style.display = 'none';
            abelhaImg.parentNode.appendChild(emojiBee);
            abelhaElement = emojiBee;
            window.abelhaElement = emojiBee;
            posicionarAbelhaHorizontal();
        };
        abelhaImg.onload = function() {
            window.abelhaElement = abelhaImg;
            abelhaElement = abelhaImg;
            posicionarAbelhaHorizontal();
        };
        if (abelhaImg.complete) {
            window.abelhaElement = abelhaImg;
            abelhaElement = abelhaImg;
            posicionarAbelhaHorizontal();
        }
    }

    // =============================================
    // TELA INICIAL E INTRODUÇÃO
    // =============================================
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
        "Mas atenção!\n\n🚫 Não chegue perto do fogo.\n🚫 Nem da fumaça.\nSe encostar, perderá energia.",
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

    // =============================================
    // FASE ABELHA – POSIÇÃO FIXA EM 40% DA LARGURA
    // =============================================
    let jogoRodando = false, floresColetadas = 0, vidas = 3, posYAbelha = 300;
    let intervaloObjetos, animacaoLoop, velocidadeAtual = 2.8, acelerou = false, vitoria = false;
    const faseAbelha = document.getElementById("faseAbelha");
    const objetosJogo = document.getElementById("objetosJogo");
    const contadorFloresSpan = document.getElementById("contadorFlores");
    const vidasSpan = document.getElementById("vidas");
    const sucessoAbelha = document.getElementById("sucessoAbelha");
    const msgSucesso = document.getElementById("msgSucesso");

    window.addEventListener("resize", function() {
        if (faseAbelha.classList.contains("ativa") && jogoRodando) {
            posicionarAbelhaHorizontal();
            posYAbelha = Math.min(window.innerHeight - 80, Math.max(20, posYAbelha));
            setAbelhaTop(posYAbelha);
        }
    });

    function iniciarFaseAbelha() {
        faseAbelha.classList.add("ativa");
        jogoRodando = true;
        floresColetadas = 0;
        vidas = 3;
        acelerou = false;
        vitoria = false;
        velocidadeAtual = 2.8;
        posYAbelha = window.innerHeight / 2 - 50;
        posicionarAbelhaHorizontal();
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

    // =============================================
    // COMPOSTAGEM (mantido igual)
    // =============================================
    const transicaoCompostagem = document.getElementById("transicaoCompostagem");
    const textoCompostagemDiv = document.getElementById("textoCompostagem");
    const btnProxFalaCompostagem = document.getElementById("btnProxFalaCompostagem");
    const btnIniciarCompostagem = document.getElementById("btnIniciarCompostagem");
    const compostagemTela = document.getElementById("compostagemTela");
    const contadorCompostagemSpan = document.getElementById("contadorCompostagem");
    const falasCompostagem = [
        "Muito bem, [NOME]!\n\nAgora vamos aprender sobre a compostagem.\nA compostagem transforma restos de alimentos e folhas em adubo natural, ajudando as plantas a crescerem fortes e saudáveis.",
        "Sua missão: arraste os materiais corretos para a composteira.\n✅ Pode colocar: cascas de frutas, cascas de legumes, folhas secas.",
        "❌ Não pode colocar: plástico, vidro, latas.\nSepare os resíduos corretamente e ajude a cuidar do meio ambiente.",
        "Clique em COMEÇAR para iniciar a separação dos resíduos."
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

    let acertosCompostagem = 0, dragSrc = null;
    function iniciarCompostagem() {
        compostagemTela.classList.add("ativa");
        acertosCompostagem = 0;
        contadorCompostagemSpan.innerText = "Acertos: 0 / 4";
        document.querySelectorAll("#itensCompostagem .item").forEach(item => {
            item.setAttribute("draggable", "true");
            item.style.display = "inline-block";
            item.addEventListener("dragstart", e => {
                dragSrc = e.target;
                e.dataTransfer.setData("text/plain", e.target.src);
            });
        });
        const composteira = document.getElementById("composteira");
        composteira.addEventListener("dragover", e => e.preventDefault());
        composteira.addEventListener("drop", e => {
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
        });
    }

    // =============================================
    // PLANTIO – SEMENTES CLICÁVEIS
    // =============================================
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

    function configurarSementes() {
        const sementes = document.querySelectorAll(".semente");
        sementes.forEach(semente => {
            semente.removeEventListener("click", semente._handler);
            const handler = function() {
                if (sementeEscolhida !== "") return;
                const tipo = this.dataset.semente;
                if (!tipo) return;
                sementeEscolhida = tipo;
                document.querySelectorAll(".semente").forEach(s => s.style.display = "none");
                this.style.display = "block";
                alert(`🌱 Você escolheu ${sementeEscolhida}! Agora regue a planta.`);
                regador.style.display = "block";
                setaRegador.style.display = "block";
                if (regador._regarHandler) regador.removeEventListener("click", regador._regarHandler);
                const regarHandler = function() {
                    regador.style.display = "none";
                    setaRegador.style.display = "none";
                    plantinha.style.display = "block";
                    setTimeout(() => crescerPlanta(sementeEscolhida), 2000);
                };
                regador.addEventListener("click", regarHandler);
                regador._regarHandler = regarHandler;
            };
            semente.addEventListener("click", handler);
            semente._handler = handler;
        });
    }

    function iniciarPlantioFase() {
        plantioTela.classList.add("ativa");
        regador.style.display = "none";
        plantinha.style.display = "none";
        setaRegador.style.display = "none";
        sementeEscolhida = "";
        const plantaExistente = document.getElementById("plantaFinal");
        if (plantaExistente) plantaExistente.remove();
        document.querySelectorAll(".semente").forEach(s => s.style.display = "inline-block");
        configurarSementes();
    }

    function crescerPlanta(tipo) {
        if (plantinha.parentNode) plantinha.remove();
        const plantaFinal = document.createElement("img");
        let src = "";
        if (tipo === "milho") src = "milhocresce.png";
        else if (tipo === "tomate") src = "tomatecresce.png";
        else src = "sojacrece.png";
        plantaFinal.onerror = function() { this.src = "sojacrece.png"; };
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
        mensagemFinal.innerHTML = `Parabéns, <strong>${nomeJogador}</strong>!<br><br>Você ajudou as abelhas, fez compostagem, plantou uma semente e cuidou da sua planta até ela crescer.<br><br>Muito obrigada pela sua ajuda!<br><br>Agora você é um verdadeiro <strong>AgroHerói do Futuro Sustentável</strong>.<br><br>Agro Forte, Futuro Sustentável: equilíbrio entre produção e meio ambiente.<br><br>Obrigado por participar desta missão`;
    }

    // =============================================
    // CERTIFICADO E PDF
    // =============================================
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

    console.log("✅ Jogo carregado – abelha posicionada a 40% da largura, sementes clicáveis.");
});
