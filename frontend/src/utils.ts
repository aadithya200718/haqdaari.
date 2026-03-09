/** Format number in Indian locale: 1,23,456 */
export function formatIndianCurrency(amount: number): string {
  return amount.toLocaleString("en-IN");
}

export function formatRupees(amount: number): string {
  return `Rs ${formatIndianCurrency(amount)}`;
}
