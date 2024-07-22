interface CardWidgetProps {
  card: any;
  index: number;
  currTurn: boolean;
  handleOnClick: (value: string) => void;
}

const CardWidget = ({
  card,
  index,
  currTurn,
  handleOnClick,
}: CardWidgetProps) => {
  const cardPosition = {
    0: "-translate-x-[100px]",
    1: "",
    2: "translate-x-[100px]",
  };
  return (
    <div
      className={`w-[200px] cursor-pointer hover:scale-105 hover:-translate-y-[250px] transition-all duration-500 absolute top-0 left-0 zIndex-0 select-none ${
        cardPosition[index as keyof typeof cardPosition]
      } -translate-y-[200px] ${
        currTurn ? "pointer-events-auto" : "pointer-events-none"
      }`}
      onClick={(e) => {
        e.stopPropagation;
        handleOnClick(card.code);
      }}
    >
      <img src={card.image} className="w-full h-full object-contain " />
    </div>
  );
};

export default CardWidget;
