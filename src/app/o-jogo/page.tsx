import Image from "next/image";
import { Lightbulb } from "lucide-react";

export default function OJogoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Heat: Pedal to the Metal</h1>

      <div className="w-full flex align-middle justify-center mb-6">
        <Image src="/heat-pedal-to-the-metal.jpg" alt="Heat - Pedal to the Metal" width={420} height={250} />
      </div>

      <p className="text-gray-700 mb-4">
        <strong>Heat: Pedal to the Metal</strong> é um jogo de corrida onde você gerencia a velocidade e o calor do motor
        para ser o primeiro a cruzar a linha de chegada. A graça está em equilibrar a vontade de acelerar com o risco de
        superaquecer. <a href="https://en.wikipedia.org/wiki/Heat:_Pedal_to_the_Metal#1" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">(fonte)</a>
        <a href="https://discover.library.unt.edu/catalog/b7746875#show-availability" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">(referência)</a>.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">🏁 Resumo das Regras Principais</h2>

      <p className="text-gray-700 mb-4">A dinâmica do jogo gira em torno de um ciclo de gerenciamento de mão, marchas e calor. Cada rodada segue estes passos:</p>

      <ol className="list-inside list-decimal text-gray-700 ml-6 space-y-3 mb-6">
        <li>
          <strong>Passar a Marcha</strong>: você pode subir ou descer uma marcha por rodada. <strong>Importante:</strong> se quiser subir ou descer duas marchas de uma vez, precisará pagar 1 carta de <em>Calor</em> como penalidade. <a href="https://pt.doc.boardgamearena.com/index.php?title=Gamehelpheat&diff=cur&oldid=847" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">(ref)</a>
        </li>
        <li>
          <strong>Jogar Cartas</strong>: a marcha atual define quantas cartas você deve jogar (ex: 1ª marcha = 1 carta, 2ª marcha = 2 cartas). As cartas de Calor nunca podem ser jogadas como movimento. <a href="https://pt.doc.boardgamearena.com/index.php?title=Gamehelpheat&diff=cur&oldid=847" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">(ref)</a>
        </li>
        <li>
          <strong>Revelar e Mover</strong>: some os valores das cartas jogadas para definir sua <strong>Velocidade</strong> e mova seu carro o número correspondente de espaços na pista.
        </li>
        <li>
          <strong>Reagir (Opcional)</strong>: aqui você usa poderes especiais:
          <ul className="list-disc ml-6 mt-2">
            <li><strong>Impulso (Boost)</strong>: pague 1 carta de Calor para ganhar +1 de Velocidade uma vez por rodada.</li>
            <li><strong>Resfriamento (Cooldown)</strong>: remova cartas de Calor da sua mão; marchas baixas costumam oferecer mais resfriamento.</li>
            <li><strong>Adrenalina</strong>: último colocado (ou um dos dois últimos em grids grandes) recebe bônus de Velocidade/Resfriamento.</li>
          </ul>
        </li>
        <li>
          <strong>Vácuo (Opcional)</strong>: terminar atrás ou ao lado de outro carro permite andar +2 espaços extras (não conta para limite de velocidade em curvas).
        </li>
        <li>
          <strong>Verificar Curva</strong>: se você cruzou uma linha de curva, verifique se sua Velocidade total ultrapassou o limite da curva. Se ultrapassou, pague Calor igual à diferença. Se não tiver Calor suficiente, você capota (spin out): volta para trás da curva, recebe cartas de Estresse e sua marcha é rebaixada para 1ª.
        </li>
        <li>
          <strong>Descartar e Reabastecer</strong>: descarte cartas indesejadas (exceto Calor/Estresse) e compre até ter 7 cartas na mão.
        </li>
      </ol>

      <h3 className="text-xl font-bold text-gray-800 mb-2">💡 Dicas e Mecânicas Importantes</h3>
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mb-6">
        <p className="text-blue-900 flex items-start gap-2">
          <Lightbulb className="w-5 h-5 mt-1" />
          <span>
            <strong>Gerenciamento de Calor é Crucial:</strong> o Calor funciona como uma dívida — cartas de Calor ocupam sua mão e só saem por Resfriamento. Jogar consistente e evitar ausências costuma ser mais valioso do que arriscar tudo.
          </span>
        </p>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-2">Módulos Avançados</h3>
      <ul className="list-disc ml-6 text-gray-700 mb-6">
        <li><strong>Garagem</strong>: personalize seu baralho com upgrades antes da corrida. <a href="https://en.wikipedia.org/wiki/Heat:_Pedal_to_the_Metal#1" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">(ref)</a></li>
        <li><strong>Lendas</strong>: adiciona pilotos automatizados para solo ou para completar o grid.</li>
        <li><strong>Clima e Campeonato</strong>: adiciona condições de pista variáveis e sistema de temporada.</li>
      </ul>

      <p className="text-gray-700 mb-6">É uma experiência que combina sorte (as cartas que você compra) com muita estratégia e gestão de risco, capturando bem a tensão de uma corrida.</p>

      <p className="text-gray-700 mb-6">Fontes: <a href="https://s.ign.com/articles/heat-pedal-to-the-metal-board-game-review#1" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">IGN review</a>, <a href="https://en.boardgamearena.com/gamepanel?game=heat" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">BoardGameArena</a>.</p>

    </div>
  );
}
