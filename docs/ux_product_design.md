# Experiência de Design (UX/UI) - Micro MVP

Este documento define os princípios de UX/UI para manter o Micro MVP extremamente intuitivo e rápido de utilizar.

---

## 1. Princípios de Experiência do Usuário

1. **Atrito Zero**: O foco principal do aplicativo é o lançamento de gastos. O usuário não deve preencher descrições longas, datas ou formas de pagamento caso não queira. A entrada padrão assume data de "Hoje" e deixa a descrição em branco.
2. **Psicologia Positiva (Sobrou)**: A métrica principal em destaque no topo do aplicativo é o saldo líquido positivo ("Sobrou"). Isso estimula o usuário a ver o número crescer e a convertê-lo em investimentos no final do mês, substituindo o estresse de ver faturas e dívidas.
3. **Sem Navegação Complexa**: Apenas modais de gaveta inferior (Bottom Sheets) para operações, mantendo o usuário na mesma página inicial.

---

## 2. O Fluxo de Cadastro Rápido (3 Cliques)

O design da Bottom Sheet é otimizado para a menor quantidade de interações:
1. **Clique 1**: Usuário clica no FAB (+).
2. **Clique 2**: O teclado numérico abre automaticamente. O usuário digita o valor e seleciona o ícone da categoria (ex: "Mercado").
3. **Clique 3**: Usuário clica em "Salvar".
* **Resultado**: Lançamento concluído em menos de 5 segundos.
