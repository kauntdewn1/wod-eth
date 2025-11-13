# 🎨 Componentes UI - WOD[X] PRO

Componentes reutilizáveis prontos para uso, todos alinhados com o branding da marca.

## 📦 Componentes Disponíveis

### 1. `<Button />`
Botão com estados de loading e variantes.

```tsx
import { Button } from '@/app/ui';

// Uso básico
<Button>Entrar no Desafio</Button>

// Com loading
<Button loading>Processando...</Button>

// Variantes
<Button variant="primary">Primário</Button>
<Button variant="secondary">Secundário</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Tamanhos
<Button size="sm">Pequeno</Button>
<Button size="md">Médio</Button>
<Button size="lg">Grande</Button>
```

### 2. `<Card />`
Card modular para desafios e conteúdo.

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/app/ui';

<Card hover>
  <CardHeader>
    <CardTitle>Desafio WOD #1</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Conteúdo */}
  </CardContent>
</Card>
```

### 3. `<Badge />`
Selos e badges para status e informações.

```tsx
import { Badge, TokenBadge, ValidatedBadge, TopBadge } from '@/app/ui';

// Badge genérico
<Badge variant="token">Ativo</Badge>
<Badge variant="success">Validado</Badge>
<Badge variant="warning">Pendente</Badge>

// Badges específicos
<TokenBadge amount="100" />
<ValidatedBadge />
<TopBadge rank="1%" />
```

### 4. `<Score />` e `<ReputationScore />`
Barras de progresso visuais para scores e reputação.

```tsx
import { Score, ReputationScore } from '@/app/ui';

// Score genérico
<Score 
  label="Reputation" 
  value={750} 
  max={1000} 
  variant="token" 
/>

// Reputation Score específico
<ReputationScore score={850} max={1000} />
```

### 5. `<Loader />` e `<PageLoader />`
Loaders com animação para estados de carregamento.

```tsx
import { Loader, PageLoader } from '@/app/ui';

// Loader inline
<Loader size="md" text="Carregando..." />

// Loader de página completa
<PageLoader text="Carregando desafios..." />
```

## 🎨 Características

✅ **Branding aplicado**: Todas as cores seguem a paleta oficial (protocol, token, arena)  
✅ **Tipografia**: Space Grotesk aplicada  
✅ **Client Components**: Prontos para SSR com `'use client'` onde necessário  
✅ **TypeScript**: Totalmente tipado  
✅ **Acessibilidade**: Estados disabled e loading tratados  
✅ **Responsivo**: Funciona em todos os tamanhos de tela  

## 📝 Exemplo de Integração

```tsx
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/app/ui';
import { Button } from '@/app/ui';
import { TokenBadge, ValidatedBadge } from '@/app/ui';
import { ReputationScore } from '@/app/ui';

export function ChallengeCard() {
  return (
    <Card hover>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Desafio WOD #1</CardTitle>
          <ValidatedBadge />
        </div>
      </CardHeader>
      <CardContent>
        <ReputationScore score={850} />
        <div className="mt-4 flex gap-2">
          <Button variant="primary">Participar</Button>
          <TokenBadge amount="100" />
        </div>
      </CardContent>
    </Card>
  );
}
```

