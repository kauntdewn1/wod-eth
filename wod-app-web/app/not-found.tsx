export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-arena">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-protocol mb-4">404</h1>
        <p className="text-protocol/70 mb-8">Página não encontrada</p>
        <a
          href="/"
          className="px-6 py-3 bg-token text-white rounded-lg hover:bg-token/80 transition-colors"
        >
          Voltar para Home
        </a>
      </div>
    </div>
  );
}

