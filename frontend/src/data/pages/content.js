/**
 * Fallback CMS page content (ToR IA).
 * Live content: Admin → Page sections / sanctuary_pages.json seeder.
 */

const page = (partial) => ({
  eyebrow: '',
  title: '',
  subtitle: '',
  heroImage: '',
  footerImage: '',
  footerImageAlt: '',
  intro: '',
  blocks: [],
  links: [],
  cta: null,
  ...partial,
})

export const pageFallbacks = {
  'our-lady.index': page({
      title: "Our Lady of Kibeho",
      subtitle: "Nyina wa Jambo — Mother of the Word",
      heroCtaLabel: "Read the Apparitions",
      heroCtaPath: "/our-lady/apparitions",
      seoDescription:
        "Our Lady of Kibeho — Nyina wa Jambo, Mother of the Word. The first Marian apparition site in Africa recognised by the Catholic Church.",
      intro: "<p>She presented herself as <em>Nyina wa Jambo</em> — Mother of the Word — and called the world to conversion, to prayer, and to reconciliation. Through three schoolgirls of Kibeho the Church received a message that still gathers pilgrims from Rwanda and from every nation.</p><p>Walk the apparitions, the visionaries, and the 2001 recognition. Then come: this call is lived at the Shrine, not only remembered.</p>",
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
      seoDescription:
        "Between 1981 and 1989 the Blessed Virgin Mary appeared in Kibeho as Nyina wa Jambo — Mother of the Word. A call to conversion, prayer, and reconciliation.",
      intro: "<p>The first time the Virgin Mary appeared to Alphonsine Mumureke, a student in the school now called Groupe Scolaire Mère du Verbe Kibeho, was on 28 November 1981, in a dining hall. Alphonsine saw a beautiful woman who presented herself as <em>Nyina wa Jambo</em> — Mother of the Word.</p><p>On 12 January 1982 the Blessed Virgin appeared to Nathalie Mukamazimpaka in the dormitory, and on 2 March 1982 to Marie Claire Mukangango. Others reported visions, but only these three visionaries were approved by the Church in 2001 after a thorough investigation.</p>",
      blocks: [
        {
          type: "heading",
          text: "A chronology",
        },
        {
          type: "steps",
          items: [
            { title: "28 November 1981", text: "<p>First apparition to Alphonsine Mumureke in the school dining hall.</p>" },
            { title: "12 January 1982", text: "<p>Apparitions begin for Nathalie Mukamazimpaka, in the dormitory.</p>" },
            { title: "2 March 1982", text: "<p>Apparitions begin for Marie Claire Mukangango, later linked with the Seven Sorrows Rosary.</p>" },
            { title: "15 August 1982 onward", text: "<p>Many public apparitions are held outdoors and at the podium, as crowds grow.</p>" },
            { title: "28 November 1989", text: "<p>The cycle of recognised apparitions associated with Alphonsine comes to its close.</p>" },
            { title: "29 June 2001", text: "<p>The Bishop of Gikongoro declares the apparitions of the three visionaries authentic.</p>", path: "/our-lady/church-recognition", linkLabel: "Church Recognition" },
          ],
        },
        {
          type: "note",
          text: "<p>From 28 November 1981 to May 1982, apparitions took place in the dormitory, later transformed into the Chapel of the Apparitions.</p>",
        },
      ],
      cta: {
        primary: { label: "The Visionaries", path: "/our-lady/visionaries" },
        secondary: { label: "Church Recognition", path: "/our-lady/church-recognition" },
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
      subtitle: "Declared authentic on 29 June 2001",
      seoDescription:
        "On 29 June 2001 the Bishop of Gikongoro declared the apparitions of Kibeho authentic — the first approved Marian apparition site on the African continent.",
      intro: "<p>On 29 June 2001, after the approval of the Holy See, the Bishop of Gikongoro, Mgr Augustin Misago, issued the declaration bearing the final judgement on the apparitions of Kibeho. Bishop Jean Baptiste Gahamanyi had earlier created two commissions: medical (March 1982) and theological (May 1982).</p><p>Kibeho stands with Guadalupe, Lourdes, and Fatima as a recognised Marian apparition — the first approved on the African continent.</p>",
      blocks: [
        {
          type: "heading",
          text: "What the Church recognised",
        },
        {
          type: "paragraph",
          text: "<p>The Church recognised the authenticity of the apparitions associated with three visionaries: Alphonsine Mumureke, Nathalie Mukamazimpaka, and Marie Claire Mukangango. Other reported visions were not included in that declaration.</p>",
        },
        {
          type: "cards",
          items: [
            { title: "1982", text: "<p>Medical and theological commissions begin their work in the Diocese.</p>" },
            { title: "29 June 2001", text: "<p>Public declaration of authenticity by the Bishop of Gikongoro.</p>" },
            { title: "Today", text: "<p>Pilgrims from Rwanda and every nation come to pray at the Shrine.</p>" },
          ],
        },
      ],
      cta: {
        primary: { label: "History", path: "/our-lady/history" },
        secondary: { label: "Welcome to the Shrine", path: "/shrine/welcome" },
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
      heroCtaLabel: "Walk the Shrine",
      heroCtaPath: "/shrine/welcome",
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
      title: "Welcome to Kibeho",
      subtitle: "A sanctuary open to the world",
      heroImage: "/images/sanctuary/welcome.jpg",
      welcomeEyebrow: "Our Lady of Kibeho",
      welcomeTitle: "Nyina wa Jambo — Mother of the Word",
      intro: "<p>The Sanctuary of Our Lady of Kibeho welcomes pilgrims from Rwanda and around the world. Come to pray, to celebrate the sacraments, and to encounter the Mother of the Word.</p><p>On ordinary days the grounds are quiet. On Marian feasts they fill with parishes, dioceses, and visitors from many nations. Either way, you are expected in peace.</p><p>Kibeho is a holy place with the Church of Our Lady of Sorrows, the Chapel of the Apparitions, the Chapel of Adoration, the Way of the Cross, the source of Mary, and other places of prayer.</p>",
      mission: {
        eyebrow: "Our Mission",
        title: "Why we welcome pilgrims",
        text: "To serve as a sacred place of encounter with God — welcoming pilgrims with hospitality, guiding them through prayer and the sacraments, and fostering reconciliation and peace in the spirit of Our Lady of Kibeho.",
      },
      vision: {
        eyebrow: "Our Vision",
        title: "Where we are headed",
        text: "To be a beacon of faith and reconciliation for Rwanda, Africa, and the world — a sanctuary where every pilgrim finds rest, renewal, and a deeper commitment to living the Gospel message of love and forgiveness.",
      },
      values: [
        {
          title: "Living Faith",
          text: "We root everything we do in prayer, the sacraments, and trust in God's grace — inviting every pilgrim to deepen their relationship with Christ and Our Lady of Kibeho.",
        },
        {
          title: "Radical Hospitality",
          text: "Every guest is a pilgrim, not a visitor. We offer warm welcome, practical care, and a spirit of service that reflects the love Mary asked us to show one another.",
        },
        {
          title: "Reconciliation & Peace",
          text: "In a land that has known profound pain, we carry forward Our Lady's call to forgive, heal, and build unity — beginning in our own hearts and extending to every community we touch.",
        },
        {
          title: "Stewardship",
          text: "We care for this sacred place and its people with responsibility and gratitude — preserving Kibeho as a home of prayer for generations to come.",
        },
      ],
      leadership: {
        title: "Leadership team",
        intro: "Meet the priests and pastoral workers who welcome pilgrims, celebrate the liturgy, and accompany the life of the Shrine of Our Lady of Kibeho.",
      },
      map: {
        image: "/images/sanctuary/home-reference.png",
        alt: "Plan of the Shrine of Our Lady of Kibeho",
        caption: "Find churches, apparition sites, and prayer paths across the hillside.",
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
      intro: "<p>Visit the places associated with the apparitions of Our Lady of Kibeho — beginning at the Sanctuary and continuing to each remembered site on the hillside. Each place has its own history, its own invitation to prayer, and its own path to reach it.</p>",
      blocks: [
        {
          type: "heading",
          text: "Sites of the Sanctuary",
        },
        {
          type: "paragraph",
          text: "<p>The Sanctuary is made up of the Church of Our Lady of Sorrows, the Chapel of the Apparitions, the esplanade where Mass is celebrated, and the Holy Spring — together with the prayer paths that link them.</p>",
        },
        {
          type: "cards",
          items: [
            {
              title: "Church of Our Lady of Sorrows",
              text: "<p><em>Ingoro ya Bikiramaliya Umunyamibabaro.</em> The principal church of the Sanctuary — where the liturgical life of Kibeho is celebrated.</p>",
              path: "/shrine/places/our-lady-of-sorrows",
            },
            {
              title: "Chapel of the Apparitions",
              text: "<p><em>Chapel y'amabonekerwa.</em> The former dormitory where the first apparitions took place, now a chapel of remembrance and prayer.</p>",
              path: "/shrine/places/chapel-of-the-apparitions",
            },
            {
              title: "Esplanade of the Apparitions",
              text: "<p><em>Splanade aho basomerera Missa.</em> The open esplanade where outdoor Mass and public apparitions were held — still a gathering place for pilgrims.</p>",
              path: "/shrine/apparition-sites/esplanade-of-the-apparitions",
            },
            {
              title: "The Holy Spring",
              text: "<p><em>Isoko ya Bikiramariya.</em> Pilgrims come to the source of Mary in faith — a sign of grace and a call to trust.</p>",
              path: "/shrine/apparition-sites/source-of-mary",
            },
            {
              title: "The place of the apparitions",
              text: "<p><em>Ahabereye amabonekerwa.</em> The hillside remembered for the apparitions of the Mother of the Word — a space of silence and thanksgiving.</p>",
              path: "/shrine/apparition-sites/place-of-the-apparitions",
            },
          ],
        },
        {
          type: "note",
          text: "<p>Each site page includes what happens there, why you should visit, and directions. Ask at pilgrim reception if you need a guide.</p>",
        },
      ],
      cta: {
        primary: {
          label: "Shrine Map",
          path: "/shrine/map",
        },
        secondary: {
          label: "Welcome",
          path: "/shrine/welcome",
        },
      },
    }),

  'shrine.holy-spring': page({
      title: "Holy Spring",
      subtitle: "The source of Mary",
      heroImage: "/images/sanctuary/activity-spring.jpg",
      intro: "<p>Pilgrims come to the source of Mary in faith — a sign of God’s grace and a call to interior purification and trust. It is not a tourist stop. Approach in silence, with the prayer you brought, or with none.</p>",
      blocks: [
        {
          type: "heading",
          text: "How pilgrims come to the water",
        },
        {
          type: "paragraph",
          text: "<p>Ask at reception for the path if you are visiting for the first time. Dress modestly, as at every holy place of the Shrine. Take only what you need; leave the spring as you found it, for those who come after you.</p>",
        },
        {
          type: "note",
          text: "<p>The spring is one place among the ways of Kibeho. Pair your visit with Mass, confession, or a slow walk of the Way of the Cross.</p>",
        },
      ],
      cta: {
        primary: { label: "Shrine Map", path: "/shrine/map" },
        secondary: { label: "Welcome", path: "/shrine/welcome" },
      },
    }),

  'shrine.way-of-the-cross': page({
      title: "Way of the Cross",
      subtitle: "Walking with Christ",
      heroImage: "/images/sanctuary/activity-rock.jpg",
      intro: "<p>Pray the Way of the Cross at the Shrine — a path of meditation on the Passion of Christ in the company of Our Lady of Sorrows. Walk it slowly. The hillside of Kibeho is itself a teacher of patience.</p>",
      blocks: [
        {
          type: "heading",
          text: "On the path",
        },
        {
          type: "paragraph",
          text: "<p>Fourteen stations mark the journey of Jesus to Calvary. At Kibeho this walk sits beside the devotion of the Seven Sorrows, which Our Lady asked the visionaries to pray. Groups may request a guided hour through the Pilgrimage Office.</p>",
        },
        {
          type: "cards",
          items: [
            { title: "Alone or with others", text: "<p>Come in the quiet of the morning, or with your parish after Mass.</p>" },
            { title: "Seven Sorrows", text: "<p>The Rosary of the Seven Sorrows is the distinctive prayer of Kibeho.</p>", path: "/spirituality/seven-sorrows-rosary" },
            { title: "Find the path", text: "<p>The shrine map shows how the Way sits among the churches and the spring.</p>", path: "/shrine/map" },
          ],
        },
      ],
      cta: {
        primary: { label: "Seven Sorrows Rosary", path: "/spirituality/seven-sorrows-rosary" },
        secondary: { label: "Meditations", path: "/spirituality/meditations" },
      },
    }),

  'shrine.eucharistic-adorations': page({
      title: "Eucharistic Adoration",
      subtitle: "Stay with Me",
      intro: "<p>Join times of silent prayer before the Blessed Sacrament in the chapel of adoration — for personal intentions and for the world. Hours follow the liturgical life of the Shrine and are extended on feast days.</p>",
      blocks: [
        {
          type: "paragraph",
          text: "<p>Confirm the day’s hours on the Mass schedule, or ask at reception. You may leave an intention with the office, or simply sit.</p>",
        },
      ],
      cta: {
        primary: { label: "Mass Schedule", path: "/shrine/mass-schedule" },
        secondary: { label: "Request a Mass", path: "/spirituality/request-a-mass" },
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
      seoDescription:
        "A prayerful order of visit to the churches, apparition sites, Holy Spring, Way of the Cross, and chapel of adoration at the Shrine of Our Lady of Kibeho.",
      intro: "<p>Use this guide to walk the Shrine without hurry. The numbered path is a suggestion, not a rule. On feast days, follow the ushers and the liturgy of the day.</p>",
      blocks: [
        {
          type: "note",
          text: "<p>The labelled plan below is for orientation. For GPS directions to Kibeho itself, see Transportation. Groups should still present themselves at reception.</p>",
        },
      ],
      cta: {
        primary: { label: "Welcome", path: "/shrine/welcome" },
        secondary: { label: "Getting here", path: "/pilgrimage/transportation" },
      },
    }),

  'pilgrimage.index': page({
      title: "Pilgrimage",
      subtitle: "Prepare your journey to Kibeho",
      heroCtaLabel: "Plan your visit",
      heroCtaPath: "/pilgrimage/plan",
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
          path: "/pilgrimage/calendar",
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
      subtitle: "Who is travelling, when, how, and whom to write",
      seoDescription:
        "Prepare a pilgrimage to the Shrine of Our Lady of Kibeho: dates, group size, travel from Kigali, lodging, and contact with the Pilgrimage Office.",
      intro: "<p>Whether you come alone, with family, or with a parish group, the Shrine welcomes you. Follow these steps, then write to the Pilgrimage Office so liturgy, lodging, and a fitting welcome can be prepared.</p>",
      blocks: [
        {
          type: "heading",
          text: "A simple path",
        },
        {
          type: "steps",
          items: [
            {
              title: "Who is coming?",
              text: "<p>One person, a family, or a parish group. Note languages spoken and whether you need a priest or a local guide.</p>",
            },
            {
              title: "When will you come?",
              text: "<p>Ordinary days are quieter. Marian feasts and national pilgrimages are crowded — confirm dates on the calendar before you book travel.</p>",
              path: "/pilgrimage/calendar",
              linkLabel: "Pilgrimage calendar",
            },
            {
              title: "How will you arrive?",
              text: "<p>International pilgrims fly to Kigali (about three hours by road). Usual routes include Kigali–Huye–Matyazo–Kibeho.</p>",
              path: "/pilgrimage/transportation",
              linkLabel: "Transportation",
            },
            {
              title: "Where will you stay?",
              text: "<p>Guest houses and hotels near the Shrine are listed here. The office can advise groups on suitable options.</p>",
              path: "/pilgrimage/accommodation",
              linkLabel: "Accommodation",
            },
            {
              title: "Write to the office",
              text: "<p>Send dates, numbers, and any liturgical request. Individuals may also register interest for a public pilgrimage.</p>",
              path: "/pilgrimage/office",
              linkLabel: "Pilgrimage Office",
            },
          ],
        },
        {
          type: "note",
          text: "<p>Prepare the heart as well as the journey: Mass, confession, and the Rosary of the Seven Sorrows. Practical notes on dress, climate, and feast-day crowding are on Practical Information.</p>",
        },
      ],
      cta: {
        primary: { label: "Practical Guidelines", path: "/pilgrimage/practical-guidelines" },
        secondary: { label: "How to Get Here", path: "/pilgrimage/how-to-get-here" },
      },
      buttons: [
        { label: "Practical Guidelines", path: "/pilgrimage/practical-guidelines" },
        { label: "How to Get Here", path: "/pilgrimage/how-to-get-here" },
        { label: "Register a group", path: "/pilgrimage/practical-guidelines" },
        { label: "Accommodation", path: "/pilgrimage/accommodation" },
      ],
    }),

  'pilgrimage.accommodation': page({
      title: "Accommodation",
      subtitle: "Places to stay near the Shrine",
      intro: "Find guest houses, retreat centres, and hotels near Kibeho. The Pilgrimage Office can advise groups on suitable options.",
      cta: {
        primary: {
          label: "Ask the Pilgrimage Office",
          path: "/pilgrimage/office",
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
          label: "Practical Guidelines",
          path: "/pilgrimage/practical-guidelines",
        },
        secondary: {
          label: "Contact",
          path: "/contact",
        },
      },
    }),

  'pilgrimage.how-to-get-here': page({
      title: "How to Get Here",
      subtitle: "Reaching Kibeho from Rwanda and abroad",
      intro: "<p>Kibeho is in Nyaruguru District, Southern Province, Rwanda. International pilgrims usually fly to Kigali and continue by road. Use the routes below, then the map to set your directions.</p>",
      cta: {
        primary: { label: "Practical Guidelines", path: "/pilgrimage/practical-guidelines" },
        secondary: { label: "Plan Your Pilgrimage", path: "/pilgrimage/plan" },
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
          path: "/pilgrimage/calendar",
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
          label: "Plan your Pilgrimage",
          path: "/pilgrimage/plan",
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

  'pilgrimage.practical-guidelines': page({
      title: "Practical Guidelines",
      subtitle: "Prepare well before you travel",
      intro: "<p>Whether you come alone, with family, or as a parish group, these guidelines help your pilgrimage remain prayerful, safe, and well organised. Groups should register in advance using the form below.</p>",
      blocks: [
        {
          type: "heading",
          text: "Good conduct at the Shrine",
        },
        {
          type: "list",
          items: [
            "No music or personal speakers around the Shrine",
            "No musical instruments in the shrine compound",
            "Keep phones on silent mode",
            "Avoid personal conversations in places of prayer",
            "Wear appropriate and modest clothing",
            "Follow our community support channel for updates",
            "Shop only from approved Shrine shops",
            "Carry valid national ID or passport",
            "Arrange health insurance before travelling",
            "Confirm accommodation reservations in advance",
          ],
        },
        {
          type: "heading",
          text: "Group registration",
        },
        {
          type: "paragraph",
          text: "<p>Parish groups, diocesan pilgrimages, and international visitors should register before arrival. Priests requesting to celebrate or concelebrate Mass must attach a valid <em>celebret</em> from their Bishop or religious superior. Seminarians must provide a document from the competent ecclesiastical authority.</p>",
        },
      ],
      cta: {
        primary: { label: "Plan Your Pilgrimage", path: "/pilgrimage/plan" },
        secondary: { label: "Accommodation", path: "/pilgrimage/accommodation" },
      },
    }),

  'spirituality.processions': page({
      title: "Processions",
      subtitle: "Walking in prayer with Our Lady",
      intro: "<p>Processions are a living part of devotion at Kibeho — walking in prayer with Our Lady through the shrine compound and during annual celebrations.</p>",
      blocks: [
        {
          type: "heading",
          text: "When processions take place",
        },
        {
          type: "list",
          items: [
            "Every Thursday at 5:30 PM",
            "In the shrine compound (outdoors, not inside the church)",
            "During annual celebrations and major feast days",
          ],
        },
        {
          type: "paragraph",
          text: "<p>Processions gather pilgrims in a spirit of prayer and reconciliation. On ordinary Thursdays, the walk takes place in the shrine compound at 5:30 PM. During annual celebrations, larger processions may follow the liturgy of the day — follow directions from shrine stewards.</p>",
        },
      ],
      cta: {
        primary: { label: "Schedule of the Shrine", path: "/shrine/schedule" },
        secondary: { label: "Annual Celebrations", path: "/pilgrimage/annual-celebrations" },
      },
    }),

  'spirituality.share-testimony': page({
      title: "Share Your Testimony",
      subtitle: "For the Shrine archives — not for public display",
      intro: "<p>Share how Kibeho has touched your life. Your testimony is received for the Shrine's pastoral records and is <strong>not published</strong> on this website.</p>",
      blocks: [
        {
          type: "note",
          text: "<p>This form is for the Shrine team only. Testimonies are kept privately for pastoral use and archival purposes.</p>",
        },
      ],
      cta: {
        primary: { label: "Prayer Intentions", path: "/spirituality/prayer-intentions" },
        secondary: { label: "Contact", path: "/contact" },
      },
    }),

  'shrine.map': page({
      title: "Shrine Map",
      subtitle: "Find your way across the holy ground",
      intro: "<p>Use this guide to walk the Shrine without hurry. The numbered path is a suggestion, not a rule. On feast days, follow the ushers and the liturgy of the day.</p>",
      cta: {
        primary: { label: "Welcome", path: "/shrine/welcome" },
        secondary: { label: "Apparition Sites", path: "/shrine/apparition-sites" },
      },
    }),

  'spirituality.index': page({
      title: "Spirituality",
      subtitle: "Pray with the Shrine — near or far",
      heroCtaLabel: "Pray the Seven Sorrows",
      heroCtaPath: "/spirituality/seven-sorrows-rosary",
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
          path: "/support/get-involved?service=offerings",
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
      subtitle: "The distinctive devotion of Kibeho",
      seoDescription:
        "Pray the Rosary of the Seven Sorrows, the devotion Our Lady of Kibeho asked of Marie Claire Mukangango and of the Church.",
      intro: "<p>Our Lady asked, especially through Marie Claire Mukangango, that the faithful pray the Rosary of the Seven Sorrows — meditating on the sorrows of Mary and uniting our hearts to her Son. This is the prayer most closely bound to Kibeho.</p>",
      blocks: [
        {
          type: "heading",
          text: "How to pray",
        },
        {
          type: "paragraph",
          text: "<p>Begin with an Act of Contrition. For each sorrow: one Our Father and seven Hail Marys, with a brief meditation on that mystery. End with three Hail Marys in honour of the tears of Our Lady.</p>",
        },
        {
          type: "heading",
          text: "The seven sorrows",
        },
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
        {
          type: "note",
          text: "<p>Pray it at home if you cannot yet come. When you do come, you may walk the Way of the Cross on the hillside after Mass.</p>",
        },
      ],
      cta: {
        primary: { label: "The Messages", path: "/our-lady/messages" },
        secondary: { label: "Way of the Cross", path: "/shrine/way-of-the-cross" },
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
      intro: "<p>Pray with the Shrine of Our Lady of Kibeho — at home or on the hillside. Liturgical texts used in the sanctuary are those of the Church; the prayers below accompany personal devotion. Approved booklets from the Shrine remain the reference for communal use.</p>",
      blocks: [
        {
          type: "heading",
          text: "A prayer to Our Lady of Kibeho",
        },
        {
          type: "paragraph",
          text: "<p>Blessed Virgin Mary, Mother of the Word, Mother of all who believe in Him: we thank you for the gift of your apparitions at Kibeho. Obtain for us the grace of conversion, a sincere love of the Cross, and reconciliation with God and with one another. Teach us to pray the Rosary, especially the Rosary of your Seven Sorrows. Mother of the Word, pray for Rwanda, for Africa, and for the whole world. Amen.</p>",
        },
        {
          type: "cards",
          items: [
            { title: "Seven Sorrows Rosary", text: "<p>The devotion Our Lady asked at Kibeho.</p>", path: "/spirituality/seven-sorrows-rosary" },
            { title: "Rosary", text: "<p>The mysteries of Christ, prayed with Mary.</p>", path: "/spirituality/rosary" },
            { title: "Send an intention", text: "<p>Ask the Shrine to keep a light or a Mass for you.</p>", path: "/spirituality/prayer-intentions" },
          ],
        },
      ],
      cta: {
        primary: { label: "Meditations", path: "/spirituality/meditations" },
        secondary: { label: "Rosary", path: "/spirituality/rosary" },
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
      heroCtaLabel: "See the Master Plan",
      heroCtaPath: "/support/master-plan",
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
              path: "/support/get-involved?service=offerings",
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
          path: "/support/get-involved",
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
          path: "/support/get-involved",
        },
      },
    }),

  'support.vision': page({
      title: "Vision",
      subtitle: "A shrine still becoming what Our Lady asked",
      intro: "<p>The Diocese of Gikongoro wishes the Shrine to welcome pilgrims from every nation, proclaim the message of Our Lady of Kibeho, and sustain long-term pastoral, spiritual, and infrastructural development.</p><p>Unlike long-established pilgrimage sites, Kibeho is still being formed. The website, the liturgy, and the buildings must all say the same thing: conversion, prayer, and a dignified welcome.</p>",
      blocks: [
        {
          type: "cards",
          items: [
            { title: "Proclaim the message", text: "<p>Nyina wa Jambo — conversion, the Rosary, reconciliation.</p>", path: "/our-lady/messages" },
            { title: "Welcome every pilgrim", text: "<p>From the hills of Nyaruguru and from every continent.</p>", path: "/pilgrimage/plan" },
            { title: "Build with transparency", text: "<p>Master Plan, projects, and accountable stewardship of gifts.</p>", path: "/support/master-plan" },
          ],
        },
      ],
      cta: {
        primary: { label: "Master Plan", path: "/support/master-plan" },
        secondary: { label: "Partners", path: "/support/partners" },
      },
    }),

  'support.master-plan': page({
      title: "Master Plan",
      subtitle: "Building the future of the Shrine",
      seoDescription:
        "The Master Plan of the Shrine of Our Lady of Kibeho: pilgrim hospitality, liturgy, accessibility, and environmental care — still being built, in need of partners.",
      intro: "<p>Unlike older pilgrimage sites, Kibeho is still becoming the place of welcome the Mother of the Word asked for. The Master Plan orders that work: not prestige, but dignity for those who come to pray — on feast days when thousands arrive, and on quiet weekdays.</p>",
      blocks: [
        {
          type: "heading",
          text: "What the plan holds together",
        },
        {
          type: "cards",
          items: [
            { title: "Pilgrim reception", text: "<p>Orientation, sanitation, and hospitality so first-time visitors are not lost.</p>" },
            { title: "Liturgy and pastoral care", text: "<p>Spaces where Mass, confession, and accompaniment can unfold without strain.</p>" },
            { title: "Paths and access", text: "<p>Safe ways between churches, the apparition sites, the spring, and the Way of the Cross.</p>" },
            { title: "Care of the hillside", text: "<p>Environmental stewardship of a living shrine, not a building site without end.</p>" },
          ],
        },
        {
          type: "heading",
          text: "How to take part",
        },
        {
          type: "paragraph",
          text: "<p>Phase One and the Welcome Centre are published as projects you can walk through — with a gift, a pledge, or a partnership. Figures and reports will be added as the Diocese releases them.</p>",
        },
      ],
      cta: {
        primary: { label: "Current projects", path: "/support/projects" },
        secondary: { label: "Donate", path: "/support/get-involved?service=expansion" },
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
      intro: "<p>The Diocese of Gikongoro will publish annual reports of the Shrine here — pastoral life, development works, and the use of gifts. Until a new report is released, the current projects and the transparency page explain how support is directed.</p>",
      blocks: [
        {
          type: "cards",
          items: [
            { title: "Current projects", text: "<p>Need, solution, and impact of works now seeking partners.</p>", path: "/support/projects" },
            { title: "How gifts are used", text: "<p>Pastoral priorities and the path from donation to work on the hillside.</p>", path: "/support/transparency" },
          ],
        },
        {
          type: "note",
          text: "<p>When a report PDF is approved, it will be added to this page through the media library. Partners may also write to the office for the latest available statement.</p>",
        },
      ],
      cta: {
        primary: { label: "Transparency", path: "/support/transparency" },
        secondary: { label: "Partners", path: "/support/partners" },
      },
    }),

  'support.transparency': page({
      title: "Transparency",
      subtitle: "Trust in the service of the Gospel",
      intro: "<p>Gifts to the Shrine are received by the Diocese of Gikongoro for the pastoral mission and the development of Kibeho. We will not ask the faithful to trust a slogan. This page states how money is directed, and where you may read more.</p>",
      blocks: [
        {
          type: "heading",
          text: "Where support goes",
        },
        {
          type: "cards",
          items: [
            { title: "Prayer and liturgy", text: "<p>Mass, confession, adoration, and the daily welcome of pilgrims.</p>" },
            { title: "A dignified welcome", text: "<p>Paths, sanitation, orientation, and care of the holy places.</p>" },
            { title: "Named projects", text: "<p>You may give to the mission generally, or walk through a published project.</p>", path: "/support/projects" },
          ],
        },
        {
          type: "heading",
          text: "How we account for it",
        },
        {
          type: "paragraph",
          text: "<p>Bank and mobile-money details are published on Donations. Project pages show need and intended fruit. Annual reports, once issued, appear as downloads on this site. For a partnership that includes a gift, write first so the office can match it to a work.</p>",
        },
        {
          type: "note",
          text: "<p>The Diocese remains the steward. This website records what the Shrine can already show; it does not replace the accounts of the Diocese.</p>",
        },
      ],
      cta: {
        primary: { label: "Annual Reports", path: "/support/annual-reports" },
        secondary: { label: "Donate", path: "/support/get-involved?service=offerings" },
      },
    }),

  'support.partners': page({
      title: "Partners",
      subtitle: "Walking together with the Shrine",
      intro: "<p>Parishes, religious communities, dioceses, and friends of Kibeho worldwide support the mission through prayer, pilgrimage, and collaboration. Send a partnership enquiry below. If the partnership includes a gift, use Donations or a specific project so the office can match it.</p>",
      cta: {
        primary: {
          label: "Give to the mission",
          path: "/support/get-involved?service=offerings",
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
