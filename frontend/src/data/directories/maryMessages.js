const LEGACY_TITLES = new Set([
  'Convert while there is still time',
  'Pray the Rosary daily',
  'Offer reparation for sins',
  'Seek reconciliation',
  'Live as children of the Mother of the Word',
  'Repent and return to God',
  'Pray the Seven Sorrows Rosary',
  'Help the poor',
  'Forgive one another',
  'Be witnesses of hope',
])

const PAGE_COPY = {
  en: {
    heading: 'The main themes of the message of Mary, Mother of the Word at Kibeho',
    citation:
      'Cfr: Declaration by the Bishop of Gikongoro concerning the “apparitions of Kibeho”, Gikongoro, June 29, 2001.',
  },
  sw: {
    heading: 'Mambo makuu ya ujumbe wa Mama wa Neno kwa Kibeho',
    citation:
      'Cfr: Tamko la Askofu wa Gikongoro kuhusu “maono ya Kibeho”, Gikongoro, 29 Juni 2001.',
  },
}

function message(number, en, sw) {
  return {
    id: number,
    number,
    sortOrder: number,
    isPublished: true,
    title: en.title,
    summary: en.summary || en.title,
    blocks: en.blocks,
    translations: {
      sw: {
        title: sw.title,
        summary: sw.summary || sw.title,
        blocks: sw.blocks,
      },
    },
  }
}

export const MARY_MESSAGE_THEMES = [
  message(
    1,
    {
      title: 'An urgent appeal to the repentance and conversion of hearts',
      blocks: [
        {
          type: 'quotes',
          items: ['Repent, repent, repent!', 'Convert while there is still time.'],
        },
      ],
    },
    {
      title: 'Wito wa haraka wa toba na wongofu wa mioyo',
      blocks: [
        {
          type: 'quotes',
          items: ['Tubuni, tubuni, tubuni, ongokeni bado una muda!'],
        },
      ],
    },
  ),
  message(
    2,
    {
      title: 'An assessment of the moral state of the world',
      blocks: [
        {
          type: 'quotes',
          items: [
            'The world conducts itself very badly.',
            'The world hastens to its ruin, it will fall into the abyss.',
          ],
        },
        {
          type: 'text',
          text: 'In other words, it is plunged into innumerable and unrelenting disasters.',
        },
        {
          type: 'quotes',
          items: [
            'The world is rebellious against God, it commits too many sins, it has neither love nor peace.',
            'If you do not repent and do not convert your hearts, you will fall into the abyss.',
          ],
        },
      ],
    },
    {
      title: 'Tathmini ya hali ya maadili ya ulimwengu',
      blocks: [
        {
          type: 'quotes',
          items: [
            'Ulimwengu unajiendesha vibaya sana.',
            'Dunia inaharakisha uharibifu wake, itaanguka shimoni.',
          ],
        },
        {
          type: 'text',
          text: 'Kwa maneno mengine, imetumbukizwa katika majanga yasiyoweza kuhesabika na yasiyokoma.',
        },
        {
          type: 'quotes',
          items: [
            'Dunia inamwasi Mungu, inatenda dhambi nyingi sana, haina upendo wala amani.',
            'Ikiwa hamtatubu na kutogeuza mioyo yenu, mtaanguka shimoni.',
          ],
        },
      ],
    },
  ),
  message(
    3,
    {
      title: 'The deep sorrow of the Virgin Mary',
      blocks: [
        {
          type: 'text',
          text: 'The visionaries said they saw the Virgin Mary in tears on 15 August 1982. The Mother of the Word is greatly afflicted because of the unbelief and impenitence of people. She complains about our bad behaviour, characterised by a dissolution of morals, complacency in evil, and continual disobedience to God’s Commandments.',
        },
      ],
    },
    {
      title: 'Huzuni kubwa ya Bikira Maria',
      blocks: [
        {
          type: 'text',
          text: 'Waonaji walisema walimwona Bikira Maria akilia machozi tarehe 15 Agosti 1982. Mama wa Neno anafadhaika sana kwa sababu ya kutoamini na kutokutubu kwa watu. Analalamika kuhusu tabia yetu mbaya, inayojulikana na kuvunjika kwa maadili, kuridhika katika uovu na kutotii daima amri za Mungu.',
        },
      ],
    },
  ),
  message(
    4,
    {
      title: 'Faith and unbelief will come unseen',
      blocks: [
        {
          type: 'quotes',
          items: ['Faith and unbelief will come unseen.'],
        },
        {
          type: 'text',
          text: 'This is one of the mysterious words spoken more than once by Our Lady in the early days of the apparitions, with a request to repeat it to people.',
        },
      ],
    },
    {
      title: 'Imani na kutokuamini vitakuja bila kuonekana',
      blocks: [
        {
          type: 'quotes',
          items: ['Imani na kutokuamini vitakuja bila kuonekana.'],
        },
        {
          type: 'text',
          text: 'Hii ni moja ya maneno ya ajabu yaliyosemwa zaidi ya mara moja na Mama Yetu katika siku za mwanzo za matokeo, na ombi la kurudia kwa watu.',
        },
      ],
    },
  ),
  message(
    5,
    {
      title: 'The suffering that saves',
      blocks: [
        {
          type: 'text',
          text: 'This subject is among the most important among the revelations in Kibeho. Suffering, which is unavoidable in this life, is necessary for Christians to attain eternal glory. On 15 May 1982, the Virgin Mary said:',
        },
        {
          type: 'quotes',
          items: [
            'No one will reach heaven without suffering.',
            'A child of Mary does not reject suffering.',
          ],
        },
        {
          type: 'text',
          text: 'But suffering is also a means of expiating for the sin of the world and of participating in the sufferings of Jesus and Mary for the salvation of the world. Kibeho is thus a reminder of the place of the cross in the life of the Christian and of the Church.',
        },
      ],
    },
    {
      title: 'Mateso yanayookoa',
      blocks: [
        {
          type: 'text',
          text: 'Somo hili ni kati ya muhimu zaidi kati ya mafunuo katika Kibeho. Mateso, ambayo hayaepukiki katika maisha haya, ni muhimu kwa Wakristo kupata utukufu wa milele. Mnamo Mei 15, 1982, Bikira Maria alisema:',
        },
        {
          type: 'quotes',
          items: [
            'Hakuna mtu atakayefika mbinguni bila kuteseka.',
            'Mtoto wa Maria hakatai kuteseka.',
          ],
        },
        {
          type: 'text',
          text: 'Lakini mateso pia ni njia ya kufidia dhambi ya ulimwengu na ya kushiriki katika mateso ya Yesu na Maria kwa wokovu wa ulimwengu. Kwa hiyo, Kibeho ni ukumbusho wa nafasi ya msalaba katika maisha ya Mkristo na Kanisa.',
        },
      ],
    },
  ),
  message(
    6,
    {
      title: 'Pray always and without hypocrisy',
      blocks: [
        {
          type: 'text',
          text: 'People are not praying, and those who do pray do not pray as they should. Mary asks us to pray in abundance for the whole world, to teach others to pray, and to pray for those who do not pray themselves. Mary begs us to pray with greater zeal and purity of heart.',
        },
      ],
    },
    {
      title: 'Salini daima bila unafiki',
      blocks: [
        {
          type: 'text',
          text: 'Watu hawaswali, na wale wanaoswali, hawaswali inavyopaswa. Maria anaomba kuomba kwa wingi kwa ajili ya ulimwengu mzima, kuwafundisha wengine kusali, na kuwaombea wale ambao hawajiombi wenyewe. Maria anatusihi tuombe kwa bidii zaidi na usafi wa moyo.',
        },
      ],
    },
  ),
  message(
    7,
    {
      title: 'Marian devotion expressed through the Rosary',
      blocks: [
        {
          type: 'text',
          text: 'Marian devotion would be expressed through sincere and regular praying of the Rosary.',
        },
      ],
    },
    {
      title: 'Maombi na ibada kwa Mama Yetu Bikira Maria',
      blocks: [
        {
          type: 'text',
          text: 'Kuna njia kadhaa za kuomba, hasa Rosari takatifu.',
        },
      ],
    },
  ),
  message(
    8,
    {
      title: 'The Rosary of the Seven Sorrows of the Virgin Mary',
      blocks: [
        {
          type: 'text',
          text: 'The Blessed Virgin Mary loves this rosary. Well known in the past, it had been forgotten. Our Lady of Kibeho desires for it to be renewed and spread in the Church. However, this prayer does not replace the Holy Rosary.',
        },
      ],
    },
    {
      title: 'Rozari ya Huzuni saba ya Bikira Maria',
      blocks: [
        {
          type: 'text',
          text: 'Bikira Maria anapenda hii rozari ambayo ilikuwa maarufu katika wakati, lakini alikuwa ameanguka wakati huo huo katika usahaulifu. Mama yetu wa Kibeho anatamani arejeshewe heshima na kuenea katika Kanisa. Hata hivyo Rozari ya Huzuni haibadilishi Rozari Takatifu.',
        },
      ],
    },
  ),
  message(
    9,
    {
      title: 'A chapel in memory of her apparition at Kibeho',
      blocks: [
        {
          type: 'text',
          text: 'Our Lady wants a chapel built in memory of her apparition at Kibeho. It is a theme that goes back to the apparition of 16 January 1982, and returns several times during that year, with new developments.',
        },
      ],
    },
    {
      title: 'Kanisa kwa kumbukumbu ya kuonekana kwake Kibeho',
      blocks: [
        {
          type: 'text',
          text: 'Bikira Maria alitamani kujengwa kwa ajili yake kanisa kwa kumbukumbu ya kuonekana kwake Kibeho. Mada hii ilianza kuonekana Januari 16, 1982 na kurudi mara kadhaa katika mwaka huo, na maendeleo mapya.',
        },
      ],
    },
  ),
  message(
    10,
    {
      title: 'Pray unceasingly for the Church',
      blocks: [
        {
          type: 'text',
          text: 'Pray unceasingly for the Church, for great tribulations await her in the times to come.',
        },
      ],
    },
    {
      title: 'Ombeni bila kukoma kwa ajili ya Kanisa',
      blocks: [
        {
          type: 'text',
          text: 'Ombeni bila kukoma kwa ajili ya Kanisa, kwa maana dhiki kuu zinangojea katika nyakati zijazo.',
        },
      ],
    },
  ),
]

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function blocksToHtml(blocks = []) {
  return (blocks || [])
    .map((block) => {
      if (block?.type === 'quotes') {
        return (block.items || [])
          .map((item) => `<blockquote><p>${escapeHtml(item)}</p></blockquote>`)
          .join('')
      }
      if (block?.text) return `<p>${escapeHtml(block.text)}</p>`
      return ''
    })
    .join('')
}

function withHtml(row) {
  const sw = row.translations?.sw || {}
  return {
    ...row,
    body: blocksToHtml(row.blocks),
    translations: {
      ...row.translations,
      sw: {
        ...sw,
        title: sw.title,
        summary: sw.summary,
        body: blocksToHtml(sw.blocks),
      },
    },
  }
}

export const MESSAGE_FALLBACKS = MARY_MESSAGE_THEMES.map(withHtml)

export function maryMessagePageCopy(locale) {
  const code = String(locale || 'en').toLowerCase()
  return PAGE_COPY[code] || PAGE_COPY.en
}

function localizeTheme(row, locale) {
  const code = String(locale || 'en').toLowerCase()
  const tr = row.translations?.[code]
  if (!tr) {
    return {
      ...row,
      body: row.body || blocksToHtml(row.blocks),
    }
  }
  return {
    ...row,
    title: tr.title || row.title,
    summary: tr.summary || row.summary,
    blocks: tr.blocks || row.blocks,
    body: tr.body || blocksToHtml(tr.blocks || row.blocks),
  }
}

export function resolveMaryMessages(apiItems, locale) {
  const code = String(locale || 'en').toLowerCase()
  const bundled = MARY_MESSAGE_THEMES.map((row) => localizeTheme(withHtml(row), locale))
  const apiList = Array.isArray(apiItems) ? apiItems : []

  const merged = bundled.map((row) => {
    const api = apiList.find((item) => Number(item.number) === Number(row.number))
    if (!api) return row

    const englishTitle = String(api.translations?.en?.title || api.title || '').trim()
    const isLegacy = LEGACY_TITLES.has(englishTitle) || LEGACY_TITLES.has(String(api.title || '').trim())
    const localeTitle =
      code === 'en'
        ? String(api.title || '').trim()
        : String(api.translations?.[code]?.title || '').trim()
    const localeBodyRaw = code === 'en' ? api.body : api.translations?.[code]?.body
    const localeBody = String(localeBodyRaw || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    const useApiTitle = Boolean(localeTitle) && !isLegacy
    const useApiBody = Boolean(localeBody) && !isLegacy && localeBody.length > 40

    if (!useApiTitle && !useApiBody) return row

    return {
      ...row,
      title: useApiTitle ? localeTitle : row.title,
      summary: useApiTitle ? api.summary || row.summary : row.summary,
      body: useApiBody ? localeBodyRaw : row.body,
      blocks: useApiBody ? null : row.blocks,
    }
  })

  const extras = apiList.filter(
    (item) => !bundled.some((row) => Number(row.number) === Number(item.number)),
  )

  return [...merged, ...extras]
}
