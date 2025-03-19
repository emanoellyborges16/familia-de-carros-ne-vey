class Garagem {
    constructor() {
        this.veiculos = {
            carro: {
                objeto: new Carro("Gol", "Vermelho"),
                imagem2: ""
            },
            carroEsportivo: {
                objeto: new CarroEsportivo("Ferrari", "Amarelo"),
                imagem2: ""
            },
            caminhao: {
                objeto: new Caminhao("Scania", "Azul", 10000),
                imagem2: ""
            }
        };
        this.veiculoSelecionado = null;
    }

    selecionarVeiculo(tipo) {
        const imagem2Id = `imagem${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`; // Constrói o ID dinamicamente (imagemCarro, imagemCarroEsportivo, imagemCaminhao)
        const imagem2Url = document.getElementById(imagem2Id).value;

        if (this.veiculos[tipo]) {
            this.veiculoSelecionado = this.veiculos[tipo].objeto;
            this.veiculos[tipo].imagem2 = imagem2Url;
            console.log(`Veículo selecionado: ${tipo}`);
            this.exibirInformacoes();
        } else {
            console.log("Veículo não encontrado.");
            this.veiculoSelecionado = null;
            this.exibirInformacoes();
        }
    }


    interagir(acao) {
        if (!this.veiculoSelecionado) {
            console.log("Nenhum veículo selecionado.");
            return;
        }

        switch (acao) {
            case "ligar":
                this.veiculoSelecionado.ligar();
                break;
            case "desligar":
                this.veiculoSelecionado.desligar();
                break;
            case "acelerar":
                this.veiculoSelecionado.acelerar(10);
                break;
            case "frear":
                this.veiculoSelecionado.frear(5);
                break;
            case "ativarTurbo":
                if (this.veiculoSelecionado instanceof CarroEsportivo) {
                    this.veiculoSelecionado.ativarTurbo();
                } else {
                    console.log("Esta ação não está disponível para este veículo.");
                }
                break;
            case "desativarTurbo":
                if (this.veiculoSelecionado instanceof CarroEsportivo) {
                    this.veiculoSelecionado.desativarTurbo();
                } else {
                    console.log("Esta ação não está disponível para este veículo.");
                }
                break;
            case "carregar":
                if (this.veiculoSelecionado instanceof Caminhao) {
                    this.veiculoSelecionado.carregar(2000);
                } else {
                    console.log("Esta ação não está disponível para este veículo.");
                }
                break;
            case "descarregar":
                if (this.veiculoSelecionado instanceof Caminhao) {
                    this.veiculoSelecionado.descarregar(1000);
                } else {
                    console.log("Esta ação não está disponível para este veículo.");
                }
                break;
            default:
                console.log("Ação inválida.");
        }
        this.exibirInformacoes(); //Atualiza informações sempre que interagir
    }

    exibirInformacoes() {
        const informacoesVeiculoDiv = document.getElementById("informacoesVeiculo");
        if (this.veiculoSelecionado) {
            const tipoVeiculo = Object.keys(this.veiculos).find(key => this.veiculos[key].objeto === this.veiculoSelecionado);
            const imagem2Url = this.veiculos[tipoVeiculo].imagem2;

            let imagensHTML = `<img src="img/${tipoVeiculo}.jpg" alt="${tipoVeiculo}" width="150">`; // Imagem padrão
            if (imagem2Url) {
                imagensHTML += `<img src="${imagem2Url}" alt="${tipoVeiculo} 2" width="150">`; // Segunda imagem, se fornecida
            }

            informacoesVeiculoDiv.innerHTML = `${imagensHTML}<p>${this.veiculoSelecionado.exibirInformacoes()}</p>`;
        } else {
            informacoesVeiculoDiv.textContent = "Nenhum veículo selecionado.";
        }
    }
}