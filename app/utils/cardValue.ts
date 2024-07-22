import React from 'react'

const cardValue = (card: string) => {
    const cardObject: {[key: string]: number} = {
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '0': 10,
        'J': 0,
        'Q': 0,
        'K': 0,
        'A': 0      }
    return cardObject[card.substring(0,1)]
}

export default cardValue