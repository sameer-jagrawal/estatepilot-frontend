import { Loader2 } from "lucide-react";

export default function AdminDataTable({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = "No records found",
  emptyDescription = "Try changing filters or refresh the page.",
  getRowKey,
}) {
  return (
    <div className="overflow-hidden border border-[#DDE5EF] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-[#F6F8FB] text-xs uppercase tracking-[0.05em] text-[#667085]">
            <tr>
              {columns.map((column) => (
                <th key={column.key || column.header} className="border-b border-[#DDE5EF] px-4 py-3 font-medium">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-[#667085]">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold">
                    <Loader2 size={16} className="animate-spin" />
                    Loading records
                  </span>
                </td>
              </tr>
            ) : data.length ? (
              data.map((row, index) => (
                <tr
                  key={getRowKey?.(row) || row?._id || index}
                  className="border-b border-[#DDE5EF] transition last:border-b-0 hover:bg-[#F6F8FB]"
                >
                  {columns.map((column) => (
                    <td key={column.key || column.header} className="px-4 py-3 align-middle text-[#0B1220]">
                      {column.render ? column.render(row, index) : row?.[column.key] || "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <p className="text-sm font-medium text-[#0B1220]">{emptyTitle}</p>
                  <p className="mt-1 text-sm text-[#667085]">{emptyDescription}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
