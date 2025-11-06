# Configuração de Email Authentication - WOD [X] PRO

## Visão Geral

O WOD [X] PRO suporta dois métodos de autenticação por e-mail:

1. **Email OTP** (One-Time Password) - Código de 6 dígitos
2. **Magic Link** - Link de verificação no e-mail

---

## Configuração no Dashboard da Alchemy

### Passo 1: Acessar Smart Wallets

1. Acesse [Alchemy Dashboard](https://dashboard.alchemy.com/)
2. Vá em **Smart Wallets**
3. Selecione sua configuração (ou crie uma nova)
4. Clique em **Edit**

### Passo 2: Configurar Email Mode

Na seção **Email**:

#### Para Email OTP (Recomendado)
- Selecione **One Time Password (OTP)**
- ✅ **Vantagens**: 3x maior taxa de conversão, 10 segundos mais rápido
- ✅ **Melhor UX**: Usuário não precisa sair do app

#### Para Magic Link
- Selecione **Magic Link**
- ⚠️ **Requisito**: Configurar URL de redirect no dashboard
- ⚠️ **Nota**: Usuário precisa verificar e-mail e voltar ao app

### Passo 3: Salvar Configuração

- Clique em **Save Changes**

---

## Configuração no Código

### Email OTP (Padrão)

O componente `EmailAuth` já está configurado para usar OTP por padrão:

```tsx
<EmailAuth mode="otp" />
```

### Magic Link

Para usar Magic Link:

```tsx
<EmailAuth mode="magicLink" />
```

### Seletor de Modo

O `LoginButton` permite ao usuário escolher:

```tsx
<LoginButton />
// Usuário pode escolher entre "Código (OTP)" e "Link Mágico"
```

---

## Como Funciona

### Email OTP

1. Usuário digita e-mail
2. Clica em "Receber Código"
3. Recebe código de 6 dígitos no e-mail
4. Digita código no app
5. ✅ Autenticado

### Magic Link

1. Usuário digita e-mail
2. Clica em "Receber Link"
3. Recebe link no e-mail
4. Clica no link (redireciona para o app)
5. ✅ Autenticado automaticamente

---

## Configuração de Redirect URL (Magic Link)

Se você usar Magic Link, precisa configurar a URL de redirect:

### No Dashboard da Alchemy

1. Vá em **Smart Wallets** → Sua Config → **Edit**
2. Na seção **Email**, configure:
   - **Redirect URL**: `http://localhost:3000` (dev)
   - **Redirect URL**: `https://seu-dominio.com` (prod)

### No Código

O componente `EmailAuth` já trata o redirect automaticamente:

```tsx
// EmailAuth.tsx já tem useEffect para capturar bundle do URL
useEffect(() => {
  const url = new URL(window.location.href);
  const bundle = url.searchParams.get("bundle");
  // Autentica automaticamente se bundle existir
}, []);
```

---

## Recomendações

### Para Desenvolvimento
- **Recomendado**: Email OTP
- Mais rápido para testar
- Não precisa configurar redirect URL

### Para Produção
- **Recomendado**: Email OTP
- Melhor conversão (3x maior)
- Melhor UX (10 segundos mais rápido)

### Quando Usar Magic Link
- Se você já tem um fluxo de e-mail estabelecido
- Se usuários preferem clicar em links
- Se você tem boa infraestrutura de e-mail

---

## Troubleshooting

### OTP não chega no e-mail
- Verifique spam/lixo eletrônico
- Verifique se o e-mail está correto
- Verifique logs do Alchemy Dashboard

### Magic Link não redireciona
- Verifique se Redirect URL está configurada no dashboard
- Verifique se a URL do app corresponde à configurada
- Verifique console do navegador para erros

### Erro "bundle not found"
- Magic Link: Verifique se redirect URL está correta
- OTP: Esse erro não deve aparecer (OTP não usa bundle)

---

## Variáveis de Ambiente

Certifique-se de ter configurado:

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=sua_api_key
NEXT_PUBLIC_ALCHEMY_APP_ID=seu_app_id
NEXT_PUBLIC_ALCHEMY_POLICY_ID=seu_policy_id  # Opcional (Gas Manager)
```

---

## Próximos Passos

1. ✅ Configure Email Mode no dashboard (OTP ou Magic Link)
2. ✅ Teste o fluxo de autenticação
3. ✅ Configure Redirect URL (se usar Magic Link)
4. ✅ Teste em produção

---

*Última atualização: Novembro 2024*

