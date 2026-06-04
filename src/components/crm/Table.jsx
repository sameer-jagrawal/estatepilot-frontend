export default function Table({ columns, rows }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-[#F8FAFC] text-[#64748B]">
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col" className="px-5 py-4 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row[0]}-${index}`} className="border-t border-[#E2E8F0]">
                {row.map((cell) => (
                  <td key={`${row[0]}-${cell}`} className="px-5 py-4 text-[#0F172A]">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
