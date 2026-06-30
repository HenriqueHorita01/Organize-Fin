# Jornada do Usuário - Micro MVP

Este documento descreve os fluxos operacionais e a jornada de experiência do usuário para o Micro MVP.

---

## 1. Onboarding (Primeiro Acesso)
* O usuário realiza login.
* O sistema inicializa a tela principal vazia (Saldo = R$ 0,00, Entradas = R$ 0,00, Saídas = R$ 0,00) com as categorias prontas para uso.
* Sem cadastros de contas ou cartões exigidos.

---

## 2. Fluxos de Uso

### Uso Diário (Lançamento de Gastos)
1. O usuário abre o app.
2. Clica no **FAB (+)**.
3. Insere o valor e seleciona a categoria (`Alimentação`, `Mercado` ou `Transporte`).
4. Salva e retorna para o Dashboard.

### Uso Mensal (Avaliação do Saldo Investível)
1. No último dia do mês, o usuário acessa o Dashboard.
2. Vê o valor consolidado na métrica **"Sobrou"**.
3. Esse valor representa exatamente o montante líquido disponível que ele pode transferir de sua conta real no banco para sua corretora de investimentos.
4. No primeiro dia do novo mês, as datas filtram automaticamente o novo período, reiniciando o Dashboard com saldos zerados para o acompanhamento do novo ciclo.
