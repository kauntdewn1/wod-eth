.PHONY: help install install-contracts install-frontend dev build compile deploy-local deploy-mumbai deploy-amoy deploy-amoy-arena deploy-polygon test test-contracts clean lint format

# Cores para output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Mostra esta mensagem de ajuda
	@echo "$(BLUE)WOD [X] PRO - Comandos Disponíveis$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

# Instalação
install: install-contracts install-frontend ## Instala todas as dependências
	@echo "$(GREEN)✅ Todas as dependências instaladas!$(NC)"

install-contracts: ## Instala dependências dos contratos
	@echo "$(BLUE)📦 Instalando dependências dos contratos...$(NC)"
	cd contracts && npm install --legacy-peer-deps

install-frontend: ## Instala dependências do frontend
	@echo "$(BLUE)📦 Instalando dependências do frontend...$(NC)"
	cd frontend && npm install --legacy-peer-deps

# Desenvolvimento
dev: ## Roda o frontend em modo desenvolvimento
	@echo "$(BLUE)🚀 Iniciando servidor de desenvolvimento...$(NC)"
	cd frontend && npm run dev

dev-contracts: ## Roda Hardhat node local para testes
	@echo "$(BLUE)🔷 Iniciando Hardhat node local...$(NC)"
	cd contracts && npx hardhat node

build: compile build-frontend ## Compila contratos e builda frontend

build-frontend: ## Builda o frontend para produção
	@echo "$(BLUE)🏗️  Building frontend...$(NC)"
	cd frontend && npm run build

# Smart Contracts
compile: ## Compila os smart contracts
	@echo "$(BLUE)🔷 Compilando contratos...$(NC)"
	cd contracts && npm run compile

test: test-contracts ## Roda todos os testes

test-contracts: ## Testa os smart contracts
	@echo "$(BLUE)🧪 Rodando testes dos contratos...$(NC)"
	cd contracts && npm test

# Deploy
deploy-local: ## Faz deploy dos contratos no Hardhat local
	@echo "$(BLUE)🚀 Fazendo deploy local...$(NC)"
	@echo "$(YELLOW)⚠️  Certifique-se de que o Hardhat node está rodando!$(NC)"
	cd contracts && npm run deploy:local

deploy-mumbai: ## Faz deploy dos contratos no Mumbai (testnet)
	@echo "$(BLUE)🚀 Fazendo deploy no Mumbai testnet...$(NC)"
	@echo "$(YELLOW)⚠️  Verifique suas variáveis de ambiente!$(NC)"
	cd contracts && npm run deploy:polygon

deploy-amoy: ## Faz deploy dos contratos na Amoy testnet
	@echo "$(BLUE)🚀 Deployando contratos na Amoy testnet...$(NC)"
	@echo "$(YELLOW)⚠️  Verifique suas variáveis de ambiente!$(NC)"
	cd contracts && npm run deploy:amoy

deploy-amoy-arena: ## Faz deploy apenas do Arena na Amoy (para completar deploy parcial)
	@echo "$(BLUE)🚀 Deployando Arena na Amoy...$(NC)"
	@echo "$(YELLOW)⚠️  Certifique-se de ter POL suficiente (~0.12 POL)$(NC)"
	cd contracts && npm run deploy:amoy:arena

deploy-polygon: ## Faz deploy dos contratos no Polygon (mainnet)
	@echo "$(RED)⚠️  ATENÇÃO: Deploy em mainnet!$(NC)"
	@read -p "Tem certeza? (y/N) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		cd contracts && npm run deploy:polygon; \
	else \
		echo "$(YELLOW)Deploy cancelado.$(NC)"; \
	fi

# Fix
fix-deps: clean ## Corrige e reinstala todas as dependências
	@echo "$(BLUE)🔧 Corrigindo dependências...$(NC)"
	@bash scripts/fix-dependencies.sh

fix-all: clean-all fix-deps ## Limpa tudo e corrige dependências (solução nuclear)

# Utilitários
clean: ## Limpa arquivos de build e cache
	@echo "$(BLUE)🧹 Limpando arquivos...$(NC)"
	rm -rf contracts/artifacts contracts/cache contracts/typechain-types
	rm -rf frontend/.next frontend/out frontend/node_modules/.cache
	@echo "$(GREEN)✅ Limpeza concluída!$(NC)"

clean-all: clean ## Limpa tudo incluindo node_modules
	@echo "$(BLUE)🧹 Limpando node_modules...$(NC)"
	rm -rf contracts/node_modules frontend/node_modules node_modules
	@echo "$(GREEN)✅ Limpeza completa!$(NC)"

lint: ## Roda linter no frontend
	@echo "$(BLUE)🔍 Rodando linter...$(NC)"
	cd frontend && npm run lint

format: ## Formata código (se tiver prettier configurado)
	@echo "$(BLUE)✨ Formatando código...$(NC)"
	@if command -v prettier > /dev/null; then \
		prettier --write "contracts/**/*.{ts,sol}" "frontend/**/*.{ts,tsx}" --ignore-path .gitignore; \
	else \
		echo "$(YELLOW)Prettier não encontrado. Instale com: npm install -g prettier$(NC)"; \
	fi

# Verificações
check-env: ## Verifica se as variáveis de ambiente estão configuradas
	@echo "$(BLUE)🔍 Verificando variáveis de ambiente...$(NC)"
	@test -f frontend/.env || (echo "$(RED)❌ frontend/.env não encontrado! Copie de .env.example$(NC)" && exit 1)
	@test -f contracts/.env || (echo "$(YELLOW)⚠️  contracts/.env não encontrado (opcional)$(NC)")
	@echo "$(GREEN)✅ Variáveis de ambiente verificadas!$(NC)"

check-contracts: ## Verifica se os contratos estão compilados
	@echo "$(BLUE)🔍 Verificando contratos...$(NC)"
	@test -d contracts/artifacts || (echo "$(RED)❌ Contratos não compilados! Rode: make compile$(NC)" && exit 1)
	@echo "$(GREEN)✅ Contratos compilados!$(NC)"

# Setup inicial
setup: install check-env compile ## Setup inicial completo do projeto
	@echo ""
	@echo "$(GREEN)✅ Setup completo!$(NC)"
	@echo "$(BLUE)Próximos passos:$(NC)"
	@echo "  1. Configure suas variáveis de ambiente em frontend/.env"
	@echo "  2. Faça deploy dos contratos: $(YELLOW)make deploy-local$(NC)"
	@echo "  3. Inicie o frontend: $(YELLOW)make dev$(NC)"

# Desenvolvimento completo (duas abas)
dev-full: ## Inicia tudo (contratos + frontend) - use em terminais separados
	@echo "$(YELLOW)⚠️  Para desenvolvimento completo:$(NC)"
	@echo "$(BLUE)Terminal 1:$(NC) make dev-contracts"
	@echo "$(BLUE)Terminal 2:$(NC) make deploy-local"
	@echo "$(BLUE)Terminal 3:$(NC) make dev"

# Status
status: ## Mostra status do projeto
	@echo "$(BLUE)📊 Status do Projeto WOD [X] PRO$(NC)"
	@echo ""
	@echo "$(BLUE)Contratos:$(NC)"
	@test -d contracts/artifacts && echo "  ✅ Compilados" || echo "  ❌ Não compilados"
	@test -f contracts/.env && echo "  ✅ .env configurado" || echo "  ⚠️  .env não encontrado"
	@echo ""
	@echo "$(BLUE)Frontend:$(NC)"
	@test -f frontend/.env && echo "  ✅ .env configurado" || echo "  ❌ .env não encontrado"
	@test -d frontend/node_modules && echo "  ✅ Dependências instaladas" || echo "  ❌ Dependências não instaladas"
	@echo ""
	@echo "$(BLUE)IPFS:$(NC)"
	@curl -s http://127.0.0.1:5001/api/v0/version > /dev/null 2>&1 && \
		echo "  ✅ IPFS local rodando" || \
		echo "  ⚠️  IPFS local não detectado (opcional)"

# Git helpers
git-status: ## Mostra status do git
	@git status --short

git-diff: ## Mostra diff do git
	@git diff

# Docker (opcional - para futuro)
docker-build: ## Builda imagem Docker (se configurado)
	@echo "$(BLUE)🐳 Building Docker image...$(NC)"
	@if [ -f Dockerfile ]; then \
		docker build -t wod-x-pro .; \
	else \
		echo "$(YELLOW)⚠️  Dockerfile não encontrado$(NC)"; \
	fi

# Atualizar dependências
update: ## Atualiza todas as dependências
	@echo "$(BLUE)⬆️  Atualizando dependências...$(NC)"
	cd contracts && npm update
	cd frontend && npm update
	@echo "$(GREEN)✅ Dependências atualizadas!$(NC)"

# Default target
.DEFAULT_GOAL := help

