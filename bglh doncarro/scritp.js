'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores DOM ---
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const garagemTbody = document.getElementById('garagem-tbody');
    const formAddVeiculo = document.getElementById('form-add-veiculo');
    const formAgendamento = document.getElementById('form-agendamento');
    const historicoLista = document.getElementById('historico-lista');
    const statusMessage = document.getElementById('status-message');
    const btnRefreshGaragem = document.getElementById('btn-refresh-garagem');
    const btnShowAllHistory = document.getElementById('btn-show-all-history');
    const agendamentoPlacaSelect = document.getElementById('agendamento-placa-select');
    const agendamentoPlacaHidden = document.getElementById('agendamento-placa-hidden');
    const listaAgendamentosFuturos = document.getElementById('lista-agendamentos-futuros');
    const historicoPlacaSpan = document.getElementById('historico-placa-selecionada');
    const historicoPlaceholder = document.querySelector('.historico-placeholder');
    const agendamentoPlaceholder = document.querySelector('.agendamento-placeholder');
    // Seletores para Filtro
    const filtroModeloInput = document.getElementById('filtro-modelo');
    const filtroPlacaInput = document.getElementById('filtro-placa');


    // --- Constantes de LocalStorage ---
    const VEICULOS_KEY = 'garagem_veiculos_v2';
    const MANUTENCOES_KEY = 'garagem_manutencoes_v2';

    // --- Funções de Persistência (LocalStorage com Tratamento de Erro) ---
    const getData = (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error(`Erro ao ler dados do LocalStorage (${key}):`, error);
            showStatusMessage(`Erro ao carregar dados (${key}). Verifique o console.`, 'error');
            return [];
        }
    };

    const saveData = (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Erro ao salvar dados no LocalStorage (${key}):`, error);
            showStatusMessage(`Erro ao salvar dados (${key}). Verifique o console.`, 'error');
        }
    };

    // --- Funções de Exibição de Mensagens ---
    let statusTimeout;
    const showStatusMessage = (message, type = 'info', duration = 3000) => {
        clearTimeout(statusTimeout);
        statusMessage.textContent = message;
        statusMessage.className = 'show'; // Reinicia classes e adiciona 'show'
        statusMessage.classList.add(type); // Adiciona classe de tipo (success, error, info)

        statusTimeout = setTimeout(() => {
            statusMessage.classList.remove('show');
        }, duration);
    };

    // --- Funções de Navegação ---
    const setActiveSection = (targetId) => {
        contentSections.forEach(section => {
            section.classList.remove('active-section');
            if (section.id === targetId) {
                section.classList.add('active-section');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.dataset.target === targetId) {
                link.classList.add('active-link');
            }
        });

        // Ações específicas ao mostrar seções
        if (targetId === 'secao-garagem') {
            filtrarERenderizarGaragem(); // Renderiza com base nos filtros atuais
        } else if (targetId === 'secao-agendamento') {
            populateVeiculoSelect();
            renderAgendamentosFuturos();
            // Limpa seleção específica se não veio de um clique
            if (!agendamentoPlacaHidden.value) {
                 agendamentoPlacaSelect.value = "";
            }
            agendamentoPlacaHidden.value = ""; // Limpa sempre após uso

        } else if (targetId === 'secao-historico') {
            // Mostra histórico geral se não houver placa específica no título
            if (historicoPlacaSpan.textContent === 'Geral' || !historicoPlacaSpan.textContent) {
                 renderHistorico();
            }
        } else if (targetId === 'secao-adicionar') {
            formAddVeiculo.reset(); // Limpa o formulário ao navegar para ele
            formAddVeiculo.querySelector('#add-placa').focus(); // Foca no primeiro campo
        }
    };

    // --- Lógica da Garagem ---

    // Função para filtrar e chamar a renderização
    const filtrarERenderizarGaragem = () => {
        const todosVeiculos = getData(VEICULOS_KEY);
        const filtroModelo = filtroModeloInput.value.trim().toLowerCase();
        const filtroPlaca = filtroPlacaInput.value.trim().toLowerCase();

        const veiculosFiltrados = todosVeiculos.filter(veiculo => {
            // Verifica se o modelo contém o texto do filtro (case-insensitive)
            const modeloMatch = !filtroModelo || veiculo.modelo.toLowerCase().includes(filtroModelo);
            // Verifica se a placa contém o texto do filtro (case-insensitive)
            const placaMatch = !filtroPlaca || veiculo.placa.toLowerCase().includes(filtroPlaca);
            return modeloMatch && placaMatch;
        });

        renderGaragem(veiculosFiltrados); // Passa a lista filtrada
    };


    // Renderiza a tabela da garagem com base na lista fornecida
    const renderGaragem = (veiculosParaRenderizar = null) => {
        const veiculos = veiculosParaRenderizar !== null ? veiculosParaRenderizar : getData(VEICULOS_KEY);
        garagemTbody.innerHTML = ''; // Limpa tabela

        if (veiculos.length === 0) {
            const isFiltering = filtroModeloInput.value || filtroPlacaInput.value;
            garagemTbody.innerHTML = `<tr><td colspan="5">${isFiltering ? 'Nenhum veículo encontrado com os filtros atuais.' : 'Nenhum veículo na garagem. Adicione um!'}</td></tr>`;
            return;
        }

        const todosVeiculosOriginais = getData(VEICULOS_KEY); // Necessário para obter o índice correto para remoção

        veiculos.forEach((veiculo) => {
            // Encontra o índice original do veículo na lista completa
            const originalIndex = todosVeiculosOriginais.findIndex(v => v.placa === veiculo.placa);

            const tr = document.createElement('tr');
            // Formata a placa para exibição (opcional, pode manter normalizada)
            // const placaFormatada = formatarPlaca(veiculo.placa); // Função auxiliar se desejado

            tr.innerHTML = `
                <td>${veiculo.placa}</td>
                <td>${veiculo.modelo}</td>
                <td>${veiculo.ano}</td>
                <td>${veiculo.cor}</td>
                <td>
                    <button class="btn-historico" data-placa="${veiculo.placa}" title="Ver Histórico">Histórico</button>
                    <button class="btn-agendar" data-placa="${veiculo.placa}" title="Agendar Serviço">Agendar</button>
                    <button class="btn-remover" data-index="${originalIndex}" title="Remover Veículo">Remover</button> <!-- Usa o índice original -->
                </td>
            `;
            // Adiciona listeners aos botões da linha
            tr.querySelector('.btn-historico').addEventListener('click', () => {
                renderHistorico(veiculo.placa);
                setActiveSection('secao-historico');
            });
            tr.querySelector('.btn-agendar').addEventListener('click', () => {
                agendamentoPlacaSelect.value = veiculo.placa; // Pré-seleciona no formulário
                agendamentoPlacaHidden.value = veiculo.placa; // Marca que veio de um clique
                setActiveSection('secao-agendamento');
            });
            tr.querySelector('.btn-remover').addEventListener('click', (e) => handleRemoverVeiculo(e));

            garagemTbody.appendChild(tr);
        });
    };

    const handleAddVeiculo = (event) => {
        event.preventDefault();
        const formData = new FormData(formAddVeiculo);
        const veiculos = getData(VEICULOS_KEY);

        // Normaliza a placa: remove traço e espaços, converte para maiúsculas
        const placaInput = formData.get('placa').trim().toUpperCase();
        const placaNormalizada = placaInput.replace(/[-\s]/g, ''); // Remove traços e espaços

        const novoVeiculo = {
            placa: placaNormalizada, // Salva a placa normalizada
            modelo: formData.get('modelo').trim(),
            ano: formData.get('ano'),
            cor: formData.get('cor').trim()
        };

        // Validação robusta da placa (padrão Mercosul ou antigo)
        const placaAntigaPattern = /^[A-Z]{3}[0-9]{4}$/;
        const placaMercosulPattern = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

        if (!placaAntigaPattern.test(novoVeiculo.placa) && !placaMercosulPattern.test(novoVeiculo.placa)) {
            showStatusMessage('Erro: Formato de placa inválido. Use AAA1234 ou AAA1B34.', 'error');
            formAddVeiculo.querySelector('#add-placa').focus();
            return;
        }

        // Validação de placa única (usando a normalizada)
        if (veiculos.some(v => v.placa === novoVeiculo.placa)) {
            showStatusMessage(`Erro: Veículo com a placa ${placaInput} já existe!`, 'error');
            formAddVeiculo.querySelector('#add-placa').focus();
            return;
        }

        // Validação simples campos não vazios (HTML required já ajuda)
        if (!novoVeiculo.modelo || !novoVeiculo.ano || !novoVeiculo.cor) {
             showStatusMessage('Erro: Preencha todos os campos do veículo.', 'error');
             return;
        }


        veiculos.push(novoVeiculo);
        saveData(VEICULOS_KEY, veiculos);
        showStatusMessage('Veículo adicionado com sucesso!', 'success');
        formAddVeiculo.reset();
        filtrarERenderizarGaragem(); // Atualiza a tabela da garagem (considerando filtros)
        populateVeiculoSelect(); // Atualiza o select de agendamento
        setActiveSection('secao-garagem'); // Volta para a garagem
    };

    const handleRemoverVeiculo = (event) => {
        const indexToRemove = parseInt(event.target.dataset.index, 10);
        const veiculos = getData(VEICULOS_KEY);

        if (indexToRemove < 0 || indexToRemove >= veiculos.length) {
            showStatusMessage('Erro ao encontrar veículo para remover. Atualize a lista.', 'error');
            filtrarERenderizarGaragem();
            return;
        }

        const veiculoRemovido = veiculos[indexToRemove];

        // Confirmação mais específica
        if (confirm(`Tem certeza que deseja remover o veículo ${veiculoRemovido.modelo} (Placa: ${veiculoRemovido.placa})? \n\nATENÇÃO: O histórico de manutenções associado a esta placa permanecerá registrado.`)) {
            veiculos.splice(indexToRemove, 1);
            saveData(VEICULOS_KEY, veiculos);

            // Nota: Manutenções NÃO são removidas automaticamente.
            // Poderia ser implementado se desejado.

            showStatusMessage(`Veículo ${veiculoRemovido.placa} removido.`, 'info');
            filtrarERenderizarGaragem(); // Re-renderiza a garagem
            populateVeiculoSelect(); // Atualiza select de agendamento
            // Se o histórico específico do veículo removido estava sendo exibido, volta pro geral
            if(historicoPlacaSpan.textContent.includes(veiculoRemovido.placa)){
                renderHistorico();
            }
            renderAgendamentosFuturos(); // Atualiza agendamentos futuros (remove os do carro)
        }
    };

    // --- Lógica do Histórico ---
    const renderHistorico = (placa = null) => {
        const manutencoes = getData(MANUTENCOES_KEY);
        let historicoFiltrado = manutencoes;

        if (placa) {
            historicoFiltrado = manutencoes.filter(m => m.placa === placa);
            historicoPlacaSpan.textContent = `Veículo: ${placa}`;
            btnShowAllHistory.style.display = 'inline-block'; // Mostra botão de voltar pro geral
        } else {
            historicoPlacaSpan.textContent = 'Geral';
             btnShowAllHistory.style.display = 'none'; // Esconde botão quando já está no geral
        }

        historicoLista.innerHTML = ''; // Limpa lista

        if (historicoFiltrado.length === 0) {
            historicoPlaceholder.textContent = placa ? `Nenhum histórico encontrado para o veículo ${placa}.` : 'Nenhum histórico de manutenção registrado.';
            historicoPlaceholder.style.display = 'block';
        } else {
            historicoPlaceholder.style.display = 'none';
            // Ordena por data (mais recente primeiro)
            historicoFiltrado.sort((a, b) => new Date(b.data + 'T00:00:00') - new Date(a.data + 'T00:00:00')); // Garante comparação de data

            historicoFiltrado.forEach(manutencao => {
                const li = document.createElement('li');
                // Adiciona 'T00:00:00' para evitar problemas de fuso ao converter para Date
                 const dataObj = new Date(manutencao.data + 'T00:00:00');
                 const dataFormatada = !isNaN(dataObj) ? dataObj.toLocaleDateString('pt-BR') : 'Data inválida';

                let statusClasse = '';
                if (manutencao.status === 'Concluído') statusClasse = 'status-concluido';
                if (manutencao.status === 'Agendada') statusClasse = 'status-agendada';

                li.innerHTML = `
                    <strong>${dataFormatada}</strong> -
                    ${!placa ? `Veículo: ${manutencao.placa} <br>` : ''} <!-- Mostra placa no histórico geral -->
                    Serviço: ${manutencao.servico} <br>
                    <span class="status ${statusClasse}">Status: ${manutencao.status || 'N/D'}</span>
                    ${manutencao.custo ? `<br>Custo: R$ ${parseFloat(manutencao.custo).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
                     ${manutencao.observacao ? `<br>Obs: ${manutencao.observacao}` : ''}
                `;
                historicoLista.appendChild(li);
            });
        }
    };

    // --- Lógica de Agendamento ---
    const populateVeiculoSelect = () => {
        const veiculos = getData(VEICULOS_KEY);
        const currentSelectedValue = agendamentoPlacaSelect.value;

        agendamentoPlacaSelect.innerHTML = '<option value="">Selecione um veículo...</option>';
        veiculos.sort((a, b) => a.modelo.localeCompare(b.modelo)); // Ordena por modelo
        veiculos.forEach(v => {
            const option = document.createElement('option');
            option.value = v.placa;
            option.textContent = `${v.modelo} (${v.placa})`;
            agendamentoPlacaSelect.appendChild(option);
        });

        // Tenta restaurar a seleção anterior
        if (veiculos.some(v => v.placa === currentSelectedValue)) {
           agendamentoPlacaSelect.value = currentSelectedValue;
        }
    };

    const handleAgendamento = (event) => {
        event.preventDefault();
        const formData = new FormData(formAgendamento);
        const manutencoes = getData(MANUTENCOES_KEY);

        const dataInput = formData.get('data');
        const hoje = new Date();
        hoje.setHours(0,0,0,0); // Zera hora para comparar só a data
        const dataSelecionada = new Date(dataInput + 'T00:00:00');


        // Validação de data futura
        if(dataSelecionada < hoje) {
            showStatusMessage('Erro: A data do agendamento não pode ser no passado.', 'error');
            formAgendamento.querySelector('#agendamento-data').focus();
            return;
        }


        const novoAgendamento = {
            placa: formData.get('placa'),
            servico: formData.get('servico').trim(),
            data: dataInput,
            status: 'Agendada',
            custo: null,
            observacao: ''
        };

        if (!novoAgendamento.placa || !novoAgendamento.servico || !novoAgendamento.data) {
            showStatusMessage('Erro: Preencha todos os campos do agendamento.', 'error');
            return;
        }

        manutencoes.push(novoAgendamento);
        saveData(MANUTENCOES_KEY, manutencoes);
        showStatusMessage('Serviço agendado com sucesso!', 'success');
        formAgendamento.reset();
        agendamentoPlacaSelect.value = "";
        renderAgendamentosFuturos();
        setActiveSection('secao-agendamento');
    };

    const renderAgendamentosFuturos = () => {
        const manutencoes = getData(MANUTENCOES_KEY);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const agendamentosFuturos = manutencoes.filter(m => {
            const dataManutencao = new Date(m.data + 'T00:00:00');
            // Filtra por status 'Agendada' E data >= hoje
            return m.status === 'Agendada' && !isNaN(dataManutencao) && dataManutencao >= hoje;
        });

        agendamentosFuturos.sort((a, b) => new Date(a.data + 'T00:00:00') - new Date(b.data + 'T00:00:00'));

        listaAgendamentosFuturos.innerHTML = ''; // Limpa lista

        if (agendamentosFuturos.length === 0) {
            agendamentoPlaceholder.style.display = 'block';
        } else {
            agendamentoPlaceholder.style.display = 'none';
            agendamentosFuturos.forEach((agendamento, index) => { // Passa o index original
                const li = document.createElement('li');
                 const dataObj = new Date(agendamento.data + 'T00:00:00');
                 const dataFormatada = !isNaN(dataObj) ? dataObj.toLocaleDateString('pt-BR') : 'Data inválida';

                li.innerHTML = `
                    <strong>${dataFormatada}</strong> - ${agendamento.placa}: ${agendamento.servico}
                    <button class="btn-marcar-concluido" data-agendamento-info='${JSON.stringify({placa: agendamento.placa, data: agendamento.data, servico: agendamento.servico})}' title="Marcar como Concluído">Concluir</button>
                 `;
                 li.querySelector('.btn-marcar-concluido').addEventListener('click', handleMarcarConcluido);
                listaAgendamentosFuturos.appendChild(li);
            });
        }
    };

    const handleMarcarConcluido = (event) => {
         const agendamentoInfo = JSON.parse(event.target.dataset.agendamentoInfo);

         const custoInput = prompt(`Serviço "${agendamentoInfo.servico}" para ${agendamentoInfo.placa} concluído!\n\nInforme o custo (número, use . ou , para decimais). Deixe em branco ou 0 se não houver custo:`, '');
         let custoFinal = null;
         if (custoInput !== null && custoInput.trim() !== '') {
             const custoNumerico = parseFloat(custoInput.replace(',', '.'));
             if (!isNaN(custoNumerico)) {
                 custoFinal = custoNumerico;
             } else {
                 showStatusMessage('Custo inválido. Será salvo sem custo.', 'info');
             }
         }

         const observacao = prompt(`Alguma observação sobre o serviço "${agendamentoInfo.servico}"? (opcional)`);

         const manutencoes = getData(MANUTENCOES_KEY);

         // Encontra o índice do agendamento original para atualizar
         const index = manutencoes.findIndex(m =>
             m.placa === agendamentoInfo.placa &&
             m.data === agendamentoInfo.data &&
             m.servico === agendamentoInfo.servico &&
             m.status === 'Agendada' // Garante que está atualizando o agendamento correto
         );

         if (index !== -1) {
             manutencoes[index].status = 'Concluído';
             manutencoes[index].custo = custoFinal;
             manutencoes[index].observacao = observacao ? observacao.trim() : ''; // Salva obs ou string vazia
             saveData(MANUTENCOES_KEY, manutencoes);
             showStatusMessage('Serviço marcado como concluído!', 'success');
             renderAgendamentosFuturos(); // Atualiza a lista de agendamentos
             // Atualiza o histórico se estiver visível (geral ou específico)
             if(document.getElementById('secao-historico').classList.contains('active-section')){
                 renderHistorico(historicoPlacaSpan.textContent.includes('Veículo:') ? agendamentoInfo.placa : null);
             }
         } else {
             showStatusMessage('Erro: Agendamento não encontrado para concluir. Pode já ter sido concluído.', 'error');
             renderAgendamentosFuturos(); // Re-renderiza para garantir consistência
         }
     };


    // --- Inicialização e Event Listeners Globais ---
    // Navegação Principal
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.dataset.target;
            agendamentoPlacaHidden.value = ""; // Limpa seleção específica ao navegar pelo menu
            setActiveSection(targetId);
        });
    });

    // Formulários
    formAddVeiculo.addEventListener('submit', handleAddVeiculo);
    formAgendamento.addEventListener('submit', handleAgendamento);

    // Botões Adicionais
    btnRefreshGaragem.addEventListener('click', () => {
        filtroModeloInput.value = ''; // Limpa campo modelo
        filtroPlacaInput.value = '';  // Limpa campo placa
        renderGaragem(); // Renderiza a lista completa
        showStatusMessage('Filtros limpos. Exibindo todos os veículos.', 'info', 1500);
    });
    btnShowAllHistory.addEventListener('click', () => {
         renderHistorico(); // Passa null para mostrar geral
         setActiveSection('secao-historico'); // Garante que a seção correta está ativa
    });

    // Listeners para os campos de filtro (filtrar enquanto digita)
    filtroModeloInput.addEventListener('input', filtrarERenderizarGaragem);
    filtroPlacaInput.addEventListener('input', filtrarERenderizarGaragem);

    // --- Carregamento Inicial ---
    populateVeiculoSelect(); // Popula o select de veículos para agendamento
    renderAgendamentosFuturos(); // Mostra agendamentos pendentes
    renderGaragem(); // Exibe a garagem completa ao carregar inicialmente (antes de setActiveSection)
    setActiveSection('secao-garagem'); // Define a seção inicial visível
});