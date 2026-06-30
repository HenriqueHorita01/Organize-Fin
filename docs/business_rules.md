# Regras de Negócio - Micro MVP

Este documento descreve as regras de funcionamento simplificadas aplicadas ao fluxo de dados do Micro MVP.

---

## 1. Regras de Transações

### Inserção de Transações
* Qualquer lançamento exige: `user_id`, `amount`, `type`, `category` e `date`.
* **Validação**: O valor (`amount`) deve ser maior que zero. A categoria selecionada deve ser correspondente ao tipo de transação:
  * Se `type = 'INCOME'`: a categoria deve ser `SALARIO` ou `EXTRA`.
  * Se `type = 'EXPENSE'`: a categoria deve ser `ALIMENTACAO`, `MERCADO`, `TRANSPORTE` ou `OUTROS`.
* **Data Padrão**: Caso não seja especificada pelo usuário, o sistema assume a data de "Hoje" do dispositivo.

### Exclusão e Edição de Lançamentos
* Como não há persistência ou caches de saldo em tabelas de contas, qualquer edição ou exclusão de um lançamento na tabela `transactions` afeta o saldo calculado de forma imediata na próxima consulta de tela.

---

## 2. Cálculos e Indicadores

### Cálculo do Saldo Disponível (Sobrou)
* O saldo do mês corrente é computado dinamicamente:
  $$\text{Saldo} = \sum \text{amount (INCOME)} - \sum \text{amount (EXPENSE)}$$
* O total acumulado representa a capacidade de investimento livre do usuário para o mês.

### Cálculo de Distribuição por Categoria
* A distribuição de gastos é apresentada em valor absoluto e percentual em relação ao total de despesas do mês:
  $$\text{\% Categoria} = \left( \frac{\sum \text{amount (Categoria)}}{\text{Total Despesas do Mês}} \right) \times 100$$
