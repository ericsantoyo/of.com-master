export default (props) => {
  const cellValue = props.value;

  if (cellValue === 1) {
    //mark police cells as red
    return <div className="flex justify-center items-center h-full">
      <div className="shadow-sm shadow-neutral-400 dark:shadow-neutral-800 w-9 text-center text-[12px] leading-5  font-semibold rounded bg-gradient-to-r from-[#d85912] to-[#ff7e00] dark:bg-orange-600 text-gray-50">
      POR
      </div>
    </div>
  
  }

  if (cellValue === 2) {
    //mark police cells as red
    return <div className="flex justify-center items-center h-full">
      <div className="shadow-sm shadow-neutral-400 dark:shadow-neutral-800 w-9 text-center text-[12px] leading-5  font-semibold rounded bg-gradient-to-r from-[#8023a7] to-[#ce32dc] dark:bg-purple-600 text-gray-50">
      DEF
      </div>
    </div>
  
  }

  if (cellValue === 3) {
    //mark police cells as red
    return <div className="flex justify-center items-center h-full">
      <div className="shadow-sm shadow-neutral-400 dark:shadow-neutral-800 w-9 text-center text-[12px] leading-5  font-semibold rounded bg-gradient-to-tr from-[#0094ff] to-[#4bafe3] dark:bg-blue-600 text-gray-50">
      CEN
      </div>
    </div>
  
  }

  if (cellValue === 4) {
    //mark police cells as red
    return <div className="flex justify-center items-center h-full">
      <div className="shadow-sm shadow-neutral-400 border-gray-600 dark:shadow-neutral-800 w-9 text-center text-[12px] leading-5  font-semibold rounded bg-gradient-to-tr from-[#ee9015] to-[#f3c832] dark:bg-red-600 text-gray-50">
      DEL
      </div>
    </div>
  
  }

  if (cellValue === 5) {
    //mark police cells as red
    return <div className="flex justify-center items-center h-full">
      <div className="shadow-sm shadow-neutral-400 dark:shadow-neutral-800 w-9 text-center text-[12px] leading-5  font-semibold rounded bg-gradient-to-br from-[#02da67] to-[#449fcf] dark:bg-green-600 text-gray-50">
      ENT
      </div>
    </div>
  
  }
  
};