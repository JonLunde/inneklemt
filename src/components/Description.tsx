interface DescriptionProps {
  selectedYear: number;
}

const Description = (props: DescriptionProps) => {
  const { selectedYear } = props;

  return (
    <div
      className={`px-5 py-4 mb-16 sm:mb-20 rounded-xl w-80 sm:w-[32rem] bg-gradient-to-br from-primary-200 to-gray-400 dark:from-secondary-800 dark:to-secondary-800 shadow-lg`}
    >
      <h2 className="text-sm sm:text-xl font-semibold text-center">
        {`Få oversikt over inneklemte dager i ${selectedYear}, slik at du kan få mest mulig
        utbytte av feriedagene dine!`}
      </h2>
    </div>
  );
};

export default Description;
