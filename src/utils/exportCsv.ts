/**
 * Exports data to a CSV file and triggers browser download
 */
export function exportToCsv(filename: string, headers: string[], rows: (string | number | undefined | null)[][]): void {
  const sanitize = (val: string | number | undefined | null) => {
    if (val === null || val === undefined) return '""'
    const stringVal = String(val).replace(/"/g, '""')
    return `"${stringVal}"`
  }

  const csvContent = [
    headers.map(sanitize).join(','),
    ...rows.map(row => row.map(sanitize).join(',')),
  ].join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename.replace(/\.csv$/, '')}_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
