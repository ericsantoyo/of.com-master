import { formatter } from "@/utils/utils";

export default (props) => {
  const cellValue = props.value;


  if (props.value > 1) {
    return (
      <div
        className="
      text-green-600 
      dark:text-green-400 
      text-md
      font-bold
flex justify-end items-center h-full   tabular-nums  tracking-tighter md:tracking-normal	 "
      >
        {formatter.format(cellValue)}
      </div>
    );
  }

  if (props.value < 1) {
    return (
      <div
        className="
      text-red-500 
      dark:text-red-300 
      text-md
      font-bold
flex justify-end items-center h-full   tabular-nums tracking-tighter	md:tracking-normal  "
      >
        {formatter.format(cellValue)}
      </div>
    );
  }
};


{/* <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Fecha</TableHead>
          <TableHead>$ Cambio</TableHead>
          <TableHead className="text-right">$ Actual</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {valueChanges.map((change, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{formatDate(change.date)}</TableCell>
            <TableCell className={`border px-4 text-xs text-center
                  ${
                    change.valueChange < 0
                      ? "text-red-500 dark:text-red-300 h-full"
                      : "text-green-600 dark:text-green-400 h-full      "
                  }`}>{formatMoney(change.valueChange)}</TableCell>
            <TableCell className="text-right">{formatMoney(change.newValue)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table> */}

    // <table className="table-auto border-collapse m-auto w-auto text-sm">
    //       <thead>
    //         <tr>
    //           <th className="border px-4 py-2">Date</th>
    //           <th className="border px-4 py-2">Value Change</th>
    //           <th className="border px-4 py-2">New Value</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {valueChanges.map((change, index) => (
    //           <tr key={index}>
    //             <td className="border px-2 text-center text-xs">
    //               {formatDate(change.date)}
    //             </td>
    //             <td
    //               className={`border px-4 text-xs text-center
    //               ${
    //                 change.valueChange < 0
    //                   ? "text-red-500 dark:text-red-300 h-full"
    //                   : "text-green-600 dark:text-green-400 h-full      "
    //               }`}
    //             >
    //               {formatMoney(change.valueChange)}
    //             </td>
    //             <td className={`border px-4 text-xs text-center`}>
    //               {formatMoney(change.newValue)}
    //             </td>
    //           </tr>  sm:max-w-[425px]
    //         ))}
    //       </tbody>
    //     </table>