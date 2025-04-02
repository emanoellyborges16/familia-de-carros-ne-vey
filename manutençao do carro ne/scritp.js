// script.js

// --- Definição das Classes ---

class Manutencao {
    constructor(data, tipo, custo = 0, descricao = '') {
        if (!this.validarData(data)) {
            throw new Error("Data inválida. Use o formato AAAA-MM-DD.");
        }
        if (!this.validarCusto(custo)) {
            throw new Error("Custo inválido. Deve ser um número não negativo.");
        }

        this.data = data; // Formato esperado: YYYY-MM-DD
        this.tipo = tipo.trim();
        this.custo = parseFloat(custo) || 0;
        this.descricao = descricao.trim();

        if (!this.tipo) {
            throw new Error("Tipo de serviço não pode ser vazio.");
        }
    }

    validarData(data) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(data)) return false;
        // Verifica se a data é realmente válida (ex: não é 31 de Fev)
        const [year, month, day] = data.split('-').map(Number);
        const dateObj = new Date(Date.UTC(year, month - 1, day)); // Usa UTC
        // Compara se o ano, mês e dia re-extraídos correspondem
        return dateObj.getUTCFullYear() === year &&
               dateObj.getUTCMonth() === month - 1 &&
               dateObj.getUTCDate() === day;
    }


    validarCusto(custo) {
        const costNum = parseFloat(custo);
        return !isNaN(costNum) && costNum >= 0;
    }

    formatar() {
        try {
            const [year, month, day] = this.data.split('-');
            const formattedDate = `${day}/${month}/${year}`;
            let formattedString = `<strong>${this.tipo}</strong> em ${formattedDate}`; // Destaca o tipo
            if (this.custo > 0) {
                // Formata para moeda brasileira
                formattedString += ` - R$${this.custo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
            if (this.descricao) {
                // Escapa HTML simples na descrição para segurança básica
                const safeDesc = this.descricao.replace(/</g, "<").replace(/>/g, ">");
                formattedString += ` <small><i>(${safeDesc})</i></small>`; // Descrição menor e itálico
            }
            return formattedString; // Retorna HTML formatado
        } catch (error) {
            console.error("Erro ao formatar data da manutenção:", this.data, error);
            return `<strong>${this.tipo}</strong> em ${this.data} (data inválida?) - Custo: R$${this.custo.toFixed(2)}`; // Fallback
        }
    }

    // Verifica se a data é futura (incluindo hoje)
    isFuture() {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // Zera hora em UTC para comparar só a data
        // Cria a data da manutenção em UTC para evitar problemas de fuso horário
        const [year, month, day] = this.data.split('-').map(Number);
        const maintenanceDate = new Date(Date.UTC(year, month - 1, day));
        return maintenanceDate >= today;
    }

    // Verifica se a data é passada (excluindo hoje)
    isPast() {
         const today = new Date();
         today.setUTCHours(0, 0, 0, 0);
         const [year, month, day] = this.data.split('-').map(Number);
         const maintenanceDate = new Date(Date.UTC(year, month - 1, day));
         return maintenanceDate < today;
    }

    // Verifica se a data é hoje
     isToday() {
         const today = new Date();
         today.setUTCHours(0, 0, 0, 0);
         const [year, month, day] = this.data.split('-').map(Number);
         const maintenanceDate = new Date(Date.UTC(year, month - 1, day));
         return maintenanceDate.getTime() === today.getTime();
     }


    // Método estático para recriar instância a partir de JSON (essencial para LocalStorage)
    static fromJSON(json) {
        if (!json || !json.data || !json.tipo) {
            console.warn("Tentativa de criar Manutencao a partir de JSON inválido:", json);
            return null;
         }
        try {
           // Passa os valores recuperados para o construtor
           return new Manutencao(json.data, json.tipo, json.custo, json.descricao);
        } catch (error) {
           console.error("Erro ao recriar Manutencao a partir de JSON:", json, error);
           return null; // Retorna null se a recriação falhar
        }
    }
}

class Veiculo {
    constructor(tipo, modelo, ano) {
        if (!tipo || !modelo || !ano || parseInt(ano) < 1900 || parseInt(ano) > new Date().getFullYear() + 2) { // Validação ano
            throw new Error("Tipo, modelo e ano válido são obrigatórios para o veículo.");
        }
        // ID único mais robusto
        this.id = `veh_${Date.now().toString(36)}_${crypto.randomUUID().substring(0, 8)}`;
        this.tipo = tipo;
        this.modelo = modelo.trim();
        this.ano = parseInt(ano);
        this.status = 'Disponível'; // Status padrão
        this.historicoManutencao = []; // Array de objetos Manutencao
    }

    adicionarManutencao(manutencaoObj) {
        if (!(manutencaoObj instanceof Manutencao)) {
            console.error("Objeto inválido adicionado ao histórico:", manutencaoObj);
            mostrarAlerta("Erro: Tentativa de adicionar um registro de manutenção inválido.", 'danger');
            return false; // Indica falha
        }
        this.historicoManutencao.push(manutencaoObj);
        // Ordena histórico por data (mais recente primeiro)
        this.historicoManutencao.sort((a, b) => new Date(b.data) - new Date(a.data));
        console.log(`Manutenção adicionada ao ${this.modelo}:`, manutencaoObj.formatar());
        return true; // Indica sucesso
    }

    // Retorna apenas histórico passado formatado
    getHistoricoPassadoFormatado() {
         return this.historicoManutencao
              .filter(m => m.isPast()) // APENAS passado
              .map(m => m.formatar());
    }

    // Retorna apenas agendamentos futuros formatados
    getAgendamentosFuturosFormatados() {
        return this.historicoManutencao
            .filter(m => m.isFuture()) // Futuro (inclui hoje)
            .map(m => m.formatar());
    }
     // Retorna agendamentos/histórico de hoje formatados
     getHistoricoHojeFormatado() {
         return this.historicoManutencao
             .filter(m => m.isToday())
             .map(m => m.formatar());
     }


    getInfoBasica() {
        return `${this.tipo} ${this.modelo} (${this.ano})`;
    }

    // Método para obter URL da imagem baseada no tipo
    getImageUrl() {
        // Usando URLs do Icons8 como exemplo
         const baseUrl = 'https://img.icons8.com/';
        switch (this.tipo.toLowerCase()) { // Comparar em minúsculas
            case 'carro':
                 return `${baseUrl}pastel-glyph/64/000000/car--v2.png`;
            case 'carroesportivo': // Sem espaço
                return `${baseUrl}ios/50/000000/formula-1.png`;
             case 'caminhao': // Sem acento (como definido no select)
             case 'caminhão': // Com acento (para robustez)
                 return `${baseUrl}ios/50/000000/truck.png`;
            default:
                return `${baseUrl}ios/50/000000/question-mark--v1.png`; // Imagem padrão
        }
    }

    // Método estático para recriar instância a partir de JSON
    static fromJSON(json) {
        if (!json || !json.tipo || !json.modelo || !json.ano) {
             console.warn("Tentativa de criar Veiculo a partir de JSON inválido:", json);
             return null;
         }

        let veiculo;
        try {
            // Determina a classe correta baseada no 'tipo'
            switch (json.tipo) {
                case 'Carro':
                    veiculo = new Carro(json.modelo, json.ano, json.numPortas);
                    break;
                case 'CarroEsportivo':
                    veiculo = new CarroEsportivo(json.modelo, json.ano, json.numPortas, json.velocidadeMaxima);
                    break;
                case 'Caminhao': // Match com o valor do <select>
                case 'Caminhão':
                    veiculo = new Caminhao(json.modelo, json.ano, json.capacidadeCarga);
                    break;
                default:
                    console.warn(`Tipo de veículo desconhecido no JSON: ${json.tipo}. Criando Veiculo genérico.`);
                    // Fallback: Criar como Veiculo genérico se tipo for desconhecido
                    veiculo = new Veiculo(json.tipo, json.modelo, json.ano);
                    break;
            }

            // Restaura propriedades comuns e o histórico de manutenção
            veiculo.id = json.id || `veh_${Date.now().toString(36)}_${crypto.randomUUID().substring(0, 8)}`; // Garante um ID
            veiculo.status = json.status || 'Disponível';
            // Recria instâncias de Manutencao a partir do JSON
            veiculo.historicoManutencao = (json.historicoManutencao || [])
                .map(mJson => Manutencao.fromJSON(mJson)) // Usa o método estático da classe Manutencao
                .filter(m => m !== null); // Filtra nulos se Manutencao.fromJSON falhar

            // Reordena o histórico após carregar
            veiculo.historicoManutencao.sort((a, b) => new Date(b.data) - new Date(a.data));

            return veiculo;

        } catch (error) {
            console.error("Erro ao recriar Veiculo a partir de JSON:", json, error);
            return null; // Retorna null se a recriação falhar
        }
    }
}

class Carro extends Veiculo {
    constructor(modelo, ano, numPortas) {
        super('Carro', modelo, ano); // Chama construtor pai
        this.numPortas = parseInt(numPortas) || 4; // Padrão 4 portas
    }

    getInfoBasica() {
        return `${super.getInfoBasica()} - ${this.numPortas}p`; // Mais conciso
    }
}
class CarroEsportivo extends Carro { // Herda de Carro
    constructor(modelo, ano, numPortas, velocidadeMaxima) {
         super(modelo, ano, numPortas); // Chama construtor de Carro
         this.tipo = 'CarroEsportivo'; // Sobrescreve tipo
         this.velocidadeMaxima = parseInt(velocidadeMaxima) || 200; // Padrão 200 km/h
    }
     getInfoBasica() {
        return `${super.getInfoBasica()}, ${this.velocidadeMaxima}km/h`; // Mais conciso
    }
}


class Caminhao extends Veiculo {
    constructor(modelo, ano, capacidadeCarga) {
        // Usa 'Caminhao' sem acento consistentemente aqui, pois é o value do select
        super('Caminhao', modelo, ano);
        this.capacidadeCarga = parseInt(capacidadeCarga) || 1000; // Padrão 1000 kg
    }

    getInfoBasica() {
        return `${super.getInfoBasica()} - ${this.capacidadeCarga}kg`; // Mais conciso
    }
}

class Garagem {
    constructor() {
        this.vagas = []; // Array para guardar objetos Veiculo
        this.localStorageKey = 'smartGarageData_v3'; // Chave para LocalStorage (versão 3)
    }

    adicionarVeiculo(veiculoObj) {
        if (!(veiculoObj instanceof Veiculo)) {
             mostrarAlerta("Erro: Tentativa de adicionar um objeto que não é um Veículo.", 'danger');
            return false;
        }
        // Opcional: Verificar duplicatas (ex: mesmo modelo e ano)
        const existe = this.vagas.some(v => v.modelo.toLowerCase() === veiculoObj.modelo.toLowerCase() && v.ano === veiculoObj.ano);
        if (existe) {
            mostrarAlerta(`Veículo ${veiculoObj.modelo} (${veiculoObj.ano}) já parece existir na garagem.`, 'warning');
            // Poderia retornar false ou permitir duplicatas
             // return false;
        }

        this.vagas.push(veiculoObj);
        console.log(`Veículo ${veiculoObj.getInfoBasica()} adicionado à garagem.`);
        this.salvarNoLocalStorage();
        return true;
    }

    encontrarVeiculoPorId(id) {
         return this.vagas.find(v => v.id === id);
     }

     // Encontrar índice é útil para modificar/substituir objeto no array
      encontrarIndiceVeiculoPorId(id) {
         return this.vagas.findIndex(v => v.id === id);
     }


    salvarNoLocalStorage() {
        try {
            // JSON.stringify converte objetos e arrays, incluindo Manutencao (como objetos simples)
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.vagas));
            console.log("Garagem salva no LocalStorage.");
        } catch (error) {
            console.error("Erro ao salvar no LocalStorage:", error);
            let msg = "Erro ao salvar dados da garagem.";
            if (error.name === 'QuotaExceededError') {
                msg += " O armazenamento local está cheio.";
            }
            mostrarAlerta(msg, 'danger');
        }
    }

    carregarDoLocalStorage() {
        try {
            const data = localStorage.getItem(this.localStorageKey);
            if (data) {
                const plainVehicleObjects = JSON.parse(data);
                // CRUCIAL: Converte objetos simples de volta para instâncias de classe
                this.vagas = plainVehicleObjects
                    .map(plainObj => Veiculo.fromJSON(plainObj)) // Usa o método estático de Veiculo
                    .filter(v => v !== null); // Filtra qualquer falha na recriação

                console.log("Garagem carregada do LocalStorage. Veículos:", this.vagas.length);
            } else {
                console.log("Nenhum dado salvo encontrado no LocalStorage.");
                this.vagas = [];
            }
        } catch (error) {
            console.error("Erro ao carregar ou parsear dados do LocalStorage:", error);
            mostrarAlerta("Erro ao carregar dados da garagem. Os dados podem estar corrompidos. Iniciando com garagem vazia.", 'danger');
            this.vagas = []; // Começa do zero se o carregamento falhar
        }
    }

    // Adiciona manutenção a um veículo específico pelo ID
    adicionarManutencaoVeiculo(vehicleId, manutencaoObj) {
        const index = this.encontrarIndiceVeiculoPorId(vehicleId);
        if (index === -1) {
            mostrarAlerta("Erro: Veículo não encontrado para adicionar manutenção.", 'danger');
            return false;
        }
        const success = this.vagas[index].adicionarManutencao(manutencaoObj);
        if(success) {
            this.salvarNoLocalStorage(); // Salva o estado atualizado
        }
        return success;
    }
}

// --- Variáveis Globais e Seletores de Elementos DOM ---

const garagem = new Garagem();
const addVehicleForm = document.getElementById('add-vehicle-form');
const vehicleTypeSelect = document.getElementById('vehicle-type');
const carFields = document.getElementById('car-fields');
const sportscarFields = document.getElementById('sportscar-fields');
const truckFields = document.getElementById('truck-fields');
const vehicleListDiv = document.getElementById('vehicle-list');
const maintenanceModal = document.getElementById('maintenance-modal');
const modalCloseButton = document.querySelector('.modal .close-button');
const maintenanceForm = document.getElementById('maintenance-form');
const modalVehicleTitle = document.getElementById('modal-vehicle-title');
const maintenanceHistoryList = document.getElementById('maintenance-history-list');
const modalUpcomingList = document.getElementById('modal-upcoming-list');
const maintenanceVehicleIdInput = document.getElementById('maintenance-vehicle-id'); // Mudou para ID
const upcomingAppointmentsList = document.getElementById('upcoming-appointments-list');
// Adicionar seletores para os inputs específicos para required
const carDoorsInput = document.getElementById('car-doors');
const sportscarDoorsInput = document.getElementById('sportscar-doors');
const sportscarTopspeedInput = document.getElementById('sportscar-topspeed');
const truckCapacityInput = document.getElementById('truck-capacity');

// --- Funções Auxiliares e de Renderização ---

// Função simples para mostrar alertas (pode ser melhorada)
function mostrarAlerta(message, type = 'info') {
    // Usando alert por simplicidade, idealmente usar um div de notificação
    console.log(`ALERTA [${type.toUpperCase()}]: ${message}`); // Log no console
    alert(`[${type.toUpperCase()}] ${message}`);
    // Exemplo de como usar um div de alerta (requer <div id="alert-container"></div> no HTML)
    /*
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`; // Usa classes CSS definidas
        alertDiv.textContent = message;
        alertContainer.prepend(alertDiv); // Adiciona no início
        // Remove o alerta após alguns segundos
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 500); // Espera a transição de opacidade
        }, 5000); // 5 segundos
    }
    */
}


// Atualiza a visibilidade e o 'required' dos campos específicos do formulário de adicionar veículo
function updateSpecificFields() {
    const selectedType = vehicleTypeSelect.value;

    // Oculta todos e remove 'required'
    carFields.style.display = 'none';
    carDoorsInput.required = false;
    sportscarFields.style.display = 'none';
    sportscarDoorsInput.required = false;
    sportscarTopspeedInput.required = false;
    truckFields.style.display = 'none';
    truckCapacityInput.required = false;

    // Mostra o relevante e adiciona 'required'
    if (selectedType === 'Carro') {
        carFields.style.display = 'block';
        carDoorsInput.required = true;
    } else if (selectedType === 'CarroEsportivo') {
        sportscarFields.style.display = 'block';
        sportscarDoorsInput.required = true;
        sportscarTopspeedInput.required = true;
    } else if (selectedType === 'Caminhao') {
        truckFields.style.display = 'block';
        truckCapacityInput.required = true;
    }
}

// Renderiza a lista de veículos na garagem
function renderizarGaragem() {
    vehicleListDiv.innerHTML = ''; // Limpa lista atual
    if (garagem.vagas.length === 0) {
        vehicleListDiv.innerHTML = '<p style="text-align: center; color: #666;">Nenhum veículo na garagem ainda.</p>';
         renderUpcomingAppointmentsGlobal(); // Garante que a lista de agendamentos globais também seja atualizada (para mostrar "nenhum")
        return;
    }

    garagem.vagas.forEach((veiculo) => {
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.dataset.vehicleId = veiculo.id; // Guarda ID no elemento

        const imageUrl = veiculo.getImageUrl();

        // Usa innerHTML para criar o card (cuidado com XSS se dados não forem seguros)
        // Usar `textContent` para dados variáveis é mais seguro, mas aqui `getInfoBasica` é controlado
        card.innerHTML = `
            <div class="card-header">
                <h4>${veiculo.getInfoBasica()}</h4>
                <img src="${imageUrl}" alt="Ícone de ${veiculo.tipo}" class="vehicle-icon">
            </div>
            <p>Status: ${veiculo.status}</p>
            <p>ID: <small>${veiculo.id}</small></p>
            <button class="manage-maintenance-btn">Gerenciar Manutenção</button>
        `;

        // Adiciona listener diretamente ao botão do card criado
        card.querySelector('.manage-maintenance-btn').addEventListener('click', (e) => {
             // Pega o ID do dataset do card pai do botão
             const clickedVehicleId = e.currentTarget.closest('.vehicle-card').dataset.vehicleId;
            openMaintenanceModal(clickedVehicleId);
        });

        vehicleListDiv.appendChild(card);
    });
     renderUpcomingAppointmentsGlobal(); // Atualiza lista global de agendamentos
     checkUpcomingNotifications(); // Verifica notificações após renderizar
}


// Renderiza a lista global de agendamentos futuros
function renderUpcomingAppointmentsGlobal() {
    upcomingAppointmentsList.innerHTML = ''; // Limpa lista
    const allAppointments = [];

    garagem.vagas.forEach(veiculo => {
        veiculo.historicoManutencao.forEach(manutencao => {
            if (manutencao.isFuture()) {
                allAppointments.push({
                    date: new Date(manutencao.data + 'T00:00:00Z'), // Data para ordenação
                    vehicleInfo: veiculo.getInfoBasica(),
                    maintenanceHtml: manutencao.formatar() // Pega HTML formatado
                });
            }
        });
    });

    // Ordena agendamentos por data (mais próximo primeiro)
    allAppointments.sort((a, b) => a.date - b.date);

    if (allAppointments.length === 0) {
        upcomingAppointmentsList.innerHTML = '<li style="text-align: center; color: #666; background-color: transparent; border: none;">Nenhum agendamento futuro.</li>';
    } else {
        allAppointments.forEach(appt => {
            const li = document.createElement('li');
            // Usa innerHTML pois `formatar` retorna HTML
            li.innerHTML = `<strong>${appt.vehicleInfo}:</strong> ${appt.maintenanceHtml}`;
            upcomingAppointmentsList.appendChild(li);
        });
    }
}

// --- Funções de Manipulação de Eventos ---

// Lida com o envio do formulário de adicionar veículo
function handleAddVehicleSubmit(event) {
    event.preventDefault(); // Previne recarregamento da página

    const type = vehicleTypeSelect.value;
    const model = document.getElementById('vehicle-model').value;
    const year = document.getElementById('vehicle-year').value;

    try {
        let novoVeiculo;
        if (type === 'Carro') {
            novoVeiculo = new Carro(model, year, carDoorsInput.value);
        } else if (type === 'CarroEsportivo') {
             novoVeiculo = new CarroEsportivo(model, year, sportscarDoorsInput.value, sportscarTopspeedInput.value);
        } else if (type === 'Caminhao') {
            novoVeiculo = new Caminhao(model, year, truckCapacityInput.value);
        } else {
            mostrarAlerta("Tipo de veículo inválido selecionado.", 'danger');
            return;
        }

        const added = garagem.adicionarVeiculo(novoVeiculo);
        if(added){
            renderizarGaragem(); // Atualiza a UI
            addVehicleForm.reset(); // Limpa o formulário
            updateSpecificFields(); // Reseta visibilidade/required dos campos específicos
            mostrarAlerta(`Veículo ${novoVeiculo.getInfoBasica()} adicionado com sucesso!`, 'success');
            document.getElementById('vehicle-model').focus(); // Foco no campo modelo para adicionar próximo
        }

    } catch (error) {
        console.error("Erro ao criar ou adicionar veículo:", error);
        mostrarAlerta(`Erro ao adicionar veículo: ${error.message}`, 'danger');
    }
}

// Abre o modal de manutenção para um veículo específico
function openMaintenanceModal(vehicleId) {
    const veiculo = garagem.encontrarVeiculoPorId(vehicleId);
    if (!veiculo) {
        mostrarAlerta("Veículo não encontrado.", 'danger');
        return;
    }

    maintenanceVehicleIdInput.value = vehicleId; // Guarda ID no input hidden
    modalVehicleTitle.textContent = `Gerenciar Manutenção - ${veiculo.getInfoBasica()}`;

    // Popula Lista de Histórico (Passado e Hoje)
    maintenanceHistoryList.innerHTML = '';
    // Combina histórico de hoje e passado para a lista principal do histórico
    const historyToday = veiculo.getHistoricoHojeFormatado();
    const historyPast = veiculo.getHistoricoPassadoFormatado();
    const fullHistory = [...historyToday, ...historyPast]; // Já vêm ordenados pela classe

    if (fullHistory.length === 0) {
        maintenanceHistoryList.innerHTML = '<li>Nenhum histórico de manutenção registrado.</li>';
    } else {
        fullHistory.forEach(itemHtml => {
            const li = document.createElement('li');
            li.innerHTML = itemHtml; // Usa innerHTML pois formatar retorna HTML
            maintenanceHistoryList.appendChild(li);
        });
    }

    // Popula Lista de Agendamentos Futuros (Dentro do Modal)
    modalUpcomingList.innerHTML = '';
    const futureAppointments = veiculo.getAgendamentosFuturosFormatados();
    if (futureAppointments.length === 0) {
        modalUpcomingList.innerHTML = '<li>Nenhum agendamento futuro para este veículo.</li>';
    } else {
        futureAppointments.forEach(itemHtml => {
            const li = document.createElement('li');
             li.innerHTML = itemHtml; // Usa innerHTML
            modalUpcomingList.appendChild(li);
        });
    }

    maintenanceForm.reset(); // Limpa formulário do modal
    // Define a data atual como padrão no datepicker ao abrir
    flatpickrInstance.setDate(new Date(), false); // Define data atual sem disparar evento onChange

    maintenanceModal.style.display = 'block'; // Mostra o modal
    document.getElementById('maintenance-date').focus(); // Foco no campo de data
}


// Fecha o modal de manutenção
function closeMaintenanceModal() {
    maintenanceModal.style.display = 'none';
}

// Lida com o envio do formulário de manutenção/agendamento
function handleMaintenanceSubmit(event) {
    event.preventDefault();
    const vehicleId = maintenanceVehicleIdInput.value;

    if (!vehicleId) {
        mostrarAlerta("Erro: ID do veículo não encontrado no formulário.", 'danger');
        return;
    }

    const data = document.getElementById('maintenance-date').value;
    const tipo = document.getElementById('maintenance-type').value;
    const custo = document.getElementById('maintenance-cost').value || 0; // Padrão 0 se vazio
    const descricao = document.getElementById('maintenance-description').value;

    try {
        const novaManutencao = new Manutencao(data, tipo, custo, descricao);

        // Adiciona a manutenção ao veículo na garagem (método da Garagem agora)
        const success = garagem.adicionarManutencaoVeiculo(vehicleId, novaManutencao);

        if(success) {
            // Re-renderiza o modal com dados atualizados
            openMaintenanceModal(vehicleId); // Atualiza listas dentro do modal
            renderizarGaragem(); // Atualiza lista global de agendamentos e verifica notificações

            mostrarAlerta(`Registro/Agendamento de '${tipo}' adicionado para o veículo.`, 'success');
            // Não fecha o modal automaticamente, permite adicionar mais
            maintenanceForm.reset(); // Limpa o formulário para próximo registro
             flatpickrInstance.setDate(new Date(), false); // Reseta data para hoje
             document.getElementById('maintenance-type').focus(); // Foco no tipo de serviço
        }

    } catch (error) {
        console.error("Erro ao criar ou adicionar manutenção:", error);
        mostrarAlerta(`Erro: ${error.message}`, 'danger');
    }
}

// Verifica e mostra notificações sobre agendamentos próximos (ex: hoje/amanhã)
function checkUpcomingNotifications() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    today.setUTCHours(0, 0, 0, 0); // Compara em UTC
    tomorrow.setUTCHours(0, 0, 0, 0); // Compara em UTC

    let notifications = []; // Acumula notificações

    garagem.vagas.forEach(veiculo => {
        veiculo.historicoManutencao.forEach(manutencao => {
            if (manutencao.isFuture()) { // Verifica só futuros
                const [year, month, day] = manutencao.data.split('-').map(Number);
                const maintenanceDate = new Date(Date.UTC(year, month - 1, day));

                 if (maintenanceDate.getTime() === today.getTime()) {
                    notifications.push(`HOJE: ${manutencao.tipo} - ${veiculo.getInfoBasica()}`);
                 } else if (maintenanceDate.getTime() === tomorrow.getTime()) {
                     notifications.push(`Amanhã: ${manutencao.tipo} - ${veiculo.getInfoBasica()}`);
                 }
                 // Adicionar lógica para "nos próximos X dias" se desejado
            }
        });
    });

     // Exibe um alerta único com todos os lembretes de hoje/amanhã
     if (notifications.length > 0) {
         mostrarAlerta(`Lembretes de Agendamento:\n- ${notifications.join('\n- ')}`, 'warning');
     }
}


// --- Inicialização e Event Listeners ---

// Variável global para a instância do Flatpickr
let flatpickrInstance;

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Carregado. Inicializando Garagem Inteligente...");

    // Inicializa Flatpickr no campo de data da manutenção
    flatpickrInstance = flatpickr("#maintenance-date", {
        dateFormat: "Y-m-d", // Formato AAAA-MM-DD
        locale: "pt",       // Português
        altInput: true,     // Mostra formato amigável (ex: 10 de Outubro, 2024)
        altFormat: "d/m/Y", // Formato amigável a ser exibido
        allowInput: true,   // Permite digitar a data também
        // defaultDate: "today" // Define data atual como padrão inicial
    });


    garagem.carregarDoLocalStorage();
    updateSpecificFields(); // Define visibilidade inicial dos campos específicos
    renderizarGaragem();    // Renderiza a garagem inicial

    // Adiciona Listeners
    vehicleTypeSelect.addEventListener('change', updateSpecificFields);
    addVehicleForm.addEventListener('submit', handleAddVehicleSubmit);
    modalCloseButton.addEventListener('click', closeMaintenanceModal);
    maintenanceForm.addEventListener('submit', handleMaintenanceSubmit);

    // Fechar modal clicando fora do conteúdo
    window.addEventListener('click', (event) => {
        if (event.target === maintenanceModal) {
            closeMaintenanceModal();
        }
    });

    // Fechar modal com a tecla ESC
     window.addEventListener('keydown', (event) => {
         if (event.key === 'Escape' && maintenanceModal.style.display === 'block') {
             closeMaintenanceModal();
         }
     });


    console.log("Garagem Inteligente inicializada.");
});