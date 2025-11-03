#!/bin/bash

# Script para corrigir dependências e limpar instalações problemáticas

set -e

echo "🧹 Limpando instalações anteriores..."
rm -rf contracts/node_modules contracts/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json frontend/.next

echo ""
echo "📦 Reinstalando dependências dos contratos..."
cd contracts
npm install --legacy-peer-deps

echo ""
echo "📦 Reinstalando dependências do frontend..."
cd ../frontend
npm install --legacy-peer-deps

echo ""
echo "✅ Dependências corrigidas!"
echo ""
echo "Agora você pode rodar:"
echo "  make dev              # Frontend"
echo "  make dev-contracts    # Hardhat node (outro terminal)"

