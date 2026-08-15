import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-2xl text-center">
        <Image
          src="/broken.png"
          alt="Página não encontrada"
          width={600}
          height={400}
          className="mx-auto w-80 h-auto mb-6"
        />
        <h1 className="text-3xl font-bold mb-2">404 — Página não encontrada</h1>
        <p className="text-gray-600 mb-4">Ops! A página que você procura não existe ou foi removida.</p>
        <Link
          href="/"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Voltar à página inicial
        </Link>
      </div>
    </div>
  );
}
