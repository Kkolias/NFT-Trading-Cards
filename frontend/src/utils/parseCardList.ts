export function parseCardList(
  cardsUnparsed: [string, bigint, string, string, string, bigint, bigint, string][],
): {
  cardId: string
  id: number
  name: string
  description: string
  imageURI: string
  maxSupply: number
  currentSupply: number
  rarity: string
}[] {
  return cardsUnparsed.map(
    ([cardId, id, name, description, imageURI, maxSupply, currentSupply, rarity]) => ({
      id: Number(id),
      cardId,
      name,
      description,
      imageURI,
      maxSupply: Number(maxSupply),
      currentSupply: Number(currentSupply),
      rarity,
    }),
  )
}
