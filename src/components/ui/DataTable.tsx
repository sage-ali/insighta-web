export interface Column<T extends object> {
  header: string;
  accessor: keyof T;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface DataTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  emptyState?: React.ReactNode;
}

export function DataTable<T extends object>({
  columns,
  data,
  emptyState = <span className="text-slate-500">No data found.</span>,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 border-y border-border-subtle">
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                className="px-6 py-3 text-label-md"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="table-row-hover">
                {columns.map((col) => (
                  <td
                    key={String(col.accessor)}
                    className="px-6 py-4 text-body-md text-slate-600"
                  >
                    {col.render
                      ? col.render(row[col.accessor], row)
                      : String(row[col.accessor] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                {emptyState}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
