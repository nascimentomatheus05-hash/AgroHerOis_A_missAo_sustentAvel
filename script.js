// ============================================================
// AGROHERÓIS - JOGO COMPLETO (FUNCIONAL 100%)
// ============================================================

document.addEventListener("DOMContentLoaded", function() {
    console.log("🚀 AgroHeróis iniciado");

    // ---------- MÚSICA ----------
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
                audio.play().catch(e => console.log("Áudio: interação necessária"));
                botaoMusica.textContent = "🔊";
            }
            musicaTocando = !musicaTocando;
        });
    }

    // ---------- ABELHA (posição 40% da largura) ----------
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

    // ---------- TELA INICIAL → INTRODUÇÃO ----------
    const telaInicial = document.getElementById("telaInicial");
    const introducao = document.getElementById("introducao");
    const btnComecar = document.getElementById("btnComecar");
    btnComecar?.addEventListener("click", () => {
        telaInicial.classList.remove("ativa");
        introducao.classList.add("ativa");
        mostrarFala();
    });

    // ---------- DIÁLOGOS (12 falas) ----------
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

    // ---------- FASE ABELHA (com data-hit para evitar múltiplas perdas) ----------
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
                } else {
                    // Só perde vida se este obstáculo ainda não tiver sido atingido
                    if (!obj.dataset.hit) {
                        obj.dataset.hit = "true";
                        vidas--;
                        atualizarHUD();
                        if (vidas <= 0) {
                            jogoRodando = false;
                            clearInterval(intervaloObjetos);
                            cancelAnimationFrame(animacao);
                            alert("❌ Você perdeu todas as vidas! O jogo vai reiniciar.");
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

    // Botão para ir à compostagem
    const btnProxComp = document.getElementById("btnProxCompostagem");
    btnProxComp?.addEventListener("click", () => {
        telaSucesso.classList.remove("ativa");
        iniciarCompostagem();
    });

    // ---------- COMPOSTAGEM (drag & drop funcional) ----------
    const telaCompostagem = document.getElementById("compostagemTela");
    const contadorComp = document.getElementById("contadorCompostagem");
    let acertosComp = 0;

    function iniciarCompostagem() {
        telaCompostagem.classList.add("ativa");
        acertosComp = 0;
        contadorComp.innerText = "Acertos: 0 / 4";

        // Recriar itens para garantir eventos novos
        const itensOriginais = document.querySelectorAll("#itensCompostagem .item");
        itensOriginais.forEach(item => item.remove());
        const novosItens = [
            { src: "melancia.png", correto: true },
            { src: "banana.png", correto: true },
            { src: "maca.png", correto: true },
            { src: "ovo.png", correto: true },
            { src: "lata.png", correto: false },
            { src: "metal.png", correto: false }
        ];
        const container = document.getElementById("itensCompostagem");
        novosItens.forEach(i => {
            const img = document.createElement("img");
            img.src = i.src;
            img.className = "item";
            img.setAttribute("data-correto", i.correto);
            img.style.width = "100px";
            img.style.margin = "5px";
            img.style.cursor = "grab";
            container.appendChild(img);
        });

        const itens = document.querySelectorAll("#itensCompostagem .item");
        itens.forEach(item => {
            item.setAttribute("draggable", "true");
            item.addEventListener("dragstart", e => {
                e.dataTransfer.setData("text/plain", e.target.src);
            });
        });

        const composteira = document.getElementById("composteira");
        composteira.addEventListener("dragover", e => e.preventDefault());
        composteira.addEventListener("drop", e => {
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
                    iniciarPlantio();
                }
            } else {
                alert("❌ Esse material NÃO deve ir para a composteira!");
            }
        });
    }

    // ---------- PLANTIO (todas as sementes funcionam) ----------
    const telaPlantio = document.getElementById("plantioTela");
    const regador = document.getElementById("regador");
    const seta = document.getElementById("setaRegador");
    const plantinha = document.getElementById("plantinha");
    const areaPlantio = document.getElementById("areaPlantio");

    function iniciarPlantio() {
        telaPlantio.classList.add("ativa");
        // Recriar sementes completamente para evitar eventos antigos
        const containerSementes = document.getElementById("sementes");
        const sementesOriginais = document.querySelectorAll(".semente");
        sementesOriginais.forEach(s => s.remove());
        const sementesLista = [
            { tipo: "milho", src: "sementemilho.png" },
            { tipo: "tomate", src: "sementetomate.png" },
            { tipo: "soja", src: "sementesoja.png" }
        ];
        sementesLista.forEach(s => {
            const img = document.createElement("img");
            img.src = s.src;
            img.className = "semente";
            img.dataset.semente = s.tipo;
            img.style.width = "130px";
            img.style.margin = "10px";
            img.style.cursor = "pointer";
            containerSementes.appendChild(img);
        });
        const sementes = document.querySelectorAll(".semente");
        let sementeEscolhida = "";

        regador.style.display = "none";
        plantinha.style.display = "none";
        seta.style.display = "none";
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
                // Recriar regador para evento único
                const novoRegador = regador.cloneNode(true);
                regador.parentNode.replaceChild(novoRegador, regador);
                const regadorFinal = document.getElementById("regador");
                regadorFinal.addEventListener("click", function regar() {
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

    // ---------- CERTIFICADO E PDF ----------
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

    // ---------- TRANSIÇÃO DOS DIÁLOGOS DO PLANTIO ----------
    const transicaoPlantio = document.getElementById("transicaoPlantio");
    const textoPlantio = document.getElementById("textoPlantio");
    const btnProxPlantio = document.getElementById("btnProxFalaPlantio");
    const btnIniciarPlantio = document.getElementById("btnIniciarPlantio");
    let falaPlantioAtual = 0;
    const falasPlantio = [
        "Parabéns, [NOME]! Você separou os resíduos corretamente e produziu adubo natural.",
        "Agora o solo está preparado! Lembra das abelhas? Elas ajudam as plantas a produzir frutos.",
        "Sua próxima missão: escolha uma semente para plantar: Milho, Tomate ou Soja.",
        "Depois regue sua plantinha. Clique em COMEÇAR."
    ];
    function mostrarFalaPlantio() {
        let txt = falasPlantio[falaPlantioAtual].replace("[NOME]", nomeJogador);
        textoPlantio.innerText = txt;
        if (falaPlantioAtual === falasPlantio.length - 1) {
            btnProxPlantio.style.display = "none";
            btnIniciarPlantio.style.display = "block";
        } else {
            btnProxPlantio.style.display = "block";
            btnIniciarPlantio.style.display = "none";
        }
    }
    function iniciarDialogosPlantio() {
        transicaoPlantio.classList.add("ativa");
        falaPlantioAtual = 0;
        mostrarFalaPlantio();
    }
    btnProxPlantio?.addEventListener("click", () => {
        if (falaPlantioAtual < falasPlantio.length - 1) {
            falaPlantioAtual++;
            mostrarFalaPlantio();
        }
    });
    btnIniciarPlantio?.addEventListener("click", () => {
        transicaoPlantio.classList.remove("ativa");
        iniciarPlantio();
    });

    // Para chamar os diálogos do plantio após a compostagem
    window.iniciarDialogosPlantio = iniciarDialogosPlantio;

    console.log("✅ Jogo 100% funcional: abelha a 40%, perda de vida única, compostagem arrastável, todas as sementes plantam.");
});
