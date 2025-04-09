# Garagem Inteligente Unificada

Este projeto implementa uma interface web unificada para gerenciar veículos, histórico de manutenções e agendamentos de serviços de uma garagem, utilizando HTML, CSS e JavaScript puro, com persistência de dados via LocalStorage do navegador e funcionalidade de filtragem na listagem de veículos.

## Funcionalidades Principais

*   **Minha Garagem:**
    *   Lista todos os veículos cadastrados com suas informações (Placa, Modelo, Ano, Cor).
    *   **Filtros Dinâmicos:** Permite filtrar a lista de veículos em tempo real digitando parte do **Modelo** ou da **Placa**.
    *   **Limpar Filtros:** Botão para remover rapidamente os filtros aplicados e exibir todos os veículos novamente.
    *   Ações rápidas por veículo: Ver Histórico, Agendar Serviço, Remover.
*   **Adicionar Veículo:**
    *   Formulário para cadastrar novos veículos.
    *   Validação de placa única.
    *   Validação de formato de placa (padrão antigo e Mercosul).
*   **Histórico de Manutenções:**
    *   Exibe o histórico de todas as manutenções (concluídas ou agendadas).
    *   Permite visualizar o histórico específico de um veículo clicando no botão "Histórico" na lista da garagem.
    *   Ordena o histórico por data (mais recente primeiro).
    *   Botão para voltar facilmente à visualização do histórico geral.
*   **Agendar Serviço:**
    *   Formulário para agendar novos serviços para os veículos cadastrados (selecionados por um dropdown).
    *   Impede agendamentos com datas no passado.
    *   Lista os próximos agendamentos pendentes (data atual ou futura).
*   **Marcar como Concluído:**
    *   Permite marcar um serviço agendado como "Concluído" diretamente da lista de agendamentos.
    *   Solicita informações opcionais de custo e observações ao concluir.
*   **Remover Veículo:**
    *   Permite remover veículos da garagem (com caixa de diálogo de confirmação).
    *   **Importante:** O histórico de manutenções associado à placa do veículo removido **é mantido** no sistema.
*   **Persistência Local:** Todos os dados (veículos e manutenções) são salvos no LocalStorage do navegador, persistindo entre as sessões no mesmo navegador.
*   **Interface Intuitiva:** Design de página única (SPA) com navegação clara entre as seções usando um menu superior.
*   **Feedback ao Usuário:** Mensagens de status flutuantes informam sobre o sucesso ou erro das operações realizadas.

## Tecnologias Utilizadas

*   HTML5
*   CSS3
*   JavaScript (ES6+)
*   LocalStorage API (Navegador)

## Como Executar

1.  Certifique-se de ter os três arquivos (`index.html`, `style.css`, `script.js`) na mesma pasta.
2.  Abra o arquivo `index.html` em um navegador web moderno (como Chrome, Firefox, Edge, Safari).

## Estrutura do Projeto

A estrutura é simples, com todos os arquivos principais na mesma pasta: