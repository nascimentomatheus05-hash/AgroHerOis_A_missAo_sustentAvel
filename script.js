document.addEventListener("DOMContentLoaded", function() {
    // =============================================
    // CONTROLE DE MÚSICA
    // =============================================
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
                }).catch(err => alert("Erro ao tocar música: " + err));
            }
        });
    }

    // =============================================
    // FALLBACK DA ABELHA
    // =============================================
    const abelhaImg = document.getElementById('abelha');
    let abelhaElement = abelhaImg;
    if (abelhaImg) {
        abelhaImg.onerror = function() {
            const emojiBee = document.createElement('div');
            emojiBee.id = 'abelha-emoji';
            emojiBee.textContent = '🐝';
            emojiBee.style.cssText = 'position:absolute; font-size:80px; z-index:15; animation:flutuar 0.3s infinite alternate; pointer-events:none;';
            emojiBee.style.left = abelhaImg.style.left || (window.innerWidth * 0.15) + 'px';
            emojiBee.style.top = abelhaImg.style.top || (window.innerHeight / 2 - 50) + 'px';
            abelhaImg.style.display = 'none';
            abelhaImg.parentNode.appendChild(emojiBee);
            abelhaElement = emojiBee;
            window.abelhaElement = emojiBee;
        };
        abelhaImg.onload = () => { window.abelhaElement = abelhaImg; abelhaElement = abelhaImg; };
        if (abelhaImg.complete) window.abelhaElement = abelhaImg;
    }

    // Remove fundo branco
    document.querySelectorAll('.adelita, .adelita-final').forEach(el => el.style.mixBlendMode = 'multiply');

    // =============================================
    // TRANSIÇÃO INICIAL
    // =============================================
    const telaInicial = document.getElementById("telaInicial");
    const introducao = document.getElementById("introducao");
    const btnComecar = document.getElementById("btnComecar");
    if (btnComecar && telaInicial && introducao) {
        btnComecar.addEventListener("click", () => {
            telaInicial.classList.remove("ativa");
            introducao.classList.add("ativa");
            mostrarFala();
        });
    }

    // =============================================
    // DIÁLOGOS
    // =============================================
    let nomeJogador = "", personagemEscolhido = "", falaAtual = 0;
    const falas = [
        "Olá! Eu sou a Adelita e faço parte dos AgroHeróis!\n\nQual é o seu nome?",
        "Que nome lindo, [NOME]!\n\nHoje você vai participar de uma missão muito importante.\n\nEscolha seu personagem.",
        "UAL!!!\n\nO tema da nossa aventura é:\n\nAgro Forte, Futuro Sustentável:\nEquilíbrio entre Produção e Meio Ambiente.",
        "Para produzir alimentos e cuidar da natureza ao mesmo tempo, precisamos da ajuda de muitos seres vivos.\n\nUm dos mais importantes é a abelha.",
        "As abelhas realizam a polinização... (texto completo como antes)"
    ];
    // Para economizar espaço, mantenha o array completo do seu código original, pois ele está correto.
    // Vou assumir que você já tem as falas completas. Se precisar, copie do script anterior.

    const textoDialogo = document.getElementById("textoDialogo");
    const entradaNomeDiv = document.getElementById("entradaNome");
    const escolhaPersonagemDiv = document.getElementById("escolhaPersonagem");
    const nomeInput = document.getElementById("nomeJogador");
    const btnProximo = document.getElementById("btnProximo");
    const menina = document.getElementById("menina");
    const menino = document.getElementById("menino");

    function mostrarFala() { /* mesma função anterior */ }
    btnProximo.addEventListener("click", function() { /* mesmo código anterior */ });
    menina.addEventListener("click", () => { personagemEscolhido = "menina"; menina.style.border = "4px solid green"; menino.style.border = "none"; });
    menino.addEventListener("click", () => { personagemEscolhido = "menino"; menino.style.border = "4px solid green"; menina.style.border = "none"; });

    // =============================================
    // FASE ABELHA (mesmo código funcional anterior)
    // =============================================
    // ... (mantenha todo o código da fase abelha, compostagem e plantio como estava, mas com a correção abaixo)
    // =============================================
    // CORREÇÃO PARA O PLANTIO: garantir que todas as sementes funcionem
    // =============================================
    function iniciarPlantioFase() {
        plantioTela.classList.add("ativa");
        // Garantir que todas as sementes apareçam e estejam limpas
        sementes.forEach(s => {
            s.style.display = "block";
            // Remove eventos antigos para evitar duplicação
            const novoElemento = s.cloneNode(true);
            s.parentNode.replaceChild(novoElemento, s);
        });
        // Reatribuir a lista de sementes
        const novasSementes = document.querySelectorAll(".semente");
        regador.style.display = "none";
        plantinha.style.display = "none";
        setaRegador.style.display = "none";
        sementeEscolhida = "";
        const plantaExistente = document.getElementById("plantaFinal");
        if (plantaExistente) plantaExistente.remove();

        novasSementes.forEach(semente => {
            semente.addEventListener("click", function selecionar(e) {
                e.stopPropagation();
                if (sementeEscolhida) return;
                sementeEscolhida = this.dataset.semente;
                novasSementes.forEach(s => s.style.display = "none");
                this.style.display = "block";
                alert(`🌱 Você escolheu ${sementeEscolhida}! Agora regue a planta.`);
                regador.style.display = "block";
                setaRegador.style.display = "block";
                // Remove listener antigo do regador e adiciona novo
                const novoRegador = regador.cloneNode(true);
                regador.parentNode.replaceChild(novoRegador, regador);
                window.regador = novoRegador;
                novoRegador.addEventListener("click", function regar() {
                    if (!sementeEscolhida) return;
                    novoRegador.style.display = "none";
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

    // =============================================
    // O restante do código (compostagem, certificado) permanece igual ao anterior
    // =============================================
});
