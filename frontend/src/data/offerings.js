/**
 * Candle and Mass offerings — amounts and payment channels.
 * Live values come from Admin settings (`offerings`) when seeded.
 */

export const offerings = {
  candlePriceUsd: 1,
  massPriceUsd: 2.5,
  massPriceEur: 2,
  momoCode: '*182*8*1*060974#',
  momoLabel: 'MoMo Pay',
  onlinePaymentUrl: '',
  onlinePaymentLabel: 'Pay online (card or MoMo)',
  bankLabel: 'Bank transfer (Kibeho bank account)',
  giftAmounts: [10, 25, 50, 100],
  accounts: [
    { bank: 'Bank of Kigali (BK)', name: 'Diocese Gikongoro/Sanct KIBEHO', number: '00266 00690793-01', currency: 'RWF' },
    { bank: 'Bank of Kigali (BK)', name: 'Diocese Gikongoro/Sanct KIBEHO', number: '00266 00690796-02', currency: 'EUR' },
    { bank: 'Bank of Kigali (BK)', name: 'Diocese Gikongoro/Sanct KIBEHO', number: '00266 00690797-03', currency: 'USD' },
    { bank: 'Banque Populaire du Rwanda (BPR)', name: 'Diocese Gikongoro/Sanct KIBEHO', number: '475453520910197', currency: 'RWF' },
  ],
}
