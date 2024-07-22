"use client";

import { useEffect, useState } from "react";
import CardWidget from "./card/CardWidget";
import cardValue from "./utils/cardValue";
import startCountDown from "./utils/startCountDown";
import MaterialSymbolsArrowDropDown from "./icon/MaterialSymbolsArrowDropDown";
import MaterialSymbolsArrowDropUp from "./icon/MaterialSymbolsArrowDropUp";
import MadeByImBanden from "./madeBy/MadeByImBanden";

interface CardProps {
  image: string;
  code: string;
  value: string;
}

interface PlayerProps {
  name: string;
  hand: CardProps[];
  heart: number;
}

export default function Home() {
  const [deck, setDeck] = useState<CardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roundValue, setRoundValue] = useState(0);
  const [players, setPlayers] = useState<PlayerProps[]>([
    { name: "Player 1", hand: [], heart: 3 },
    { name: "Player 2", hand: [], heart: 3 },
    // { name: "Player 3", hand: [], heart: 3 },
  ]);
  const [gameRound, setGameRound] = useState<number>(1);
  const [countDown, setCountDown] = useState<number>(0);
  const [currTurn, setCurrTurn] = useState<number>(0);
  const [reverse, setReverse] = useState<boolean>(false);
  const [powerPlay, setPowerPlay] = useState<string>("");

  const powerObject = {
    ACE: [{ name: "Reverse", power: () => setReverse((prev) => !prev) }],

    KING: [
      { name: "0", power: () => setRoundValue(0) },
      { name: "99", power: () => setRoundValue(99) },
    ],

    QUEEN: [
      { name: "-20", power: () => setRoundValue((prev) => prev - 20) },
      { name: "+20", power: () => setRoundValue((prev) => prev + 20) },
    ],
  };

  useEffect(() => {
    fetch("https://www.deckofcardsapi.com/api/deck/new/draw/?count=52")
      .then((res) => {
        console.log("fetched cards data");
        return res.json();
      })
      .then((data) => {
        setDeck(data.cards);
        setPlayers((prevPlayers) =>
          prevPlayers.map((player, index) => ({
            ...player,
            hand: data.cards.slice(index * 3, (index + 1) * 3),
          }))
        );
        setDeck(data.cards.slice(3 * players.length));
        setIsLoading(false);
      });
  }, [gameRound]);

  const handleCardClick = (playerIndex: number, cardIndex: number) => {
    let lost = false;
    const card = players[playerIndex].hand[cardIndex];

    if (["KING", "QUEEN", "ACE"].includes(card.value)) {
      setPowerPlay(card.value);
    } else {
      setRoundValue((prev) => {
        const newValue = prev + cardValue(card.code);
        if (newValue > 99) {
          lost = true;
          startNewRound();
        }
        return newValue;
      });

      // Update players and deck
      setPlayers((prevPlayers) => {
        const newPlayers = [...prevPlayers];
        const newHand = [...newPlayers[playerIndex].hand];
        const newHeart = lost
          ? newPlayers[playerIndex].heart - 1
          : newPlayers[playerIndex].heart;
        newHand.splice(cardIndex, 1);
        if (deck.length > 0) {
          newHand.push(deck[deck.length - 1]);
        }
        newPlayers[playerIndex] = {
          ...newPlayers[playerIndex],
          hand: newHand,
          heart: newHeart,
        };
        return newPlayers;
      });

      setDeck((prevDeck) => prevDeck.slice(0, -1));

      // Progress turn
      if (!lost) {
        setCurrTurn((prev) => progressTurn(prev, reverse));
      }
    }
  };

  const startNewRound = () => {
    setCountDown(3);

    const timer = setInterval(() => {
      setCountDown((prev) => {
        if (prev < 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 0.5; //fix this shit
      });
    }, 1000);

    setGameRound(gameRound + 1);
    setRoundValue(0);
  };

  const handlePowerOptionClick = (option: {
    name: string;
    power: () => void;
  }) => {
    option.power();
    setPowerPlay("");

    // Progress turn after power play
    setCurrTurn((prev) =>
      progressTurn(prev, powerPlay === "ACE" ? !reverse : reverse)
    );
  };

  const progressTurn = (currentTurn: number, isReverse: boolean) => {
    if (!isReverse) {
      return currentTurn >= players.length - 1 ? 0 : currentTurn + 1;
    } else {
      return currentTurn <= 0 ? players.length - 1 : currentTurn - 1;
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center w-full h-screen">
        Loading...
      </div>
    );

  // console.log(countDown);
  return (
    <>
      <div className="flex w-full h-screen relative justify-center">
        <div className="flex flex-col items-center justify-between">
          <div>99 game</div>
          <p>Round {gameRound}</p>
          <p className="text-5xl">{roundValue}</p>
          <p>Card left in Deck: {deck.length}</p>{" "}
          <div className="flex justify-center items-center h-screen w-full gap-[500px]">
            {players.map((player, playerIndex) => (
              <div
                key={playerIndex}
                className="flex flex-col items-center relative"
              >
                <div className="flex relative w-32 h-32 cardHover">
                  {player.hand.map((card, cardIndex) => (
                    <CardWidget
                      key={card.code}
                      card={card}
                      index={cardIndex}
                      currTurn={currTurn === playerIndex}
                      handleOnClick={() =>
                        handleCardClick(playerIndex, cardIndex)
                      }
                    />
                  ))}
                </div>
                <p>{player.name}</p>
                <p>Lives: {player.heart}</p>
                {currTurn === playerIndex ? (
                  <MaterialSymbolsArrowDropUp className="w-20 h-20 rotate-180 ani-float" />
                ) : (
                  <div className="w-20 h-20"></div>
                )}
                {/* <div className="absolute h-full w-full bg-black bg-opacity-50 flex justify-center items-center gap-4">
                  <div className="bg-gray-200 rounded-lg p-8 cursor-pointer">
                    -20
                  </div>
                  <div className="bg-gray-200 rounded-lg p-8 cursor-pointer">
                    +20
                  </div>
                </div> */}
              </div>
            ))}
          </div>
          <MadeByImBanden />
        </div>
        {countDown < 4 && countDown > 0 && (
          <div className="bg-black bg-opacity-50 w-screen h-screen absolute z-0 flex flex-col justify-center items-center gap-2">
            <p className="text-white text-lg">Round {gameRound}</p>
            <p className="text-white text-3xl">Starting in {countDown}</p>
          </div>
        )}
        {powerPlay && (
          <div className="bg-black bg-opacity-50 w-screen h-screen absolute z-0 justify-center items-center gap-16 flex">
            {powerObject[powerPlay as keyof typeof powerObject].map(
              (option, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-8 border-2 border-black text-4xl w-[200px] h-[300px] flex justify-center items-center hover:scale-105 transition-all cursor-pointer"
                  onClick={() => handlePowerOptionClick(option)}
                >
                  {option.name}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </>
  );
}
