const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

function randomLetters(count: number) {
  let out = ""
  for (let i = 0; i < count; i++) {
    out += LETTERS[Math.floor(Math.random() * LETTERS.length)]
  }
  return out
}

function randomDigits(count: number) {
  let out = ""
  for (let i = 0; i < count; i++) {
    out += Math.floor(Math.random() * 10).toString()
  }
  return out
}

export function generateInvoiceId() {
  return `${randomLetters(2)}${randomDigits(4)}`
}
