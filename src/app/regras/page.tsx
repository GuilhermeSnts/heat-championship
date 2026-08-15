import { POINTS_TABLE } from "@/lib/types";
import Image from "next/image";
import { Award, Lightbulb } from "lucide-react";

export default function RulesPage() {
  const sortedPositions = Object.entries(POINTS_TABLE)
    .map(([pos, pts]) => ({ position: parseInt(pos), points: pts }))
    .sort((a, b) => a.position - b.position);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        Regras do Campeonato
      </h1>

      <div className="w-full flex align-middle justify-center">
        <Image src="/cat_running.png" alt="Logo" width={300} height={150} />
      </div>


      {/* Scoring Rules Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-red-600 flex items-center gap-2">
          Sistema de Pontuação
        </h2>
        
        <p className="text-gray-700 mb-6">
          A pontuação é atribuída de acordo com a posição de chegada em cada partida.
          Quanto melhor a colocação, mais pontos o jogador recebe.
        </p>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Colocação</th>
                <th className="px-6 py-4 text-center font-semibold">Pontos</th>
              </tr>
            </thead>
            <tbody>
              {sortedPositions.map((row, idx) => (
                <tr
                  key={row.position}
                  className={
                    idx % 2 === 0 ? "bg-white" : "bg-white"
                  }
                >
                  <td className="px-6 py-4 text-gray-800">
                    {row.position === 1 && (
                      <span className="inline-flex items-center gap-2"><Award className="w-4 h-4 text-yellow-400" />1º lugar</span>
                    )}
                    {row.position === 2 && (
                      <span className="inline-flex items-center gap-2"><Award className="w-4 h-4 text-slate-400" />2º lugar</span>
                    )}
                    {row.position === 3 && (
                      <span className="inline-flex items-center gap-2"><Award className="w-4 h-4 text-amber-700" />3º lugar</span>
                    )}
                    {row.position > 3 && `${row.position}º lugar`}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-lg text-red-600">
                    {row.points}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100">
                <td className="px-6 py-4 text-gray-800">Posições acima de 10º lugar</td>
                <td className="px-6 py-4 text-center font-bold text-lg text-gray-600">
                  0
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <p className="text-blue-900 flex items-start gap-2">
            <Lightbulb className="w-5 h-5 mt-1" />
            <span>
              <strong>Dica:</strong> A média aritmética de pontos é calculada dividindo
              o total de pontos pelo número de partidas disputadas.
            </span>
          </p>
        </div>
      </section>

      {/* Eligibility Rules Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-red-600">
          Regra de Elegibilidade
        </h2>
        

        <div className="bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-600 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">Status OFICIAL</h3>
          <p className="text-gray-800 text-lg mb-3">
            Um jogador é considerado <strong>OFICIAL</strong> quando participa de pelo menos
            <strong className="text-green-700 text-xl"> ⅔ (dois terços)</strong> das partidas do campeonato.
          </p>
          <p className="text-sm text-gray-700 bg-white bg-opacity-60 p-3 rounded">
            Exemplo: Se há 9 partidas no campeonato, um jogador precisa participar de
            pelo menos <strong>6 partidas</strong> (⌈9 × 2/3⌉ = ⌈6⌉ = 6) para ser oficial.
          </p>
        </div>

        <div className="bg-linear-to-r from-yellow-50 to-orange-50 border-2 border-yellow-600 rounded-lg p-6">
          <h3 className="text-xl font-bold text-yellow-900 mb-4">Status PROVISÓRIO</h3>
          <p className="text-gray-800 text-lg">
            Jogadores que não atingem a participação mínima aparecem como
            <strong className="text-yellow-700 text-xl"> PROVISÓRIOS</strong> na classificação.
          </p>
          <p className="text-sm text-gray-700 mt-3 bg-white bg-opacity-60 p-3 rounded">
            Jogadores provisórios ainda acumulam pontos e aparecem no ranking, mas sua
            classificação é indicada com o status de &quot;PROVISÓRIO&quot;.
          </p>
        </div>
      </section>

      {/* Classification Rules Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-red-600 flex items-center gap-2">
          Ordenação da Classificação
        </h2>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start gap-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Jogadores Oficiais (primeiro)</h4>
                <p className="text-gray-700">
                  Todos os jogadores com status <strong>OFICIAL</strong> aparecem primeiro,
                  ordenados por média de pontos (do maior para o menor).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start gap-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Jogadores Provisórios (depois)</h4>
                <p className="text-gray-700">
                  Todos os jogadores com status <strong>PROVISÓRIO</strong> aparecem depois,
                  também ordenados por média de pontos (do maior para o menor).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start gap-4">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Critério de Desempate</h4>
                <p className="text-gray-700">
                  Em caso de empate na média de pontos, o ranking é ordenado por:
                </p>
                <ul className="mt-2 ml-4 space-y-1 text-gray-700">
                  <li>• Total de pontos (maior)</li>
                  <li>• Número de vitórias (maior)</li>
                  <li>• Ordem alfabética (como último recurso)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
