/**
 * Fallback CMS page content (ToR IA).
 * Live content: Admin → Page sections / sanctuary_pages.json seeder.
 */

const page = (partial) => ({
  eyebrow: '',
  title: '',
  subtitle: '',
  heroImage: '',
  intro: '',
  blocks: [],
  links: [],
  cta: null,
  ...partial,
})

export const pageFallbacks = {
  'our-lady.index': page({
      title: "Our Lady of Kibeho",
      subtitle: "The message of conversion, prayer, and reconciliation",
      intro: "Discover the Marian apparitions at Kibeho — the first and, to date, the only Marian apparition site in Africa officially recognised by the Catholic Church.",
      links: [
        {
          label: "The Apparitions",
          path: "/our-lady/apparitions",
        },
        {
          label: "The Visionaries",
          path: "/our-lady/visionaries",
        },
        {
          label: "The Messages",
          path: "/our-lady/messages",
        },
        {
          label: "Church Recognition",
          path: "/our-lady/church-recognition",
        },
        {
          label: "History",
          path: "/our-lady/history",
        },
        {
          label: "Pastoral Team",
          path: "/our-lady/pastoral-team",
        },
        {
          label: "Communities",
          path: "/our-lady/communities",
        },
        {
          label: "FAQ",
          path: "/our-lady/faq",
        },
      ],
      cta: {
        primary: {
          label: "Read the Messages",
          path: "/our-lady/messages",
        },
        secondary: {
          label: "Plan a Pilgrimage",
          path: "/pilgrimage/plan",
        },
      },
    }),

  'our-lady.apparitions': page({
      title: "The Apparitions",
      subtitle: "1981–1989 · Kibeho, Rwanda",
      intro: "Between 1981 and 1989, the Blessed Virgin Mary appeared in Kibeho under the name Nyina wa Jambo — Mother of the Word. The apparitions called the Church and the world to conversion, prayer, and reconciliation.",
      blocks: [
        {
          type: "list",
          items: [
            "Public apparitions beginning on 28 November 1981",
            "A call to conversion of heart and sincere prayer",
            "A prophetic invitation to reconciliation and peace",
            "Recognition of the authenticity of the apparitions by the Church",
          ],
        },
      ],
      cta: {
        primary: {
          label: "The Visionaries",
          path: "/our-lady/visionaries",
        },
        secondary: {
          label: "Church Recognition",
          path: "/our-lady/church-recognition",
        },
      },
    }),

  'our-lady.visionaries': page({
      title: "The Visionaries",
      subtitle: "Those who received the message",
      intro: "The Church recognised the authenticity of the apparitions associated with three visionaries of Kibeho. Their witness continues to invite pilgrims to listen to the Mother of the Word.",
      blocks: [
        {
          type: "cards",
          items: [
            {
              title: "Alphonsine Mumureke",
              text: "The first visionary; apparitions began on 28 November 1981.",
            },
            {
              title: "Nathalie Mukamazimpaka",
              text: "Called to a life of prayer, penance, and redemptive suffering.",
            },
            {
              title: "Marie Claire Mukangango",
              text: "Associated especially with the devotion of the Seven Sorrows Rosary.",
            },
          ],
        },
      ],
      cta: {
        primary: {
          label: "The Messages",
          path: "/our-lady/messages",
        },
        secondary: null,
      },
    }),

  'our-lady.messages': page({
      title: "The Messages",
      subtitle: "Mother of the Word",
      intro: "Our Lady of Kibeho invites conversion of the heart, the prayer of the Rosary — especially the Seven Sorrows — and a life of love, repentance, and reconciliation.",
      blocks: [
        {
          type: "list",
          items: [
            "Convert while there is still time",
            "Pray the Rosary and the Seven Sorrows Rosary",
            "Love one another and seek reconciliation",
            "Live the Gospel with humility and fidelity",
          ],
        },
      ],
      cta: {
        primary: {
          label: "Seven Sorrows Rosary",
          path: "/spirituality/seven-sorrows-rosary",
        },
        secondary: {
          label: "Official Prayers",
          path: "/spirituality/official-prayers",
        },
      },
    }),

  'our-lady.church-recognition': page({
      title: "Church Recognition",
      subtitle: "Declared authentic by the Catholic Church",
      intro: "The Diocese of Gikongoro, after careful investigation, declared the apparitions of Kibeho authentic. Kibeho is the first — and to date the only — Marian apparition site in Africa officially recognised by the Church.",
      cta: {
        primary: {
          label: "History",
          path: "/our-lady/history",
        },
        secondary: {
          label: "Welcome to the Shrine",
          path: "/shrine/welcome",
        },
      },
    }),

  'our-lady.history': page({
      title: "History",
      subtitle: "From the apparitions to the shrine today",
      intro: "From the first apparitions in 1981 through Church recognition and the growth of pilgrimage, Kibeho has become a place of prayer for Rwanda and for the universal Church.",
      blocks: [
        {
          type: "list",
          items: [
            "1981 — First apparitions at Kibeho",
            "1982–1989 — Continuing apparitions and public witness",
            "2001 — Declaration of authenticity by the Bishop of Gikongoro",
            "Today — An international shrine welcoming pilgrims worldwide",
          ],
        },
      ],
      cta: {
        primary: {
          label: "FAQ",
          path: "/our-lady/faq",
        },
        secondary: null,
      },
    }),

  'our-lady.pastoral-team': page({
      title: 'Pastoral Team',
      subtitle: 'Those who serve pilgrims at the Shrine',
      intro: 'Meet the priests and pastoral workers who welcome pilgrims, celebrate the liturgy, and accompany the life of the Shrine of Our Lady of Kibeho.',
      heroImage: '/images/sanctuary/welcome.jpg',
    }),

  'our-lady.communities': page({
      title: 'Communities around Kibeho',
      subtitle: 'Parishes, villages, and religious houses near the Shrine',
      intro: 'The message of Our Lady of Kibeho is lived first among the people of this hillside — parish families, neighbouring communities, and religious houses who welcome pilgrims year-round.',
      heroImage: '/images/sanctuary/hills.jpg',
    }),

  'our-lady.faq': page({
      title: "Frequently Asked Questions",
      subtitle: "About Our Lady of Kibeho and the Shrine",
      intro: "Answers to common questions about the apparitions, recognition by the Church, pilgrimage, and life at the Shrine.",
      blocks: [
        {
          type: "cards",
          items: [
            {
              title: "Are the apparitions recognised?",
              text: "Yes. The Catholic Church has declared authentic the apparitions associated with the three recognised visionaries of Kibeho.",
            },
            {
              title: "Who can visit the Shrine?",
              text: "Pilgrims from Rwanda and every nation are welcome. Groups are encouraged to contact the Pilgrimage Office in advance.",
            },
            {
              title: "What is the main message?",
              text: "Conversion, prayer (especially the Rosary and Seven Sorrows), and reconciliation — living the Gospel with sincerity.",
            },
            {
              title: "How can I support the Shrine?",
              text: "Through prayer, pilgrimage, partnership, and donations toward pastoral life and the Master Plan.",
            },
          ],
        },
      ],
      cta: {
        primary: {
          label: "Contact the Pilgrimage Office",
          path: "/pilgrimage/office",
        },
        secondary: {
          label: "Support the Shrine",
          path: "/support",
        },
      },
    }),

  'shrine.index': page({
      title: "The Shrine",
      subtitle: "A living place of prayer on the hills of Kibeho",
      intro: "<p>The Shrine of Our Lady of Kibeho welcomes pilgrims who come to pray, to celebrate the sacraments, and to walk the places linked to the apparitions of the Mother of the Word. Here the Church gathers each day — and, on feast days, from across Rwanda and the world.</p>",
      blocks: [
        {
          type: "heading",
          text: "Life of prayer",
        },
        {
          type: "paragraph",
          text: "<p>Holy Mass, the Rosary, confession, and times of silence shape the ordinary day at the Shrine. On Marian feasts and major pilgrimages the liturgy is extended, and the grounds fill with parishes, dioceses, and visitors from many nations.</p>",
        },
        {
          type: "heading",
          text: "Places to visit",
        },
        {
          type: "paragraph",
          text: "<p>Begin with a welcome and orientation, then move through the churches, apparition sites, Holy Spring, and Way of the Cross at a prayerful pace. The Mass schedule and shrine map will help you plan the day.</p>",
        },
        {
          type: "cards",
          items: [
            { title: "Welcome", text: "<p>Arrive in peace. Find orientation, pilgrim reception, and a first invitation to prayer.</p>", path: "/shrine/welcome" },
            { title: "Churches", text: "<p>Chapels and churches where the liturgical and pastoral life of the Shrine is celebrated.</p>", path: "/shrine/churches" },
            { title: "Apparition Sites", text: "<p>The places remembered for the apparitions of Our Lady of Kibeho — spaces of silence and thanksgiving.</p>", path: "/shrine/apparition-sites" },
            { title: "Holy Spring", text: "<p>Pilgrims come to the water in faith — a sign of God’s grace and a call to trust.</p>", path: "/shrine/holy-spring" },
            { title: "Way of the Cross", text: "<p>Walk the Stations with Christ, in the company of Our Lady of Sorrows.</p>", path: "/shrine/way-of-the-cross" },
            { title: "Eucharistic Adoration", text: "<p>Remain in silent prayer before the Blessed Sacrament, for your intentions and for the world.</p>", path: "/shrine/eucharistic-adorations" },
            { title: "Mass Schedule", text: "<p>Daily and festal Mass times for pilgrims and the local community. Confirm feast-day hours before you travel.</p>", path: "/shrine/mass-schedule" },
            { title: "Shrine Map", text: "<p>Find churches, apparition sites, the Holy Spring, the Way of the Cross, and pilgrim facilities.</p>", path: "/shrine/map" },
          ],
        },
        {
          type: "note",
          text: "<p>Group visits are asked to contact the Pilgrimage Office so liturgy, lodging, and a fitting welcome can be prepared.</p>",
        },
      ],
      links: [],
      cta: {
        primary: {
          label: "Mass Schedule",
          path: "/shrine/mass-schedule",
        },
        secondary: {
          label: "Plan your Pilgrimage",
          path: "/pilgrimage/plan",
        },
      },
    }),

  'shrine.welcome': page({
      title: "Welcome",
      subtitle: "You are welcome at Kibeho",
      heroImage: "/images/sanctuary/welcome.jpg",
      intro: "The Shrine of Our Lady of Kibeho welcomes pilgrims from Rwanda and around the world. Come to pray, to celebrate the sacraments, and to encounter the Mother of the Word.",
      cta: {
        primary: {
          label: "Practical Information",
          path: "/pilgrimage/practical-information",
        },
        secondary: {
          label: "Pilgrimage Office",
          path: "/pilgrimage/office",
        },
      },
    }),

  'shrine.churches': page({
      title: "Churches",
      subtitle: "Places of worship at the Shrine",
      heroImage: "/images/sanctuary/church.jpg",
      intro: "Discover the churches and chapels that serve the liturgical and pastoral life of the Shrine of Our Lady of Kibeho.",
      cta: {
        primary: {
          label: "Mass Schedule",
          path: "/shrine/mass-schedule",
        },
        secondary: null,
      },
    }),

  'shrine.apparition-sites': page({
      title: "Apparition Sites",
      subtitle: "Where Our Lady appeared",
      intro: "Visit the places associated with the apparitions of Our Lady of Kibeho — spaces of silence, prayer, and remembrance of the Mother of the Word.",
      cta: {
        primary: {
          label: "The Apparitions",
          path: "/our-lady/apparitions",
        },
        secondary: {
          label: "Shrine Map",
          path: "/shrine/map",
        },
      },
    }),

  'shrine.holy-spring': page({
      title: "Holy Spring",
      subtitle: "The Water of Kibeho",
      heroImage: "/images/sanctuary/activity-spring.jpg",
      intro: "Pilgrims come to the Holy Spring in faith — a sign of God’s grace and a call to interior purification and trust.",
      cta: {
        primary: {
          label: "Activities at the Shrine",
          path: "/activities",
        },
        secondary: {
          label: "Welcome",
          path: "/shrine/welcome",
        },
      },
    }),

  'shrine.way-of-the-cross': page({
      title: "Way of the Cross",
      subtitle: "Walking with Christ",
      intro: "Pray the Way of the Cross at the Shrine — a path of meditation on the Passion of Christ in the company of Our Lady of Sorrows.",
      cta: {
        primary: {
          label: "Seven Sorrows Rosary",
          path: "/spirituality/seven-sorrows-rosary",
        },
        secondary: {
          label: "Meditations",
          path: "/spirituality/meditations",
        },
      },
    }),

  'shrine.eucharistic-adorations': page({
      title: "Eucharistic Adorations",
      subtitle: "Stay with Me",
      intro: "Join times of Eucharistic Adoration at the Shrine — silent prayer before the Blessed Sacrament, for personal intentions and for the world.",
      cta: {
        primary: {
          label: "Mass Schedule",
          path: "/shrine/mass-schedule",
        },
        secondary: {
          label: "Request a Mass",
          path: "/spirituality/request-a-mass",
        },
      },
    }),

  'shrine.mass-schedule': page({
      title: "Mass Schedule",
      subtitle: "Liturgical life of the Shrine",
      intro: "Join the daily and festal celebration of Holy Mass at the Shrine of Our Lady of Kibeho. Schedules may vary on feast days and major pilgrimages — confirm with the Pilgrimage Office when planning a group visit.",
      blocks: [
        {
          type: "cards",
          items: [
            {
              title: "Weekdays",
              text: "Morning Mass — times announced locally and by the Pilgrimage Office.",
            },
            {
              title: "Sundays & solemnities",
              text: "Principal Masses for pilgrims and the local community.",
            },
            {
              title: "Confessions",
              text: "Available according to the pastoral schedule, especially before major celebrations.",
            },
            {
              title: "Feast days",
              text: "Extended liturgy during Marian feasts and national or international pilgrimages.",
            },
          ],
        },
      ],
      cta: {
        primary: {
          label: "Contact the Pilgrimage Office",
          path: "/pilgrimage/office",
        },
        secondary: {
          label: "Calendar",
          path: "/pilgrimage/calendar",
        },
      },
    }),

  'shrine.map': page({
      title: "Shrine Map",
      subtitle: "Find your way around the Shrine",
      intro: "An interactive map of the Shrine grounds is planned. For now, ask at the Pilgrimage Office for orientation to churches, apparition sites, the Holy Spring, and pilgrim facilities.",
      blocks: [
        {
          type: "list",
          items: [
            "Churches and chapels",
            "Apparition sites",
            "Holy Spring",
            "Way of the Cross",
            "Pilgrim reception and facilities",
          ],
        },
      ],
      cta: {
        primary: {
          label: "Welcome",
          path: "/shrine/welcome",
        },
        secondary: {
          label: "Getting here",
          path: "/pilgrimage/transportation",
        },
      },
    }),

  'pilgrimage.index': page({
      title: "Pilgrimage",
      subtitle: "Prepare your journey to Kibeho",
      intro: "Whether you come alone, with family, or with a parish group, the Shrine welcomes you. Prepare spiritually and practically for your pilgrimage.",
      links: [
        {
          label: "Why Kibeho?",
          path: "/pilgrimage/why-kibeho",
        },
        {
          label: "Plan your Pilgrimage",
          path: "/pilgrimage/plan",
        },
        {
          label: "Accommodation",
          path: "/pilgrimage/accommodation",
        },
        {
          label: "Transportation",
          path: "/pilgrimage/transportation",
        },
        {
          label: "Pilgrimage Office",
          path: "/pilgrimage/office",
        },
        {
          label: "Calendar",
          path: "/pilgrimage/calendar",
        },
        {
          label: "Practical Information",
          path: "/pilgrimage/practical-information",
        },
      ],
      cta: {
        primary: {
          label: "Plan your Pilgrimage",
          path: "/pilgrimage/plan",
        },
        secondary: {
          label: "Pilgrimage events",
          path: "/pilgrimages",
        },
      },
    }),

  'pilgrimage.why-kibeho': page({
      title: "Why Kibeho?",
      subtitle: "A recognised Marian shrine in Africa",
      intro: "Pilgrims come to Kibeho to encounter Our Lady, Mother of the Word — to pray for conversion, peace, and reconciliation, and to renew their life in Christ.",
      blocks: [
        {
          type: "cards",
          items: [
            {
              title: "Recognised by the Church",
              text: "The only Marian apparition site in Africa officially recognised by the Catholic Church.",
            },
            {
              title: "A call to conversion",
              text: "The message of Kibeho invites a sincere return to God and to one another.",
            },
            {
              title: "A living shrine",
              text: "Liturgy, prayer, and hospitality for pilgrims from every nation.",
            },
          ],
        },
      ],
      cta: {
        primary: {
          label: "Plan your Pilgrimage",
          path: "/pilgrimage/plan",
        },
        secondary: null,
      },
    }),

  'pilgrimage.plan': page({
      title: "Plan your Pilgrimage",
      subtitle: "Spiritual and practical preparation",
      intro: "Prepare your heart through prayer, and organise travel, accommodation, and liturgy with the Pilgrimage Office — especially for groups and international pilgrims.",
      blocks: [
        {
          type: "list",
          items: [
            "Contact the Pilgrimage Office with dates and group size",
            "Arrange accommodation and transportation",
            "Prepare spiritually: Mass, Confession, Rosary",
            "Review practical guidelines for the Shrine",
          ],
        },
      ],
      cta: {
        primary: {
          label: "Pilgrimage Office",
          path: "/pilgrimage/office",
        },
        secondary: {
          label: "Register interest",
          path: "/pilgrimages",
        },
      },
    }),

  'pilgrimage.accommodation': page({
      title: "Accommodation",
      subtitle: "Places to stay near the Shrine",
      intro: "Find guest houses, retreat centres, and hotels near Kibeho. The Pilgrimage Office can advise groups on suitable options.",
      cta: {
        primary: {
          label: "Browse facilities",
          path: "/hotels",
        },
        secondary: {
          label: "Contact the Office",
          path: "/pilgrimage/office",
        },
      },
    }),

  'pilgrimage.transportation': page({
      title: "Transportation",
      subtitle: "How to reach Kibeho",
      intro: "Kibeho is in Nyaruguru District, Southern Province, Rwanda. Pilgrims typically travel via Kigali or regional towns. Group organisers should plan transfers in advance.",
      blocks: [
        {
          type: "list",
          items: [
            "International arrivals via Kigali International Airport",
            "Road travel to Nyaruguru / Kibeho",
            "Local guidance available through the Pilgrimage Office",
          ],
        },
      ],
      cta: {
        primary: {
          label: "Practical Information",
          path: "/pilgrimage/practical-information",
        },
        secondary: {
          label: "Contact",
          path: "/contact",
        },
      },
    }),

  'pilgrimage.office': page({
      title: "Pilgrimage Office",
      subtitle: "Your first point of contact",
      intro: "The Pilgrimage Office assists individuals and groups with visit planning, liturgical arrangements, and practical questions about the Shrine.",
      blocks: [
        {
          type: "cards",
          items: [
            {
              title: "Group pilgrimages",
              text: "Schedule, liturgy, and hospitality coordination.",
            },
            {
              title: "International pilgrims",
              text: "Guidance for travel, language, and pastoral accompaniment.",
            },
            {
              title: "General enquiries",
              text: "Mass times, shrine life, and visitor information.",
            },
          ],
        },
      ],
      cta: {
        primary: {
          label: "Contact us",
          path: "/contact",
        },
        secondary: {
          label: "Pilgrimage events",
          path: "/pilgrimages",
        },
      },
    }),

  'pilgrimage.calendar': page({
      title: "Pilgrimage events",
      subtitle: "Feast days, parish visits, and gatherings of the Church",
      intro: "<p>This calendar lists public pilgrimages and celebrations at the Shrine of Our Lady of Kibeho. Open an event for dates, the spirit of the day, and a way to register your group or your own pilgrimage.</p>",
      blocks: [
        {
          type: "heading",
          text: "How to take part",
        },
        {
          type: "paragraph",
          text: "<p>Individuals, families, and parish groups are welcome. Register so the Pilgrimage Office can share the programme, guide you on lodging, and receive you with care. Times may change around major feasts — confirm before you travel.</p>",
        },
        {
          type: "cards",
          items: [
            { title: "Marian feast days", text: "<p>Annual celebrations such as the Assumption, with Mass, procession, confession, and thanksgiving.</p>" },
            { title: "National and international pilgrimages", text: "<p>Days when dioceses, movements, and visitors from beyond Rwanda pray together at Kibeho.</p>" },
            { title: "Youth and parish gatherings", text: "<p>Pilgrimages prepared for young people and for parish groups walking together in faith.</p>" },
          ],
        },
        {
          type: "note",
          text: "<p>Need a date that is not listed? Write to the Pilgrimage Office. Private parish visits can often be arranged alongside the public calendar.</p>",
        },
      ],
      cta: {
        primary: {
          label: "View pilgrimage events",
          path: "/pilgrimages",
        },
        secondary: {
          label: "Mass Schedule",
          path: "/shrine/mass-schedule",
        },
      },
    }),

  'pilgrimage.practical-information': page({
      title: "Practical Information",
      subtitle: "What pilgrims need to know",
      intro: "Guidelines for dress, conduct, photography, offerings, and the rhythm of prayer at the Shrine — so every visit remains reverent and fruitful.",
      blocks: [
        {
          type: "list",
          items: [
            "Dress modestly for liturgical celebrations",
            "Maintain silence in places of prayer",
            "Follow guidance of shrine staff and security",
            "Confirm group schedules with the Pilgrimage Office",
          ],
        },
      ],
      cta: {
        primary: {
          label: "Welcome",
          path: "/shrine/welcome",
        },
        secondary: {
          label: "Plan your Pilgrimage",
          path: "/pilgrimage/plan",
        },
      },
    }),

  'spirituality.index': page({
      title: "Spirituality",
      subtitle: "Pray with the Shrine — near or far",
      intro: "Deepen your spiritual life with the prayers, rosaries, novenas, and pastoral invitations of Our Lady of Kibeho. You may also send prayer intentions and request Masses.",
      links: [
        {
          label: "Prayer Intentions",
          path: "/spirituality/prayer-intentions",
        },
        {
          label: "Request a Mass",
          path: "/spirituality/request-a-mass",
        },
        {
          label: "Rosary",
          path: "/spirituality/rosary",
        },
        {
          label: "Seven Sorrows Rosary",
          path: "/spirituality/seven-sorrows-rosary",
        },
        {
          label: "Novena",
          path: "/spirituality/novena",
        },
        {
          label: "Official Prayers",
          path: "/spirituality/official-prayers",
        },
        {
          label: "Meditations",
          path: "/spirituality/meditations",
        },
        {
          label: "Testimonies",
          path: "/spirituality/testimonies",
        },
      ],
      cta: {
        primary: {
          label: "Seven Sorrows Rosary",
          path: "/spirituality/seven-sorrows-rosary",
        },
        secondary: {
          label: "Prayer Intentions",
          path: "/spirituality/prayer-intentions",
        },
      },
    }),

  'spirituality.prayer-intentions': page({
      title: "Light a candle",
      subtitle: "A light for someone you love",
      intro: "<p>Leave a light burning at Kibeho — a prayer you do not have to find words for.</p>",
      blocks: [
        {
          type: "note",
          text: "<p>USD 1 per candle. Send this request by email or WhatsApp so the Pilgrimage Office has your intention. In Rwanda, tap MoMo Pay to open the dialer. From abroad, pay online when that link is ready — until then, use a bank transfer.</p>",
        },
      ],
      cta: {
        primary: {
          label: "Have a Mass said",
          path: "/spirituality/request-a-mass",
        },
        secondary: {
          label: "Donations",
          path: "/support/donations",
        },
      },
    }),

  'spirituality.request-a-mass': page({
      title: "Have a Mass said",
      subtitle: "An offering for a loved one, an intention, or a cause",
      intro: "<p>Have Holy Mass offered at the Shrine for a loved one, an intention, or a cause.</p>",
      blocks: [
        {
          type: "note",
          text: "<p>Send the intention by email or WhatsApp, then complete payment. The Pilgrimage Office will confirm your Mass once the offering is received.</p>",
        },
      ],
      cta: {
        primary: {
          label: "Light a candle",
          path: "/spirituality/prayer-intentions",
        },
        secondary: {
          label: "Mass Schedule",
          path: "/shrine/mass-schedule",
        },
      },
    }),

  'spirituality.rosary': page({
      title: "Rosary",
      subtitle: "Pray with Mary",
      intro: "Our Lady of Kibeho calls the faithful to pray the Rosary with faith and perseverance — a path of contemplation of the mysteries of Christ.",
      cta: {
        primary: {
          label: "Seven Sorrows Rosary",
          path: "/spirituality/seven-sorrows-rosary",
        },
        secondary: {
          label: "Official Prayers",
          path: "/spirituality/official-prayers",
        },
      },
    }),

  'spirituality.seven-sorrows-rosary': page({
      title: "Seven Sorrows Rosary",
      subtitle: "A devotion especially linked to Kibeho",
      intro: "Our Lady asked for the prayer of the Seven Sorrows Rosary — meditating on the sorrows of Mary and uniting our hearts to her Son.",
      blocks: [
        {
          type: "list",
          items: [
            "The Prophecy of Simeon",
            "The Flight into Egypt",
            "The Loss of the Child Jesus in the Temple",
            "Mary meets Jesus on the Way of the Cross",
            "The Crucifixion",
            "Mary receives the Body of Jesus",
            "The Burial of Jesus",
          ],
        },
      ],
      cta: {
        primary: {
          label: "The Messages",
          path: "/our-lady/messages",
        },
        secondary: {
          label: "Novena",
          path: "/spirituality/novena",
        },
      },
    }),

  'spirituality.novena': page({
      title: "Novena",
      subtitle: "Nine days of prayer with Our Lady of Kibeho",
      intro: "Pray a novena to Our Lady of Kibeho for conversion, peace, healing, and the needs of the Church and the world.",
      cta: {
        primary: {
          label: "Official Prayers",
          path: "/spirituality/official-prayers",
        },
        secondary: {
          label: "Prayer Intentions",
          path: "/spirituality/prayer-intentions",
        },
      },
    }),

  'spirituality.official-prayers': page({
      title: "Official Prayers",
      subtitle: "Prayers of the Shrine",
      intro: "Official prayers associated with the Shrine of Our Lady of Kibeho — for personal devotion and communal prayer.",
      cta: {
        primary: {
          label: "Meditations",
          path: "/spirituality/meditations",
        },
        secondary: {
          label: "Rosary",
          path: "/spirituality/rosary",
        },
      },
    }),

  'spirituality.meditations': page({
      title: "Meditations",
      subtitle: "Reflect on the Word and the message of Kibeho",
      intro: "Spiritual meditations to accompany pilgrimage, the liturgical year, and daily prayer with Our Lady of Kibeho.",
      cta: {
        primary: {
          label: "Testimonies",
          path: "/spirituality/testimonies",
        },
        secondary: {
          label: "The Messages",
          path: "/our-lady/messages",
        },
      },
    }),

  'spirituality.testimonies': page({
      title: "Testimonies",
      subtitle: "Fruits of grace at Kibeho",
      intro: "Pilgrims share how prayer at the Shrine has renewed faith, brought peace, and opened paths of reconciliation. Submit your testimony through the Pilgrimage Office.",
      cta: {
        primary: {
          label: "Share a testimony",
          path: "/contact",
        },
        secondary: {
          label: "News",
          path: "/news",
        },
      },
    }),

  'news.videos': page({
      title: "Videos",
      subtitle: "Watch and pray with the Shrine",
      intro: "Video messages, liturgical celebrations, and documentary material from the Shrine will be gathered here. Follow our YouTube channel and gallery for current media.",
      cta: {
        primary: {
          label: "Photo Gallery",
          path: "/gallery",
        },
        secondary: {
          label: "Latest News",
          path: "/news",
        },
      },
    }),

  'support.index': page({
      title: "Support the Shrine",
      subtitle: "Pastoral mission and sustainable development",
      intro: "Unlike long-established pilgrimage sites, Kibeho is still developing. Your partnership helps proclaim the message, welcome pilgrims, and build the infrastructure of the Shrine for generations to come.",
      blocks: [
        {
          type: "cards",
          items: [
            {
              title: "Onsite services",
              text: "Light a candle, have a Mass said, or register for a pilgrimage. These requests go to the Pilgrimage Office.",
              path: "/spirituality/prayer-intentions",
            },
            {
              title: "Give to the mission",
              text: "Support the Shrine generally, or choose a specific development project.",
              path: "/support/donations",
            },
            {
              title: "Partnership",
              text: "Parishes, communities, and organisations walking with the Shrine in prayer, pilgrimage, and collaboration.",
              path: "/support/partners",
            },
          ],
        },
      ],
      links: [
        {
          label: "Vision",
          path: "/support/vision",
        },
        {
          label: "Master Plan",
          path: "/support/master-plan",
        },
        {
          label: "Projects",
          path: "/support/projects",
        },
        {
          label: "Donations",
          path: "/support/donations",
        },
        {
          label: "Annual Reports",
          path: "/support/annual-reports",
        },
        {
          label: "Transparency",
          path: "/support/transparency",
        },
        {
          label: "Partners",
          path: "/support/partners",
        },
      ],
      cta: {
        primary: {
          label: "Master Plan",
          path: "/support/master-plan",
        },
        secondary: {
          label: "Donate",
          path: "/support/donations",
        },
      },
    }),

  'support.vision': page({
      title: "Vision",
      subtitle: "The official digital and pastoral gateway of the Shrine",
      intro: "The Diocese of Gikongoro wishes the Shrine to welcome pilgrims from every nation, proclaim the message of Our Lady of Kibeho, and sustain long-term pastoral, spiritual, and infrastructural development.",
      cta: {
        primary: {
          label: "Master Plan",
          path: "/support/master-plan",
        },
        secondary: {
          label: "Partners",
          path: "/support/partners",
        },
      },
    }),

  'support.master-plan': page({
      title: "Master Plan",
      subtitle: "Building the future of the Shrine",
      intro: "The Master Plan guides future infrastructure, pilgrim hospitality, pastoral facilities, and environmental care at Kibeho. Detailed plans and project phases will be published here as they are approved.",
      blocks: [
        {
          type: "list",
          items: [
            "Pilgrim reception and hospitality",
            "Liturgical and pastoral facilities",
            "Infrastructure and accessibility",
            "Environmental stewardship",
            "International partnership opportunities",
          ],
        },
      ],
      cta: {
        primary: {
          label: "Projects",
          path: "/support/projects",
        },
        secondary: {
          label: "Donate",
          path: "/support/donations",
        },
      },
    }),

  'support.projects': page({
      title: "Sanctuary projects",
      subtitle: "These works still need hands, prayer, and friends",
      intro: "<p>Kibeho is still becoming the place of welcome Our Lady asked for. Each project is a door you can walk through — with a gift, a pledge, or a partnership.</p>",
      cta: {
        primary: {
          label: "Master Plan",
          path: "/support/master-plan",
        },
        secondary: {
          label: "Transparency",
          path: "/support/transparency",
        },
      },
    }),

  'support.donations': page({
      eyebrow: "Support the Shrine",
      title: "Give to the mission",
      subtitle: "Walk with every pilgrim who comes to pray",
      intro: "<p>Kibeho is still becoming the place of welcome Our Lady asked for. Your gift walks with every pilgrim who comes to pray.</p>",
      cta: {
        primary: {
          label: "Contact us",
          path: "/contact",
        },
        secondary: {
          label: "Light a candle",
          path: "/spirituality/prayer-intentions",
        },
      },
    }),

  'support.annual-reports': page({
      title: "Annual Reports",
      subtitle: "Accountability to pilgrims and partners",
      intro: "Annual reports of the Shrine and related development initiatives will be published here to keep the faithful and partners informed.",
      cta: {
        primary: {
          label: "Transparency",
          path: "/support/transparency",
        },
        secondary: {
          label: "Partners",
          path: "/support/partners",
        },
      },
    }),

  'support.transparency': page({
      title: "Transparency",
      subtitle: "Trust in the service of the Gospel",
      intro: "The Diocese of Gikongoro is committed to transparent stewardship of gifts received for the Shrine — with clear reporting on pastoral priorities and development projects.",
      cta: {
        primary: {
          label: "Annual Reports",
          path: "/support/annual-reports",
        },
        secondary: {
          label: "Donate",
          path: "/support/donations",
        },
      },
    }),

  'support.partners': page({
      title: "Partners",
      subtitle: "Walking together with the Shrine",
      intro: "<p>Parishes, religious communities, dioceses, and friends of Kibeho worldwide support the mission through prayer, pilgrimage, and collaboration. Send a partnership enquiry below. If the partnership includes a gift, use Donations or a specific project so the office can match it.</p>",
      cta: {
        primary: {
          label: "Give to the mission",
          path: "/support/donations",
        },
        secondary: {
          label: "Vision",
          path: "/support/vision",
        },
      },
    }),

  'faq.index': page({
      title: "FAQ",
      subtitle: "Common questions",
      intro: "See the FAQ under Our Lady of Kibeho for answers about the apparitions, recognition, and visiting the Shrine.",
      cta: {
        primary: {
          label: "Our Lady of Kibeho FAQ",
          path: "/our-lady/faq",
        },
        secondary: null,
      },
    }),

  'hotels.index': page({
      title: "Accommodation near the Shrine",
      subtitle: "Guest houses, hotels, and facilities",
      intro: "Browse places to stay and related facilities near the Shrine of Our Lady of Kibeho.",
      cta: {
        primary: {
          label: "Pilgrimage accommodation guide",
          path: "/pilgrimage/accommodation",
        },
        secondary: {
          label: "Pilgrimage Office",
          path: "/pilgrimage/office",
        },
      },
    }),

}

export function getPageFallback(key) {
  return pageFallbacks[key] || null
}
