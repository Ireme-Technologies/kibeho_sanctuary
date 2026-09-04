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

function localeCode(locale) {
  return String(locale || 'en').toLowerCase().split('-')[0]
}

const PAGE_COPY = {
  en: {
    heroTitle: 'The Messages',
    heading: 'The main themes of the message of Mary, Mother of the Word at Kibeho',
    citation:
      'Cfr: Declaration by the Bishop of Gikongoro concerning the “apparitions of Kibeho”, Gikongoro, June 29, 2001.',
  },
  rw: {
    heroTitle: 'Ubutumwa',
    heading: 'Ingingo z’ingenzi z’ubutumwa bwa Kibeho',
    citation:
      'Reba: Icyemezo cy’Umushumba wa Diyosezi ya Gikongoro gikemura burundu iby’ibonekerwa ry’i Kibeho, Gikongoro, 29 kamena 2001.',
  },
  fr: {
    heroTitle: 'Les Messages',
    heading: 'Les thèmes importants du message de la Mère du Verbe à Kibeho',
    citation:
      'Voir : Déclaration de l’Évêque de Gikongoro portant jugement définitif sur les faits dits « apparitions de Kibeho », Gikongoro, le 29 juin 2001.',
  },
  sw: {
    heroTitle: 'Ujumbe',
    heading: 'Mambo makuu ya ujumbe wa Mama wa Neno kwa Kibeho',
    citation:
      'Tamko la Askofu wa Gikongoro lililokuwa na hukumu ya mwisho juu ya ukweli unaojulikana kama “matokeo ya Kibeho”, Gikongoro, Juni 29, 2001.',
  },
}

function message(number, locales) {
  const en = locales.en
  const translations = {}
  Object.entries(locales).forEach(([code, pack]) => {
    if (code === 'en' || !pack) return
    translations[code] = {
      title: pack.title,
      summary: pack.summary || pack.title,
      blocks: pack.blocks,
    }
  })
  return {
    id: number,
    number,
    sortOrder: number,
    isPublished: true,
    title: en.title,
    summary: en.summary || en.title,
    blocks: en.blocks,
    translations,
  }
}

export const MARY_MESSAGE_THEMES = [
  message(1, {
    en: {
      title: 'An urgent appeal to the repentance and conversion of hearts',
      blocks: [
        {
          type: 'quotes',
          items: ['Repent, repent, repent!', 'Convert while there is still time.'],
        },
      ],
    },
    rw: {
      title: 'Abantu nibisubireho bidatinze, bagarukire Imana',
      blocks: [
        {
          type: 'quotes',
          items: ['Nimwicuze, nimwicuze, nimwicuze!', 'Nimuhinduke inzira zikigendwa.'],
        },
      ],
    },
    fr: {
      title: 'Un urgent appel au repentir et à la conversion des cœurs',
      blocks: [
        {
          type: 'quotes',
          items: ['Repentez-vous, repentez-vous, repentez-vous !', 'Convertissez-vous quand il en est encore temps.'],
        },
      ],
    },
    sw: {
      title: 'Wito wa haraka wa toba na wongofu wa mioyo',
      blocks: [
        {
          type: 'quotes',
          items: ['Tubuni, tubuni, tubuni, ongokeni bado una muda!'],
        },
      ],
    },
  }),
  message(2, {
    en: {
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
    rw: {
      title: 'Nimusenge ubutarambirwa kandi musabire isi kugira ngo ihinduke',
      blocks: [
        {
          type: 'quotes',
          items: [
            'Isi imeze nabi cyane.',
            'Isi yarigometse, nta rukundo n’amahoro yifitemo.',
          ],
        },
        {
          type: 'text',
          text: 'Niba mutisubiyeho ngo muhindure imitima yanyu, mwese mugiye kugwa mu rwobo, ari byo kuvuga guhora mu byago byinshi kandi bidashira.',
        },
      ],
    },
    fr: {
      title: 'Un diagnostic de l’état moral du monde',
      blocks: [
        {
          type: 'quotes',
          items: [
            'Le monde se porte très mal.',
            'Le monde court à sa perte, il va tomber dans un gouffre.',
          ],
        },
        {
          type: 'text',
          text: 'C’est-à-dire être plongé dans des malheurs innombrables et incessants.',
        },
        {
          type: 'quotes',
          items: [
            'Le monde est en rébellion contre Dieu, trop de péchés s’y commettent ; il n’y a pas d’amour ni de paix.',
            'Si vous ne vous repentez pas et ne convertissez pas vos cœurs, vous allez tous tomber dans un gouffre.',
          ],
        },
      ],
    },
    sw: {
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
  }),
  message(3, {
    en: {
      title: 'The deep sorrow of the Virgin Mary',
      blocks: [
        {
          type: 'text',
          text: 'The visionaries said they saw the Virgin Mary in tears on 15 August 1982. The Mother of the Word is greatly afflicted because of the unbelief and impenitence of people. She complains about our bad behaviour, characterised by a dissolution of morals, complacency in evil and continual disobedience to God’s Commandments.',
        },
      ],
    },
    rw: {
      title: 'Agahinda ka Bikira Mariya',
      blocks: [
        {
          type: 'text',
          text: 'Nyina wa Jambo arababaye cyane kubera ukwemera guke n’ukutihana biranga abantu b’iki gihe. Ababajwe kandi n’uko abantu badohotse ku muco mwiza, bakitabira ingeso mbi, bakishimira ikibi, bagahora bica amategeko y’Imana.',
        },
      ],
    },
    fr: {
      title: 'La profonde tristesse de la Vierge Marie',
      blocks: [
        {
          type: 'text',
          text: 'Les voyantes disent l’avoir vue pleurer le 15 août 1982. La Mère du Verbe est fort affligée à cause de l’incrédulité et de l’impénitence des gens. Elle se plaint de notre mauvaise conduite, caractérisée par une dissolution des mœurs, une complaisance dans le mal, une désobéissance continuelle aux Commandements de Dieu.',
        },
      ],
    },
    sw: {
      title: 'Huzuni kubwa ya Bikira Maria',
      blocks: [
        {
          type: 'text',
          text: 'Waonaji walisema walimwona Bikira Maria akilia machozi tarehe 15 Agosti 1982. Mama wa Neno anafadhaika sana kwa sababu ya kutoamini na kutokutubu kwa watu. Analalamika kuhusu tabia yetu mbaya, inayojulikana na kuvunjika kwa maadili, kuridhika katika uovu na kutotii daima amri za Mungu.',
        },
      ],
    },
  }),
  message(4, {
    en: {
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
    rw: {
      title: 'Ukwemera n’ubuhakanyi bizaza mu mayeri',
      blocks: [
        {
          type: 'quotes',
          items: ['Ukwemera n’ubuhakanyi bizaza mu mayeri.'],
        },
      ],
    },
    fr: {
      title: 'La foi et l’incroyance viendront sans qu’on s’en aperçoive',
      blocks: [
        {
          type: 'quotes',
          items: ['La foi et l’incroyance viendront sans qu’on s’en aperçoive.'],
        },
        {
          type: 'text',
          text: 'C’est une des paroles mystérieuses dites plus d’une fois par la Vierge Marie dans les débuts des apparitions, avec la demande de la répéter à tous.',
        },
      ],
    },
    sw: {
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
  }),
  message(5, {
    en: {
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
    rw: {
      title: 'Agaciro k’ububabare mu mibereho y’abantu no mu buzima bwa gikristu',
      blocks: [
        {
          type: 'text',
          text: 'Iyo ngingo ni imena mu zaranze ibonekerwa ry’i Kibeho. Ku mukristu, ububabare ni ngombwa kugira ngo azagere mu ikuzo ry’ijuru.',
        },
        {
          type: 'quotes',
          items: [
            'Ntawe ugera mu ijuru atababaye.',
            'Umwana wa Mariya ntatana n’imibabaro, n’umusaraba.',
          ],
        },
        {
          type: 'text',
          text: 'Kwibabaza ni inzira yo guhongerera icyaha cy’isi no kwifatanya na Yezu na Bikira Mariya mu mibabaro kugira ngo isi ikizwe. Bityo Kibeho ikaba ari urwibutso rw’ahirengeye rw’umwanya w’umusaraba mu buzima bw’umukristu no mu mibereho ya Kiliziya.',
        },
      ],
    },
    fr: {
      title: 'La souffrance salvifique',
      blocks: [
        {
          type: 'text',
          text: 'Ce thème est l’un des plus importants dans l’histoire des apparitions de Kibeho. Pour un chrétien, la souffrance, par ailleurs inévitable dans la vie d’ici-bas, est un chemin obligé pour parvenir à la gloire céleste. La Vierge a dit :',
        },
        {
          type: 'quotes',
          items: [
            'Personne n’arrive au ciel sans souffrir.',
            'L’enfant de Marie ne se sépare pas de la souffrance.',
          ],
        },
        {
          type: 'text',
          text: 'Mais la souffrance est aussi un moyen d’expier pour le péché du monde et de participer aux souffrances de Jésus et de Marie pour le salut du monde. Kibeho est ainsi un rappel de la place de la croix dans la vie du chrétien et de l’Église.',
        },
      ],
    },
    sw: {
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
  }),
  message(6, {
    en: {
      title: 'Pray always and without hypocrisy',
      blocks: [
        {
          type: 'text',
          text: 'People are not praying, and those who do pray do not pray as they should. Mary asks us to pray in abundance for the whole world, to teach others to pray, and to pray for those who do not pray themselves. Mary begs us to pray with greater zeal and purity of heart.',
        },
      ],
    },
    rw: {
      title: 'Nimusenge ubutitsa kandi nta buryarya',
      blocks: [
        {
          type: 'text',
          text: 'Abantu ntibagisenga, kandi no mu basenga, abenshi ntibasenga uko bikwiye. Bikira Mariya yadusabye gusabira isi kenshi, gutoza abandi gusenga no gusenga mu kigwi cy’abadasenga. Aradusaba gusenga tubishyizeho umwete, nta buryarya kandi tubikuye ku mutima.',
        },
      ],
    },
    fr: {
      title: 'Priez sans cesse et sans hypocrisie',
      blocks: [
        {
          type: 'text',
          text: 'Les gens ne prient pas ; et même parmi ceux qui prient, beaucoup ne prient pas comme il faut. La Vierge Marie demande de prier beaucoup pour le monde, d’apprendre aux autres à prier, et de prier à la place de ceux qui ne prient pas. Elle nous demande de mettre plus de zèle à prier, et à prier sans hypocrisie.',
        },
      ],
    },
    sw: {
      title: 'Salini daima bila unafiki',
      blocks: [
        {
          type: 'text',
          text: 'Watu hawaswali, na wale wanaoswali, hawaswali inavyopaswa. Maria anaomba kuomba kwa wingi kwa ajili ya ulimwengu mzima, kuwafundisha wengine kusali, na kuwaombea wale ambao hawajiombi wenyewe. Maria anatusihi tuombe kwa bidii zaidi na usafi wa moyo.',
        },
      ],
    },
  }),
  message(7, {
    en: {
      title: 'Marian devotion expressed through the Rosary',
      blocks: [
        {
          type: 'text',
          text: 'Marian devotion would be expressed through sincere and regular praying of the Rosary.',
        },
      ],
    },
    rw: {
      title: 'Kubaha no kwiyambaza Umubyeyi Bikira Mariya',
      blocks: [
        {
          type: 'text',
          text: 'Hari uburyo bwinshi bwo kumwiyambaza. Bikira Mariya aratugira inama yo kuvuga kenshi ishapure na Rozari tubikuye ku mutima; ni kimwe mu bimushimisha.',
        },
      ],
    },
    fr: {
      title: 'Dévotion envers Marie',
      blocks: [
        {
          type: 'text',
          text: 'La dévotion envers Marie se concrétise notamment par une récitation régulière et sincère du chapelet.',
        },
      ],
    },
    sw: {
      title: 'Maombi na ibada kwa Mama Yetu Bikira Maria',
      blocks: [
        {
          type: 'text',
          text: 'Kuna njia kadhaa za kuomba, hasa Rosari takatifu.',
        },
      ],
    },
  }),
  message(8, {
    en: {
      title: 'The Rosary of the Seven Sorrows of the Virgin Mary',
      blocks: [
        {
          type: 'text',
          text: 'The Blessed Virgin Mary loves this rosary. Well known in the past, it had been forgotten. Our Lady of Kibeho desires for it to be renewed and spread in the Church. However, this prayer does not replace the Holy Rosary.',
        },
      ],
    },
    rw: {
      title: 'Ishapule y’Ububabare burindwi bwa Bikira Mariya',
      blocks: [
        {
          type: 'text',
          text: 'Ni ishapule yigeze kujya ivugwa ariko iza kwibagirana. Bikira Mariya arayikunda cyane kandi yifuza ko yakwitabwaho ikamenyekana muri Kiliziya hose kandi ikavugwa ku isi yose. Ariko iyo shapule ntisimbura Rozari Ntagatifu.',
        },
      ],
    },
    fr: {
      title: 'Le chapelet des Douleurs de la Vierge Marie',
      blocks: [
        {
          type: 'text',
          text: 'La Vierge Marie aime ce chapelet. Connu autrefois, celui-ci était tombé dans l’oubli. Notre-Dame de Kibeho désire qu’il soit remis en honneur et répandu dans l’Église. Mais le chapelet des sept Douleurs ne supplante point le Saint Rosaire.',
        },
      ],
    },
    sw: {
      title: 'Rozari ya Huzuni saba ya Bikira Maria',
      blocks: [
        {
          type: 'text',
          text: 'Bikira Maria anapenda hii rozari ambayo ilikuwa maarufu katika wakati, lakini alikuwa ameanguka wakati huo huo katika usahaulifu. Mama yetu wa Kibeho anatamani arejeshewe heshima na kuenea katika Kanisa. Hata hivyo Rozari ya Huzuni haibadilishi Rozari Takatifu.',
        },
      ],
    },
  }),
  message(9, {
    en: {
      title: 'A chapel in memory of her apparition at Kibeho',
      blocks: [
        {
          type: 'text',
          text: 'Our Lady wants a chapel built in memory of her apparition at Kibeho. It is a theme that goes back to the apparition of 16 January 1982, and returns several times during that year, with new developments.',
        },
      ],
    },
    rw: {
      title: 'Bikira Mariya arashaka ko bamwubakira Shapeli',
      blocks: [
        {
          type: 'text',
          text: 'Bikira Mariya arashaka ko bamwubakira Shapeli ikaba urwibutso ruhoraho rw’uko yabonekeye i Kibeho. Ibyo byatangiye kuvugwa mu ibonekerwa ryo kuwa 16 Mutarama 1982, kandi ntiyahwema kubisubiramo uwo mwaka wose, abisobanura kurushaho.',
        },
      ],
    },
    fr: {
      title: 'Une chapelle en souvenir de son apparition à Kibeho',
      blocks: [
        {
          type: 'text',
          text: 'La Vierge Marie désire qu’on lui construise une chapelle en souvenir de son apparition à Kibeho. C’est un thème qui remonte à l’apparition du 16 janvier 1982 et revient à plusieurs reprises au cours de cette année-là, avec de nouveaux développements.',
        },
      ],
    },
    sw: {
      title: 'Kanisa kwa kumbukumbu ya kuonekana kwake Kibeho',
      blocks: [
        {
          type: 'text',
          text: 'Bikira Maria alitamani kujengwa kwa ajili yake kanisa kwa kumbukumbu ya kuonekana kwake Kibeho. Mada hii ilianza kuonekana Januari 16, 1982 na kurudi mara kadhaa katika mwaka huo, na maendeleo mapya.',
        },
      ],
    },
  }),
  message(10, {
    en: {
      title: 'Pray unceasingly for the Church',
      blocks: [
        {
          type: 'text',
          text: 'Pray unceasingly for the Church, for great tribulations await her in the times to come.',
        },
      ],
    },
    rw: {
      title: 'Gusenga ubutitsa dusabira Kiliziya',
      blocks: [
        {
          type: 'text',
          text: 'Gusenga ubutitsa dusabira Kiliziya, kuko amakuba akomeye ayitegereje mu bihe biri imbere.',
        },
      ],
    },
    fr: {
      title: 'Priez sans relâche pour l’Église',
      blocks: [
        {
          type: 'quotes',
          items: [
            'Priez sans relâche pour l’Église, car de grandes tribulations l’attendent dans les temps qui viennent.',
          ],
        },
      ],
    },
    sw: {
      title: 'Ombeni bila kukoma kwa ajili ya Kanisa',
      blocks: [
        {
          type: 'text',
          text: 'Ombeni bila kukoma kwa ajili ya Kanisa, kwa maana dhiki kuu zinangojea katika nyakati zijazo.',
        },
      ],
    },
  }),
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
  const translations = {}
  Object.entries(row.translations || {}).forEach(([code, pack]) => {
    translations[code] = {
      ...pack,
      body: pack.body || blocksToHtml(pack.blocks),
    }
  })
  return {
    ...row,
    body: blocksToHtml(row.blocks),
    translations,
  }
}

export const MESSAGE_FALLBACKS = MARY_MESSAGE_THEMES.map(withHtml)

export function maryMessagePageCopy(locale) {
  const code = localeCode(locale)
  return PAGE_COPY[code] || {}
}

function localizeTheme(row, locale) {
  const code = localeCode(locale)
  const tr = row.translations?.[code]
  if (!tr || code === 'en') {
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
  const code = localeCode(locale)
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
