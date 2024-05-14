import Footer from './Footer';
import Header from './Header';

const gameList = [
  { name: '2048 게임', game_url: 'https://play2048.co/' },
  { name: '지렁이 게임', game_url: 'https://slithergame.io/' },
  { name: '버블슈터 게임', game_url: 'https://poki.com/kr/g/bubbleshooter' },
];

export default function GameList() {
  return (
    <>
      <Header />
      <ul className="mx-auto min-h-[90vh] max-w-[680px]  px-[40px] py-[20px] ">
        {gameList.map((game, index) => {
          return (
            <li className=" py-[24px]">
              <div className="flex gap-x-4">
                <p className="h-[80px] text-2xl font-extrabold leading-[80px]">
                  {index + 1}
                </p>
                <div className="grow">
                  <a
                    href={game.game_url}
                    className="block h-[80px] bg-amber-100 text-center text-xl font-bold leading-[80px]"
                  >
                    {game.name}
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <Footer />
    </>
  );
}
