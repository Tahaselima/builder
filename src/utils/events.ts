export function inputValue(event: Event): string {
  return (event.target as HTMLInputElement).value
}

export function inputNumber(event: Event): number {
  return Number((event.target as HTMLInputElement).value)
}
test
