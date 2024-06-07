const colors = [
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#F333FF',
  '#FF33F3',
  '#33FFF3',
  '#F3FF33',
  '#5733FF',
  '#FF3357',
  '#57FF33',
  '#33F3FF',
  '#FF5733',
  '#5733F3',
  '#33FF57',
  '#3357FF',
  '#FF33F3',
  '#33FFF3',
  '#F333FF',
  '#FF33F3',
  '#33F3FF',
]

export function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length)
  return colors[randomIndex]
}
