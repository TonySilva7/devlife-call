export const getWeekDays = () => {
  const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.UTC(2021, 5, i))
    return formatter.format(date)
  }).map((day) => day.charAt(0).toUpperCase() + day.slice(1))
}
