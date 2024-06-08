import { formatter } from "@/utils/utils";

export default (props) => {
  const cellValue = props.value;

  if (props.value > 1) {
    return (
      <div className="flex flex-row justify-end h-full tabular-nums tracking-tight md:tracking-normal">
        {formatter.format(cellValue)}
      </div>
    );
  }

  if (props.value < 1) {
    return (
      <div className="flex justify-end items-center md:justify-end h-full tabular-nums tracking-tight md:tracking-normal	">
        {formatter.format(cellValue)}
      </div>
    );
  }
};

