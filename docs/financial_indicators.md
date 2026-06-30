# Indicadores Financeiros - Micro MVP

Este documento consolida os indicadores financeiros mínimos que a aplicação deve calcular e exibir no Micro MVP.

---

## Indicadores Essenciais do Dashboard

### 1. Saldo Disponível (Sobrou)
* **O que representa**: O total acumulado no mês corrente que está disponível para o usuário gastar livremente ou destinar para investimentos.
* **Como é calculado**:
  $$\text{Sobrou} = \text{Total Entradas} - \text{Total Saídas}$$
* **Utilidade**: Fornecer a resposta imediata de capacidade financeira de poupança no mês.

### 2. Total Entradas (Receitas)
* **O que representa**: O faturamento bruto líquido de impostos do usuário no mês corrente.
* **Como é calculado**: Soma de todas as transações com tipo `INCOME` na data do mês atual.

### 3. Total Saídas (Despesas)
* **O que representa**: O total de recursos que saíram do orçamento de consumo do usuário no mês corrente.
* **Como é calculado**: Soma de todas as transações com tipo `EXPENSE` na data do mês atual.

### 4. Distribuição por Categorias
* **O que representa**: A divisão proporcional dos gastos do mês entre as categorias mapeadas (`Alimentação`, `Mercado`, `Transporte`, `Outros`).
* **Como é calculado**:
  $$\text{\% Categoria} = \left( \frac{\sum \text{amount (Categoria)}}{\text{Total Saídas}} \right) \times 100$$
* **Utilidade**: Identificar qual dos três pilares principais (ou custos extras gerais) está consumindo a maior parte da renda.
