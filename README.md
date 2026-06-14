# 🌱 AgroHeróis: A missão sustentável

> Jogo educativo interativo que ensina sobre o equilíbrio entre produção agrícola e preservação ambiental.

![Tela inicial do jogo](3.png)

## 🎯 Sobre o Projeto

**AgroHeróis** é um jogo desenvolvido em **HTML5, CSS3 e JavaScript puro** (sem frameworks) para conscientizar crianças e adolescentes sobre a importância da **sustentabilidade no campo**. O jogador acompanha a personagem **Adelita** em três missões:

1. **Polinização** – Ajude uma abelha a coletar flores enquanto desvia de obstáculos (fogo e fumaça).
2. **Compostagem** – Separe os resíduos orgânicos corretamente, arrastando os itens para a composteira.
3. **Plantio** – Escolha uma semente (milho, tomate ou soja), regue a planta e acompanhe seu crescimento.

Ao final, o jogador recebe um **certificado personalizado** com seu nome, podendo baixá-lo em **PDF**.

---

## ✨ Funcionalidades

- ✅ **Sistema de diálogos** com a personagem Adelita
- ✅ Escolha de **nome** e **personagem** (menina/menino)
- ✅ **Fase da abelha** – movimentação com setas ↑ ↓, coleta de flores, vidas e pontuação
- ✅ **Fase da compostagem** – drag & drop de resíduos orgânicos (frutas, ovos) e rejeitos (lata, metal)
- ✅ **Fase do plantio** – escolha da semente, rega e crescimento animado
- ✅ **Certificado final** com nome do jogador e geração de PDF
- ✅ **Trilha sonora opcional** (arquivo `musica.mp3`) com botão liga/desliga 🔊/🎵
- ✅ **Logos animadas** na tela inicial com efeito de pulsar e brilho
- ✅ **Design responsivo** (funciona em telas de até 900px)
- ✅ **Fallback da abelha** – caso a imagem `a.png` não seja encontrada, um emoji 🐝 assume seu lugar
- ✅ **Remoção do fundo branco** da personagem principal via CSS (`mix-blend-mode`)

---

## 🕹️ Como Jogar

1. Na tela inicial, clique em **COMEÇAR**.
2. Digite seu nome e escolha seu personagem.
3. Avance pelos diálogos da Adelita até iniciar a missão.
4. **Fase 1 – Abelha:**  
   - Use as setas **↑ (cima)** e **↓ (baixo)** para mover a abelha.  
   - Colete flores (soja, milho ou flor) – cada flor vale 1 ponto.  
   - Evite fogo e fumaça – cada erro reduz uma vida.  
   - Ao coletar 10 flores, a fase é concluída.
5. **Fase 2 – Compostagem:**  
   - Arraste os itens corretos (melancia, banana, maçã, ovo) para dentro da composteira.  
   - Itens errados (lata, metal) exibem mensagem de erro.  
   - Após 4 acertos, o adubo natural é produzido.
6. **Fase 3 – Plantio:**  
   - Clique em uma das três sementes (milho, tomate ou soja).  
   - Clique no regador para regar a plantinha.  
   - Aguarde o crescimento animado da planta até o tamanho máximo.
7. Ao final, leia a mensagem da Adelita e clique em **VER CERTIFICADO**.
8. O certificado exibirá seu nome e os aprendizados. Clique em **BAIXAR CERTIFICADO (PDF)** para gerar o arquivo.

> 💡 **Dica:** Você pode ligar/desligar a música de fundo a qualquer momento clicando no botão flutuante 🎵 no canto inferior direito da tela.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** – estrutura das telas e elementos
- **CSS3** – estilização, animações, responsividade e layout flexível
- **JavaScript (ES6)** – lógica do jogo, diálogos, colisões, drag & drop, geração de PDF e controle de áudio
- **Web Audio API** – sons de coleta e erro (usando osciladores)
- **Git & GitHub Pages** – hospedagem e versionamento

---

## 📁 Estrutura de Arquivos
