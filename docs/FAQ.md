# FAQ - Perguntas Frequentes

## 💰 Custos e Gas Fees

### "Preciso pagar gas fee todo dia que treinar?"
**NÃO!** Treinos diários são **off-chain** (gratuitos). Você só paga gas quando:
- Participa de um **desafio competitivo** na Arena
- Sincroniza treinos on-chain (opcional, batch)

### Quanto custa participar de um desafio?
- **Entry fee**: Definido pelo desafio (ex: 100 $WOD)
- **Gas fee**: Pode ser subsidiado via Account Abstraction (gratuito para você) ou ~$0.01 no Polygon

---

## 📝 Treinos Diários

### "Onde meus treinos diários ficam armazenados?"
- **Localmente**: No seu navegador (localStorage)
- **IPFS**: Vídeos vão para Lighthouse (permanente, mas off-chain)
- **On-chain**: Apenas quando você usa em um desafio

### "E se eu perder meus dados locais?"
Os vídeos continuam no IPFS (permanente). Você pode recuperar os CIDs se tiver backup. O histórico local pode ser reconstruído.

### "Posso sincronizar meus treinos on-chain depois?"
Sim! Você pode escolher quais treinos quer "certificar" on-chain:
- **Sync individual**: Quando participar de um desafio
- **Sync batch**: Múltiplos treinos em uma transação

---

## 🏟️ A Arena (Desafios)

### "Como funciona um desafio?"
1. Admin cria desafio com entry fee e prize pool
2. Você entra pagando a taxa (on-chain)
3. Submete prova de esforço (vídeo → IPFS → CID on-chain)
4. Validadores votam (Rep/No-Rep)
5. Após deadline, prêmios são distribuídos automaticamente

### "Preciso fazer stake para validar?"
Sim, validadores precisam fazer stake mínimo (ex: 1000 $WOD) para garantir comprometimento e qualidade das validações.

### "Como me torno validador?"
1. Tenha $WOD suficiente para o stake mínimo
2. Registre-se no `ValidatorRegistry`
3. Faça stake dos tokens
4. Comece a validar submissões

---

## 💳 Comprar $WOD

### "Como compro $WOD?"
Via **Alchemy Pay** dentro do app:
1. Clique em "Comprar $WOD"
2. Insira valor em R$
3. Pague com PIX
4. Tokens depositados automaticamente na sua wallet

### "Preciso saber sobre cripto?"
Não! Com Alchemy Account Kit:
- Login com Google/e-mail
- Wallet criada automaticamente
- Zero conhecimento técnico necessário

---

## 🔒 Segurança

### "Minha wallet pode ser hackeada?"
Alchemy Account Kit usa **Account Abstraction** (smart contract wallets):
- Recuperação via e-mail/social
- Não precisa gerenciar chaves privadas
- Mais seguro que wallets tradicionais

### "Os contratos são auditados?"
Contratos são públicos e auditáveis. Audit formal recomendado antes de mainnet.

---

## 📊 Performance

### "O IPFS é rápido?"
Uploads para Lighthouse são rápidos. Acesso aos vídeos depende da rede IPFS, mas Lighthouse garante disponibilidade permanente.

### "Quanto tempo leva uma transação?"
- **Polygon**: ~2-5 segundos
- **Mumbai (testnet)**: ~1-3 segundos

---

## 🚀 Fase 2: O Mercado

### "Quando a Fase 2 será lançada?"
Após estabilização da Fase 1 (Arena). O Mercado permitirá apostas em eventos esportivos com oráculo descentralizado.

---

## 🆘 Suporte

### "Onde posso pedir ajuda?"
- GitHub Issues
- Discord (quando disponível)
- Documentação: `/docs`

---

## 💡 Dicas

1. **Treinos diários**: Use sempre off-chain (gratuito!)
2. **Desafios**: Escolha com sabedoria (entry fee = investimento)
3. **Validação**: Seja justo, a comunidade precisa de consenso
4. **$WOD**: Use para participar, não apenas acumular

