import Image from "next/image";

export default (props) => {
  const cellValue = props.value;

  

  return (
    <div className="flex items-center h-full">
      <div className="text-gray-800 dark:text-gray-200 text-[12px] font-semibold">
      {cellValue}
      </div>
    </div>
   
  );
};