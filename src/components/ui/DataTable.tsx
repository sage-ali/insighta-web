export interface Column {
  header: string;
  accessor: string;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column[];
  data: T[];
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="px-4 py-2 text-left text-sm font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="table-row-hover border-b border-slate-200 dark:border-slate-700"
            >
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column.accessor}`}
                  className="px-4 py-2 text-slate-900 dark:text-slate-100"
                >
                  {String(row[column.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
