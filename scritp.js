// Variáveis globais para armazenar os objetos (mantidas)
let carro = null;
let carroEsportivo = null;
let caminhao = null;

// --- Definição das Classes (Como na versão anterior, com métodos retornando true/false) ---

class Veiculo {
    constructor(modelo, cor, imagem) {
        this.modelo = modelo;
        this.cor = cor;
        this.ligado = false;
        this.imagem = imagem;
    }

    ligar() {
        if (!this.ligado) {
            this.ligado = true;
            console.log(`${this.modelo} ligado.`);
            return true; // Sucesso, estado mudou
        }
        console.log(`${this.modelo} já está ligado.`);
        return false; // Sem mudança
    }

    desligar() {
        const velocidadeAtual = this.velocidade !== undefined ? this.velocidade : 0;
        if (this.ligado) {
            if (velocidadeAtual === 0) {
                this.ligado = false;
                console.log(`${this.modelo} desligado.`);
                return true; // Sucesso
            } else {
                alert(`Não é possível desligar ${this.modelo} em movimento (Velocidade: ${velocidadeAtual} km/h).`);
                console.log(`Não é possível desligar ${this.modelo} em movimento.`);
                return false; // Falha
            }
        } else {
            console.log(`${this.modelo} já está desligado.`);
            return false; // Sem mudança
        }
    }

    buzinar() {
        console.log("Bi Bi!");
        alert(`(${this.constructor.name}) Bi Bi!`); // Indica o tipo
        return true; // Considera sucesso (ação realizada)
    }

    exibirInformacoes() {
        const statusLigado = this.ligado ? 'Ligado' : 'Desligado';
        return `--- Informações Básicas ---
Modelo: ${this.modelo}
Cor: ${this.cor}
Status: ${statusLigado}`;
    }
}

class Carro extends Veiculo {
    constructor(modelo, cor, imagem) {
        super(modelo, cor, imagem);
        this.velocidade = 0;
    }

    acelerar(incremento = 10) { // Valor padrão se não fornecido
         const incNum = Number(incremento);
         if (isNaN(incNum) || incNum <=0) { alert("Valor inválido para acelerar."); return false;}

        if (!this.ligado) {
            alert(`Ligue o ${this.modelo} antes de acelerar.`);
            console.log("O carro precisa estar ligado para acelerar.");
            return false;
        }
        const novaVelocidade = this.velocidade + incNum;
        if (novaVelocidade <= 180) {
             this.velocidade = novaVelocidade;
        } else {
            this.velocidade = 180;
            alert(`Velocidade máxima (180 km/h) atingida para ${this.modelo}.`);
        }
        console.log(`${this.modelo} acelerando para ${this.velocidade} km/h.`);
        return true; // Sucesso
    }

    frear(decremento = 10) { // Valor padrão
        const decNum = Number(decremento);
        if (isNaN(decNum) || decNum <=0) { alert("Valor inválido para frear."); return false;}

        if (this.velocidade > 0) {
            this.velocidade -= decNum;
            if (this.velocidade < 0) this.velocidade = 0;
            console.log(`${this.modelo} freando para ${this.velocidade} km/h.`);
            return true; // Sucesso
        } else {
            console.log("O carro já está parado.");
            return false; // Sem mudança
        }
    }

    buzinar() {
        console.log("Beep Beep!");
        alert(`(${this.constructor.name}) Beep Beep!`);
        return true;
    }

    exibirInformacoes() {
        const infoBase = super.exibirInformacoes();
        return `${infoBase}
Velocidade: ${this.velocidade} km/h`;
    }
}

class CarroEsportivo extends Carro {
    constructor(modelo, cor, imagem) {
        super(modelo, cor, imagem);
        this.turboAtivado = false;
    }

    acelerar(incrementoBase = 25) { // Valor padrão maior
        const incNum = Number(incrementoBase);
        if (isNaN(incNum) || incNum <=0) { alert("Valor inválido para acelerar."); return false;}

        if (!this.ligado) {
            alert(`Ligue o ${this.modelo} antes de acelerar.`);
            console.log("O carro precisa estar ligado para acelerar.");
            return false;
        }
        const incrementoReal = this.turboAtivado ? incNum * 1.8 : incNum;
        const novaVelocidade = this.velocidade + incrementoReal;
         if (novaVelocidade <= 350) {
             this.velocidade = novaVelocidade;
        } else {
            this.velocidade = 350;
            alert(`Velocidade máxima (350 km/h) atingida para ${this.modelo}.`);
        }
        console.log(`${this.modelo} acelerando para ${this.velocidade} km/h ${this.turboAtivado ? '(TURBO!)' : ''}`);
        return true; // Sucesso
    }

     frear(decremento = 15) { // Valor padrão maior
        const decNum = Number(decremento);
        if (isNaN(decNum) || decNum <=0) { alert("Valor inválido para frear."); return false;}
        return super.frear(decNum); // Reutiliza lógica do pai, mas com valor diferente
    }


    ativarTurbo() {
        if (!this.ligado) {
             alert("Ligue o carro antes de ativar o turbo.");
            console.log("Ligue o carro antes de ativar o turbo.");
            return false;
        }
        if (!this.turboAtivado) {
            this.turboAtivado = true;
            console.log("Turbo ativado!");
            return true; // Sucesso
        }
        console.log("Turbo já estava ativado.");
        return false; // Sem mudança
    }

    desativarTurbo() {
        if (this.turboAtivado) {
            this.turboAtivado = false;
            console.log("Turbo desativado!");
            return true; // Sucesso
        }
         console.log("Turbo já estava desativado.");
        return false; // Sem mudança
    }

    buzinar() {
        console.log("Vrooooooom!");
        alert(`(${this.constructor.name}) Vrooooooom!`);
        return true;
    }

    exibirInformacoes() {
        const infoBase = super.exibirInformacoes();
        const statusTurbo = this.turboAtivado ? 'Ativado' : 'Desativado';
        return `${infoBase}
--- Detalhes Esportivo ---
Turbo: ${statusTurbo}`;
    }
}

class Caminhao extends Carro {
    constructor(modelo, cor, capacidadeCarga, imagem) {
        super(modelo, cor, imagem);
        this.capacidadeCarga = Number(capacidadeCarga) || 0;
        this.cargaAtual = 0;
    }

    acelerar(incrementoBase = 5) { // Valor padrão menor
        const incNum = Number(incrementoBase);
        if (isNaN(incNum) || incNum <=0) { alert("Valor inválido para acelerar."); return false;}

        if (!this.ligado) {
            alert(`Ligue o ${this.modelo} antes de acelerar.`);
            console.log("O caminhão precisa estar ligado para acelerar.");
            return false;
        }
        const fatorCarga = 1 - (this.cargaAtual / (this.capacidadeCarga * 2));
        const incrementoReal = incNum * Math.max(0.3, fatorCarga);
         const novaVelocidade = this.velocidade + incrementoReal;

         if (novaVelocidade <= 120) {
             this.velocidade = novaVelocidade;
        } else {
            this.velocidade = 120;
            alert(`Velocidade máxima (120 km/h) atingida para ${this.modelo}.`);
        }
        console.log(`${this.modelo} acelerando para ${this.velocidade} km/h.`);
        return true; // Sucesso
    }

    frear(decremento = 5) { // Valor padrão menor
        const decNum = Number(decremento);
        if (isNaN(decNum) || decNum <=0) { alert("Valor inválido para frear."); return false;}
        return super.frear(decNum); // Reutiliza lógica do pai
    }

    carregar(peso) {
         const pesoNum = Number(peso);
         if (isNaN(pesoNum) || pesoNum <= 0) {
            alert("Peso inválido para carregar.");
            return false;
        }
        if (this.cargaAtual + pesoNum <= this.capacidadeCarga) {
            this.cargaAtual += pesoNum;
            console.log(`Caminhão carregado com ${pesoNum} kg. Carga atual: ${this.cargaAtual} kg.`);
            return true; // Sucesso
        } else {
             alert(`Capacidade máxima de carga (${this.capacidadeCarga} kg) excedida. Carga atual: ${this.cargaAtual} kg.`);
            console.log("Capacidade máxima de carga excedida.");
            return false; // Falha
        }
    }

    descarregar(peso) {
        const pesoNum = Number(peso);
         if (isNaN(pesoNum) || pesoNum <= 0) {
            alert("Peso inválido para descarregar.");
            return false;
        }
        const novaCarga = this.cargaAtual - pesoNum;
        if (novaCarga >= 0) {
            this.cargaAtual = novaCarga;
             console.log(`${this.modelo} descarregado ${pesoNum} kg. Carga atual: ${this.cargaAtual} kg.`);
             return true; // Sucesso
        } else {
            const descarregado = this.cargaAtual;
            this.cargaAtual = 0;
            alert(`Não é possível descarregar ${pesoNum} kg. Carga atual era ${descarregado} kg. Carga zerada.`);
            console.log(`Tentativa de descarregar ${pesoNum} kg, mas só havia ${descarregado} kg. Carga zerada.`);
            return true; // Considera sucesso parcial (estado mudou)
        }
    }

    buzinar() {
        console.log("Fom Fom!");
        alert(`(${this.constructor.name}) Fom Fom!`);
        return true;
    }

    exibirInformacoes() {
        const infoBase = super.exibirInformacoes();
        return `${infoBase}
--- Detalhes Caminhão ---
Capacidade Máxima: ${this.capacidadeCarga} kg
Carga Atual: ${this.cargaAtual} kg`;
    }
}


// --- Funções de Interação com HTML (Adaptadas) ---

const divInformacoes = document.getElementById('informacoesVeiculo');
// --- (Mantenha todas as classes Veiculo, Carro, CarroEsportivo, Caminhao como estão) ---
// --- (Mantenha as variáveis globais carro, carroEsportivo, caminhao) ---
// --- (Mantenha as funções criarCarro, criarCarroEsportivo, criarCaminhao) ---
// --- (Mantenha a função atualizarImagem) ---
// --- (Mantenha a função interagir) ---
// --- (Mantenha os Event Listeners dos botões btnInfo...) ---

// Seleciona a DIV central (como antes)
/**
 * Função ATUALIZADA para exibir informações (texto + imagem) na DIV central.
 * Usa innerHTML para renderizar a tag <img>.
 * @param {Veiculo | null} veiculo - O objeto veículo a ser exibido, ou null.
 */
function mostrarInformacoes(veiculo) {
    if (veiculo && typeof veiculo.exibirInformacoes === 'function' && typeof veiculo.imagem !== 'undefined') {
        // 1. Obter o texto formatado do método polimórfico
        const textoInfo = veiculo.exibirInformacoes();

        // 2. Obter a URL da imagem do objeto veículo
        const imageUrl = veiculo.imagem || 'placeholder.png'; // Usa um placeholder se a imagem for inválida/ausente

        // 3. Construir o HTML que inclui a imagem e o texto
        //    Usaremos um container flex para alinhar imagem e texto (opcional, mas melhora o layout)
        const htmlConteudo = `
            <div style="display: flex; align-items: flex-start; gap: 20px;">
                <div style="flex-shrink: 0;">
                    <img src="${imageUrl}"
                         alt="Imagem de ${veiculo.modelo}"
                         style="width: 150px; height: auto; border: 1px solid #ccc; border-radius: 5px; display: block;"
                         onerror="this.onerror=null; this.src='placeholder.png'; console.warn('Imagem não encontrada: ${imageUrl}');" >
                         /* onerror: evita loops de erro se o placeholder falhar e loga aviso */
                </div>
                <div style="flex-grow: 1;">
                    <pre style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 1em; line-height: 1.6;">${textoInfo}</pre>
                     /* Usar <pre> preserva as quebras de linha e espaços do textoInfo */
                </div>
            </div>
        `;

        // 4. Atualizar o innerHTML da div central
        divInformacoes.innerHTML = htmlConteudo;

    } else {
        // Mensagem padrão se o veículo não existir ou for inválido
        divInformacoes.innerHTML = '<p style="text-align: center; color: #777; margin-top: 20px;">Crie ou selecione um veículo para ver os detalhes aqui.</p>';
    }
}

// --- (Restante do seu script.js permanece igual) ---
function mostrarInformacoes(veiculo) {
    if (veiculo && typeof veiculo.exibirInformacoes === 'function') {
        const informacoes = veiculo.exibirInformacoes();
        divInformacoes.textContent = informacoes;
    } else {
        divInformacoes.textContent = 'Veículo não criado ou selecionado. Use o botão "Criar/Atualizar" primeiro.';
    }
}

function atualizarImagem(imgId, novaUrl) {
    const imgElement = document.getElementById(imgId);
    if (imgElement) {
        imgElement.src = novaUrl;
        imgElement.onerror = () => {
            console.warn(`Erro ao carregar imagem: ${novaUrl} para ${imgId}.`);
        };
    }
}

// --- FUNÇÃO GENÉRICA interagir() ---
function interagir(veiculo, acao, ...args) {
    // 1. Verificar se o veículo existe
    if (!veiculo) {
        alert("Por favor, crie o veículo correspondente primeiro!");
        console.warn(`Tentativa de interagir com veículo nulo. Ação: ${acao}`);
        return; // Interrompe a função
    }

    // 2. Verificar se a ação (método) existe no veículo
    if (typeof veiculo[acao] === 'function') {
        console.log(`Executando ação "${acao}" em ${veiculo.modelo}...`);
        try {
            // 3. Chamar o método dinamicamente usando bracket notation
            //    e passar os argumentos usando spread syntax (...)
            const sucesso = veiculo[acao](...args);

            // 4. Atualizar a exibição SE a ação foi bem-sucedida (ou se mudou o estado)
            //    Assumindo que métodos retornam 'true' em caso de sucesso/mudança
            if (sucesso) {
                mostrarInformacoes(veiculo); // Atualiza a div central
            }
        } catch (error) {
            // Captura erros inesperados durante a execução do método
            console.error(`Erro ao executar a ação "${acao}" em ${veiculo.modelo}:`, error);
            alert(`Ocorreu um erro ao tentar executar a ação: ${acao}. Verifique o console.`);
        }
    } else {
        // 5. Ação inválida para este veículo
        alert(`A ação "${acao}" não é válida para o veículo ${veiculo.modelo} (${veiculo.constructor.name}).`);
        console.warn(`Ação "${acao}" não encontrada ou não é uma função em ${veiculo.constructor.name}.`);
    }
}


// --- Funções de Criação (Mantidas) ---

function criarCarro() {
    const modelo = document.getElementById("modeloCarro").value;
    const cor = document.getElementById("corCarro").value;
    const imagemUrl = document.getElementById("imagemCarro").value || "OIP.jpg";
    carro = new Carro(modelo, cor, imagemUrl);
    atualizarImagem('imgCarro', carro.imagem);
    mostrarInformacoes(carro);
    console.log("Carro criado:", carro);
}

function criarCarroEsportivo() {
    const modelo = document.getElementById("modeloEsportivo").value;
    const cor = document.getElementById("corEsportivo").value;
    const imagemUrl = document.getElementById("imagemEsportivo").value || "OIP (1).jpg";
    carroEsportivo = new CarroEsportivo(modelo, cor, imagemUrl);
    atualizarImagem('imgEsportivo', carroEsportivo.imagem);
    mostrarInformacoes(carroEsportivo);
    console.log("Carro esportivo criado:", carroEsportivo);
}

function criarCaminhao() {
    const modelo = document.getElementById("modeloCaminhao").value;
    const cor = document.getElementById("corCaminhao").value;
    const capacidadeCarga = document.getElementById("capacidadeCarga").value;
    const imagemUrl = document.getElementById("imagemCaminhao").value || "oip2.jpg";
    caminhao = new Caminhao(modelo, cor, capacidadeCarga, imagemUrl);
    atualizarImagem('imgCaminhao', caminhao.imagem);
    mostrarInformacoes(caminhao);
    console.log("Caminhão criado:", caminhao);
}


// --- Event Listeners para os botões "Mostrar Info" (Mantidos) ---
document.getElementById('btnInfoCarro').addEventListener('click', () => {
    mostrarInformacoes(carro);
});
document.getElementById('btnInfoEsportivo').addEventListener('click', () => {
    mostrarInformacoes(carroEsportivo);
});
document.getElementById('btnInfoCaminhao').addEventListener('click', () => {
    mostrarInformacoes(caminhao);
});
// --- (Mantenha todas as classes Veiculo, Carro, CarroEsportivo, Caminhao como estão) ---
// --- (Mantenha as variáveis globais carro, carroEsportivo, caminhao) ---
// --- (Mantenha as funções criarCarro, criarCarroEsportivo, criarCaminhao) ---
// --- (Mantenha a função atualizarImagem) ---
// --- (Mantenha a função interagir) ---
// --- (Mantenha os Event Listeners dos botões btnInfo...) ---

// Seleciona a DIV central (como antes)

