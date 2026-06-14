document.addEventListener("DOMContentLoaded", function() {
    // =============================================
    // CONTROLE DE MÚSICA
    // =============================================
    const botaoMusica = document.getElementById("btnMusica");
    const audio = document.getElementById("musicaFundo");
    let musicaTocando = false;
    if (botaoMusica && audio) {
        audio.load();
        botaoMusica.addEventListener("click", () => {
            if (musicaTocando) {
                audio.pause();
                botaoMusica.textContent = "🎵";
            } else {
                audio.play().catch(e => console.log("Áudio aguardando interação"));
                botaoMusica.textContent = "🔊";
            }
            musicaTocando = !musicaTocando;
        });
    }

    // =============================================
    // ABELHA – POSIÇÃO 40% DA LARGURA
    // =============================================
    const abelhaImg = document.getElementById("abelha");
    let abelhaElement = abelhaImg;
    const ABELHA_X = window.innerWidth * 0.4;
    let abelhaY = window.innerHeight / 2 - 50;

    if (abelhaImg) {
        abelhaImg.onerror = () => {
            const emoji = document.createElement("div");
            emoji.id = "abelha-emoji";
            emoji.textContent = "🐝";
            emoji.style.cssText = "position:absolute; font-size:80px; z-index:15; animation:flutuar 0.3s infinite alternate;";
            emoji.style.left = ABELHA_X + "px";
            emoji.style.top = abelhaY + "px";
            abelhaImg.style.display = "none";
            abelhaImg.parentNode.appendChild(emoji);
            abelhaElement = emoji;
        };
        abelhaImg.style.position = "absolute";
        abelhaImg.style.left = ABELHA_X + "px";
        abelhaImg.style.top = abelhaY + "px";
        abelhaElement = abelhaImg;
    } else {
        const emoji = document.createElement("div");
        emoji.id = "abelha-emoji";
        emoji.textContent = "🐝";
        emoji.style.cssText = "position:absolute; font-size:80px; z-index:15; animation:flutuar 0.3s infinite alternate;";
        emoji.style.left = ABELHA_X + "px";
        emoji.style.top = abelhaY + "px";
        document.body.appendChild(emoji);
        abelhaElement = emoji;
    }

    // Remove fundo branco das personagens
    document.querySelectorAll(".adelita, .adelita-final").forEach(el => el.style.mixBlendMode = "multiply");

    // =============================================
    // TELA INICIAL → INTRODUÇÃO
    // =============================================
    const telaInicial = document.getElementById("telaInicial");
    const introducao = document.getElementById("introducao");
    const btnComecar = document.getElementById("btnComecar");
    btnComecar?.addEventListener("click", () => {
        telaInicial.classList.remove("ativa");
        introducao.classList.add("ativa");
        mostrarFala();
    });

    // =============================================
    // DIÁLOGOS DA INTRODUÇÃO (12 falas)
    // =============================================
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

    // =============================================
    // FASE ABELHA (com perda de vida única)
    // =============================================
    let jogoRodando = false;
    let floresColetadas = 0;
    let vidas = 3;
    let velocidade = 2.8;
    let acelerou = false;
    let intervaloObjetos;
    let animacao;
    const faseAbelha = document.getElementById("faseAbelha");
    const objetosContainer = document.getElementById("objetosJogo");
    const contadorFlores = document.getElementById("contadorFlores");
    const contadorVidas = document.getElementById("vidas");
    const telaSucesso = document.getElementById("sucessoAbelha");
    const msgSucesso = document.getElementById("msgSucesso");

    function atualizarHUD() {
        contadorFlores.innerText = `🌸 Flores: ${floresColetadas} / 10`;
        contadorVidas.innerText = `❤️ Vidas: ${vidas}`;
    }

    function criarObjeto() {
        if (!jogoRodando) return;
        const obj = document.createElement("img");
        const rand = Math.floor(Math.random() * 5);
        if (rand < 2) {
            const floresImg = ["flor.png", "milho.png", "soja.png"];
            obj.src = floresImg[Math.floor(Math.random() * 3)];
            obj.dataset.tipo = "flor";
        } else if (rand === 2) {
            obj.src = "fogo.png";
            obj.dataset.tipo = "fogo";
        } else {
            obj.src = "fumaça.png";
            obj.dataset.tipo = "fumaca";
        }
        obj.classList.add("objeto");
        obj.style.position = "absolute";
        obj.style.width = "80px";
        obj.style.left = window.innerWidth + "px";
        obj.style.top = Math.random() * (window.innerHeight - 100) + 20 + "px";
        objetosContainer.appendChild(obj);
    }

    function colidiu(a, b) {
        if (!a || !b) return false;
        const r1 = a.getBoundingClientRect();
        const r2 = b.getBoundingClientRect();
        return !(r1.top > r2.bottom || r1.bottom < r2.top || r1.left > r2.right || r1.right < r2.left);
    }

    window.addEventListener("keydown", (e) => {
        if (!jogoRodando) return;
        if (e.key === "ArrowUp") {
            abelhaY = Math.max(20, abelhaY - 30);
            if (abelhaElement) abelhaElement.style.top = abelhaY + "px";
            e.preventDefault();
        } else if (e.key === "ArrowDown") {
            abelhaY = Math.min(window.innerHeight - 80, abelhaY + 30);
            if (abelhaElement) abelhaElement.style.top = abelhaY + "px";
            e.preventDefault();
        }
    });

    function loop() {
        if (!jogoRodando) return;
        const objetos = document.querySelectorAll(".objeto");
        objetos.forEach(obj => {
            let x = parseFloat(obj.style.left);
            x -= velocidade;
            obj.style.left = x + "px";
            if (x + obj.offsetWidth < 0) obj.remove();
            if (abelhaElement && colidiu(abelhaElement, obj)) {
                if (obj.dataset.tipo === "flor") {
                    floresColetadas++;
                    atualizarHUD();
                    obj.remove();
                    if (floresColetadas >= 5 && !acelerou) {
                        acelerou = true;
                        velocidade = 4.2;
                    }
                    if (floresColetadas >= 10) {
                        jogoRodando = false;
                        clearInterval(intervaloObjetos);
                        cancelAnimationFrame(animacao);
                        objetosContainer.innerHTML = "";
                        faseAbelha.classList.remove("ativa");
                        msgSucesso.innerText = `Parabéns ${nomeJogador}! Você coletou 10 flores!`;
                        telaSucesso.classList.add("ativa");
                    }
                } else if (obj.dataset.tipo === "fogo" || obj.dataset.tipo === "fumaca") {
                    if (!obj.dataset.hit) {
                        obj.dataset.hit = "true";
                        vidas--;
                        atualizarHUD();
                        if (vidas <= 0) {
                            jogoRodando = false;
                            clearInterval(intervaloObjetos);
                            cancelAnimationFrame(animacao);
                            alert("❌ Você perdeu todas as vidas! A página vai recarregar.");
                            location.reload();
                        }
                    }
                    obj.remove();
                }
            }
        });
        requestAnimationFrame(loop);
    }

    function iniciarFaseAbelha() {
        faseAbelha.classList.add("ativa");
        jogoRodando = true;
        floresColetadas = 0;
        vidas = 3;
        velocidade = 2.8;
        acelerou = false;
        abelhaY = window.innerHeight / 2 - 50;
        if (abelhaElement) {
            abelhaElement.style.top = abelhaY + "px";
            abelhaElement.style.left = ABELHA_X + "px";
        }
        atualizarHUD();
        if (intervaloObjetos) clearInterval(intervaloObjetos);
        intervaloObjetos = setInterval(criarObjeto, 2000);
        if (animacao) cancelAnimationFrame(animacao);
        animacao = requestAnimationFrame(loop);
    }

    // =============================================
    // COMPOSTAGEM (drag & drop com recriação de itens)
    // =============================================
    const telaCompostagem = document.getElementById("compostagemTela");
    const contadorComp = document.getElementById("contadorCompostagem");
    let acertosComp = 0;

    function iniciarCompostagem() {
        telaCompostagem.classList.add("ativa");
        acertosComp = 0;
        contadorComp.innerText = "Acertos: 0 / 4";

        // Recria os itens para garantir eventos novos
        const container = document.getElementById("itensCompostagem");
        container.innerHTML = `
            <img src="melancia.png" class="item" data-correto="true" draggable="true" style="width:100px; margin:5px; cursor:grab;">
            <img src="banana.png" class="item" data-correto="true" draggable="true" style="width:100px; margin:5px; cursor:grab;">
            <img src="maca.png" class="item" data-correto="true" draggable="true" style="width:100px; margin:5px; cursor:grab;">
            <img src="ovo.png" class="item" data-correto="true" draggable="true" style="width:100px; margin:5px; cursor:grab;">
            <img src="lata.png" class="item" data-correto="false" draggable="true" style="width:100px; margin:5px; cursor:grab;">
            <img src="metal.png" class="item" data-correto="false" draggable="true" style="width:100px; margin:5px; cursor:grab;">
        `;
        const itens = document.querySelectorAll("#itensCompostagem .item");
        itens.forEach(item => {
            item.addEventListener("dragstart", e => {
                e.dataTransfer.setData("text/plain", e.target.src);
            });
        });

        const composteira = document.getElementById("composteira");
        const novaComp = composteira.cloneNode(true);
        composteira.parentNode.replaceChild(novaComp, composteira);
        const compFinal = document.getElementById("composteira");
        compFinal.addEventListener("dragover", e => e.preventDefault());
        compFinal.addEventListener("drop", e => {
            e.preventDefault();
            const src = e.dataTransfer.getData("text/plain");
            const item = Array.from(itens).find(i => i.src === src);
            if (!item) return;
            const isCorreto = item.getAttribute("data-correto") === "true";
            if (isCorreto) {
                acertosComp++;
                contadorComp.innerText = `Acertos: ${acertosComp} / 4`;
                item.style.display = "none";
                if (acertosComp >= 4) {
                    alert(`Parabéns ${nomeJogador}! Você produziu adubo natural!`);
                    telaCompostagem.classList.remove("ativa");
                    iniciarDialogosPlantio();
                }
            } else {
                alert("❌ Esse material NÃO deve ir para a composteira!");
            }
        });
    }

    // =============================================
    // PLANTIO (todas as sementes com clique funcional)
    // =============================================
    const telaPlantio = document.getElementById("plantioTela");
    const regador = document.getElementById("regador");
    const seta = document.getElementById("setaRegador");
    const plantinha = document.getElementById("plantinha");
    const areaPlantio = document.getElementById("areaPlantio");
    let sementeEscolhida = "";

    function iniciarPlantioFase() {
        telaPlantio.classList.add("ativa");

        // Recria as sementes (evita eventos antigos)
        const containerSementes = document.getElementById("sementes");
        containerSementes.innerHTML = `
            <img src="sementemilho.png" class="semente" data-semente="milho" style="width:130px; margin:10px; cursor:pointer;">
            <img src="sementetomate.png" class="semente" data-semente="tomate" style="width:130px; margin:10px; cursor:pointer;">
            <img src="sementesoja.png" class="semente" data-semente="soja" style="width:130px; margin:10px; cursor:pointer;">
        `;
        const sementes = document.querySelectorAll(".semente");
        regador.style.display = "none";
        plantinha.style.display = "none";
        seta.style.display = "none";
        sementeEscolhida = "";
        const plantaExistente = document.getElementById("plantaFinal");
        if (plantaExistente) plantaExistente.remove();

        sementes.forEach(s => {
            s.addEventListener("click", () => {
                if (sementeEscolhida) return;
                sementeEscolhida = s.dataset.semente;
                alert(`🌱 Você escolheu ${sementeEscolhida}! Agora regue a planta.`);
                sementes.forEach(s2 => s2.style.display = "none");
                s.style.display = "block";
                regador.style.display = "block";
                seta.style.display = "block";

                // Recria o regador para evento único
                const novoRegador = regador.cloneNode(true);
                regador.parentNode.replaceChild(novoRegador, regador);
                const regadorFinal = document.getElementById("regador");
                regadorFinal.addEventListener("click", () => {
                    if (!sementeEscolhida) return;
                    regadorFinal.style.display = "none";
                    seta.style.display = "none";
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
                    telaPlantio.classList.remove("ativa");
                    mostrarTelaFinal();
                }, 1000);
            }
        }, 100);
    }

    function mostrarTelaFinal() {
        const telaFinal = document.getElementById("telaFinal");
        const msgFinal = document.getElementById("mensagemFinal");
        telaFinal.classList.add("ativa");
        msgFinal.innerHTML = `Parabéns, <strong>${nomeJogador}</strong>!<br><br>
        Você ajudou as abelhas, fez compostagem, plantou uma semente e cuidou da sua planta até ela crescer.<br><br>
        Muito obrigada pela sua ajuda!<br><br>
        Agora você é um verdadeiro <strong>AgroHerói do Futuro Sustentável</strong>.<br><br>
        Agro Forte, Futuro Sustentável: equilíbrio entre produção e meio ambiente.<br><br>
        Desenvolvido pelo aluno Matheus – 2º D Noturno<br>
        Colégio Estadual Antonio Tortato<br>
        Professora Patrícia Ferro`;
    }

    // =============================================
    // DIÁLOGOS DE TRANSIÇÃO (compostagem e plantio)
    // =============================================
    const transicaoCompostagem = document.getElementById("transicaoCompostagem");
    const textoCompostagem = document.getElementById("textoCompostagem");
    const btnProxCompFala = document.getElementById("btnProxFalaCompostagem");
    const btnIniciarComp = document.getElementById("btnIniciarCompostagem");
    const falasComp = [
        "Muito bem, [NOME]!\n\nAgora vamos aprender sobre a compostagem.\nA compostagem transforma restos de alimentos e folhas em adubo natural.",
        "Sua missão: arraste os materiais corretos para a composteira.\n✅ Pode colocar: cascas de frutas, cascas de legumes, folhas secas.",
        "❌ Não pode colocar: plástico, vidro, latas.\nSepare os resíduos corretamente.",
        "Clique em COMEÇAR para iniciar."
    ];
    let falaCompIdx = 0;

    function iniciarDialogosCompostagem() {
        transicaoCompostagem.classList.add("ativa");
        falaCompIdx = 0;
        mostrarFalaComp();
        btnProxCompFala.style.display = "block";
        btnIniciarComp.style.display = "none";
    }

    function mostrarFalaComp() {
        let txt = falasComp[falaCompIdx].replace("[NOME]", nomeJogador);
        textoCompostagem.innerText = txt;
        if (falaCompIdx === falasComp.length - 1) {
            btnProxCompFala.style.display = "none";
            btnIniciarComp.style.display = "block";
        } else {
            btnProxCompFala.style.display = "block";
            btnIniciarComp.style.display = "none";
        }
    }

    btnProxCompFala.addEventListener("click", () => {
        if (falaCompIdx < falasComp.length - 1) {
            falaCompIdx++;
            mostrarFalaComp();
        }
    });
    btnIniciarComp.addEventListener("click", () => {
        transicaoCompostagem.classList.remove("ativa");
        iniciarCompostagem();
    });

    // Diálogos do plantio
    const transicaoPlantio = document.getElementById("transicaoPlantio");
    const textoPlantio = document.getElementById("textoPlantio");
    const btnProxPlantioFala = document.getElementById("btnProxFalaPlantio");
    const btnIniciarPlantio = document.getElementById("btnIniciarPlantio");
    const falasPlantio = [
        "Parabéns, [NOME]! Você separou os resíduos corretamente e produziu adubo natural.",
        "Agora o solo está preparado! Lembra das abelhas? Elas ajudam as plantas a produzir frutos.",
        "Sua próxima missão: escolha uma semente para plantar: Milho, Tomate ou Soja.",
        "Depois regue sua plantinha. Clique em COMEÇAR."
    ];
    let falaPlantioIdx = 0;

    function iniciarDialogosPlantio() {
        transicaoPlantio.classList.add("ativa");
        falaPlantioIdx = 0;
        mostrarFalaPlantio();
        btnProxPlantioFala.style.display = "block";
        btnIniciarPlantio.style.display = "none";
    }

    function mostrarFalaPlantio() {
        let txt = falasPlantio[falaPlantioIdx].replace("[NOME]", nomeJogador);
        textoPlantio.innerText = txt;
        if (falaPlantioIdx === falasPlantio.length - 1) {
            btnProxPlantioFala.style.display = "none";
            btnIniciarPlantio.style.display = "block";
        } else {
            btnProxPlantioFala.style.display = "block";
            btnIniciarPlantio.style.display = "none";
        }
    }

    btnProxPlantioFala.addEventListener("click", () => {
        if (falaPlantioIdx < falasPlantio.length - 1) {
            falaPlantioIdx++;
            mostrarFalaPlantio();
        }
    });
    btnIniciarPlantio.addEventListener("click", () => {
        transicaoPlantio.classList.remove("ativa");
        iniciarPlantioFase();
    });

    // Botão para ir da fase abelha para os diálogos da compostagem
    const btnProxComp = document.getElementById("btnProxCompostagem");
    btnProxComp?.addEventListener("click", () => {
        telaSucesso.classList.remove("ativa");
        iniciarDialogosCompostagem();
    });

    // =============================================
    // CERTIFICADO E PDF
    // =============================================
    const btnCert = document.getElementById("btnCertificado");
    const certTela = document.getElementById("certificadoTela");
    const nomeCert = document.getElementById("nomeCertificado");
    btnCert?.addEventListener("click", () => {
        document.getElementById("telaFinal").classList.remove("ativa");
        certTela.classList.add("ativa");
        nomeCert.innerText = nomeJogador;
    });

    const btnPDF = document.getElementById("baixarPDF");
    btnPDF?.addEventListener("click", () => {
        const conteudo = `<html><head><title>Certificado</title><style>body{font-family:Arial;text-align:center;padding:40px}.cert{border:10px solid #2f9e44;background:white;padding:40px;margin:auto;border-radius:20px}</style></head><body><div class="cert"><h1>CERTIFICADO DE AGROHERÓI</h1><p>A equipe dos AgroHeróis certifica que</p><h2>${nomeJogador}</h2><p>concluiu com sucesso todas as missões do projeto<br>Agro Forte, Futuro Sustentável</p><ul><li>Polinização</li><li>Compostagem</li><li>Plantio</li><li>Sustentabilidade</li></ul><h3>AGROHERÓI DO FUTURO SUSTENTÁVEL</h3><p>Adelita – AgroHeróis</p></div></body></html>`;
        const win = window.open();
        win.document.write(conteudo);
        win.document.close();
        win.print();
    });

    console.log("✅ Jogo 100% funcional – abelha a 40%, perda de vida única, todas as sementes plantam.");
});
