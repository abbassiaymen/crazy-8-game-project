export function isValidMove(card, topCard) {
    if (!card || !topCard) return false;
    if (card.rank === 8) return true;
    return card.suit === topCard.suit || card.rank === topCard.rank;
}
