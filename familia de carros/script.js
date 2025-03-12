// Classes (cole o código das classes Carro, CarroEsportivo e Caminhao aqui)
class Carro {
    constructor(modelo, cor) {
      this.modelo = modelo;
      this.cor = cor;
      this.ligado = false;
      this.velocidade = 0;
    }
  
    ligar() {
      this.ligado = true;
      atualizarInfoCarroEsportivo();
      atualizarInfoCaminhao();
      console.log(`${this.modelo} ligado.`);
    }
  
    desligar() {
      this.ligado = false;
      this.velocidade = 0;
      atualizarInfoCarroEsportivo();
      atualizarInfoCaminhao();
      console.log(`${this.modelo} desligado.`);
    }
  
    acelerar(incremento) {
      if (this.ligado) {
        this.velocidade += incremento;
        atualizarInfoCarroEsportivo();
        atualizarInfoCaminhao();
        console.log(`${this.modelo} acelerando. Velocidade: ${this.velocidade}`);
      } else {
        console.log("Ligue o carro primeiro!");
      }
    }
  
    frear(decremento) {
      this.velocidade -= decremento;
      if (this.velocidade < 0) {
        this.velocidade = 0;
      }
      atualizarInfoCarroEsportivo();
      atualizarInfoCaminhao();
      console.log(`${this.modelo} freando. Velocidade: ${this.velocidade}`);
    }
  }
  
  class CarroEsportivo extends Carro {
    constructor(modelo, cor) {
      // Chama o construtor da classe pai (Carro)
      super(modelo, cor);
      this.turboAtivado = false;
    }
  
    ativarTurbo() {
      if (this.ligado) {
        this.turboAtivado = true;
        this.acelerar(50); // Acelera mais rápido com o turbo
        atualizarInfoCarroEsportivo();
        console.log("Turbo ativado!");
      } else {
        console.log("Ligue o carro para usar o turbo!");
      }
    }
  }
  
  class Caminhao extends Carro {
    constructor(modelo, cor, capacidadeCarga) {
      // Chama o construtor da classe pai (Carro)
      super(modelo, cor);
      this.capacidadeCarga = capacidadeCarga;
      this.cargaAtual = 0;
    }
  
    carregar(peso) {
      if (this.cargaAtual + peso <= this.capacidadeCarga) {
        this.cargaAtual += peso;
        atualizarInfoCaminhao();
        console.log(`Caminhão carregado. Carga atual: ${this.cargaAtual} kg`);
      } else {
        console.log("Carga excede a capacidade!");
      }
    }
  
    descarregar(peso) {
      this.cargaAtual -= peso;
      if (this.cargaAtual < 0) {
        this.cargaAtual = 0;
      }
      atualizarInfoCaminhao();
      console.log(`Caminhão descarregado. Carga atual: ${this.cargaAtual} kg`);
    }
  }
  
  // Variáveis para armazenar os objetos
  let carroEsportivo;
  let caminhao;
  
  // Funções para criar os objetos
  function criarCarroEsportivo() {
    const modelo = document.getElementById("modeloEsportivo").value;
    const cor = document.getElementById("corEsportivo").value;
    carroEsportivo = new CarroEsportivo(modelo, cor);
    atualizarInfoCarroEsportivo();
  }
  
  function criarCaminhao() {
    const modelo = document.getElementById("modeloCaminhao").value;
    const cor = document.getElementById("corCaminhao").value;
    const capacidadeCarga = parseInt(document.getElementById("capacidadeCaminhao").value);
    caminhao = new Caminhao(modelo, cor, capacidadeCarga);
    atualizarInfoCaminhao();
  }
  
  // Funções para interagir com o Carro Esportivo
  function ligarCarroEsportivo() {
    if (carroEsportivo) {
      carroEsportivo.ligar();
    } else {
      alert("Crie o carro esportivo primeiro!");
    }
  }
  
  function desligarCarroEsportivo() {
    if (carroEsportivo) {
      carroEsportivo.desligar();
    } else {
      alert("Crie o carro esportivo primeiro!");
    }
  }
  
  function acelerarCarroEsportivo() {
    if (carroEsportivo) {
      carroEsportivo.acelerar(10);
    } else {
      alert("Crie o carro esportivo primeiro!");
    }
  }
  
  function ativarTurbo() {
      if (carroEsportivo) {
        carroEsportivo.ativarTurbo();
      } else {
        alert("Crie o carro esportivo primeiro!");
      }
    }
  
  // Funções para interagir com o Caminhão
  function ligarCaminhao() {
    if (caminhao) {
      caminhao.ligar();
    } else {
      alert("Crie o caminhão primeiro!");
    }
  }
  
  function desligarCaminhao() {
    if (caminhao) {
      caminhao.desligar();
    } else {
      alert("Crie o caminhão primeiro!");
    }
  }
  
  function acelerarCaminhao() {
    if (caminhao) {
      caminhao.acelerar(5);
    } else {
      alert("Crie o caminhão primeiro!");
    }
  }
  
  function carregarCaminhao() {
    if (caminhao) {
      const peso = parseInt(document.getElementById("pesoCarga").value);
      caminhao.carregar(peso);
    } else {
      alert("Crie o caminhão primeiro!");
    }
  }
  
  function descarregarCaminhao() {
    if (caminhao) {
      const peso = parseInt(document.getElementById("pesoCarga").value);
      caminhao.descarregar(peso);
    } else {
      alert("Crie o caminhão primeiro!");
    }
  }
  
  // Funções para exibir informações
  function atualizarInfoCarroEsportivo() {
    const infoElement = document.getElementById("infoCarroEsportivo");
    if (carroEsportivo) {
      infoElement.textContent = `Modelo: ${carroEsportivo.modelo}, Cor: ${carroEsportivo.cor}, Ligado: ${carroEsportivo.ligado}, Velocidade: ${carroEsportivo.velocidade}, Turbo: ${carroEsportivo.turboAtivado}`;
    } else {
      infoElement.textContent = "Crie o carro esportivo primeiro!";
    }
  }
  
  function atualizarInfoCaminhao() {
    const infoElement = document.getElementById("infoCaminhao");
    if (caminhao) {
      infoElement.textContent = `Modelo: ${caminhao.modelo}, Cor: ${caminhao.cor}, Ligado: ${caminhao.ligado}, Velocidade: ${caminhao.velocidade}, Carga: ${caminhao.cargaAtual}/${caminhao.capacidadeCarga}`;
    } else {
      infoElement.textContent = "Crie o caminhão primeiro!";
    }
  }