/**
 * Content for the listicle pre-landers (rendered by ListiclePage.tsx).
 *
 * What these pages are for: warming up cold ad traffic before it reaches a
 * sales page. They are not linked from any menu; ads point straight at them.
 * The structure follows one argument the whole way down:
 *   hook that matches the ad → numbered signs (most relatable first) →
 *   the bridge (why the usual fixes fall short) → the product, benefit first
 *   and ingredients second → what to expect → one button to the sales page.
 *
 * Rules for the copy (see also the 50+ page header):
 *   - No prices here. The listicle builds conviction; the sales page sells.
 *   - Results: 7–10 days. Never "3–7".
 *   - Never mention or target cracked heels. Rough, hard, dry skin only.
 *   - No healing or medical claims, no invented reviews, no made-up research numbers.
 *   - The button carries ?via=… so leads from the sales page show which listicle sent them.
 */
import heroHome from "../assets/images/silkpedi_hero_bg.webp";
import hero50 from "../assets/images/silkpedi_hero_50plus.webp";

export type ListicleItem = { title: string; body: string[]; key: string };

export type Listicle = {
  docTitle: string;
  kicker: string;
  headline: string;
  headlineAccent: string;
  dek: string;
  heroImage: string;
  heroAlt: string;
  intro: string[];
  items: ListicleItem[];
  midCta: { title: string; body: string };
  bridge: { kicker: string; title: string; paras: string[]; pull: string };
  solution: {
    title: string;
    intro: string[];
    steps: { title: string; body: string }[];
    inside: string[];
    insight: string;
    upkeep: string;
  };
  aside?: { title: string; body: string };
  expect: { day: string; title: string; body: string }[];
  faqs: { q: string; a: string }[];
  closing: { title: string; accent: string; body: string };
  ctaHref: string;
  ctaLabel: string;
};

const AHA_INSIDE = [
  "What does the work: fruit-derived acids (AHAs), mainly lactic and glycolic acid. They loosen the bonds that hold dead skin cells together, so the old layer can shed. AHAs are long-established exfoliating ingredients in skincare.",
  "No blades, no sanding, no heat. Most people feel nothing at all while the booties are on.",
];

const DELIVERY_FAQ = {
  q: "Where do you deliver?",
  a: "Fast courier delivery across Zimbabwe, South Africa, Zambia and beyond. You order in one WhatsApp message and we arrange the rest with you.",
};

export const ROUGH_HEELS: Listicle = {
  docTitle: "6 Reasons Your Heels Stay Rough, No Matter How Much Cream You Use | Silkpedi",
  kicker: "Foot care · 4 min read",
  headline: "6 reasons your heels stay rough,",
  headlineAccent: "no matter how much cream you use.",
  dek: "If your heels feel hard again a few days after every scrub, you're not doing anything wrong. You're working on the wrong layer.",
  heroImage: heroHome,
  heroAlt: "A woman sitting barefoot beside the teal Silkpedi foot peel pouch",
  intro: [
    "You put cream on at night. You scrub in the bath when you remember. For a day or two your heels feel better. By the end of the week they're catching on the sheets again.",
    "It's probably not that your skin is dry. Not in the way most people mean.",
    "What you're feeling is a layer of hard, dead skin that builds up on your heels, and most of what we're told to do only works on the top of it. Here are the signs, why the usual fixes keep falling short, and what actually shifts it.",
  ],
  items: [
    {
      title: "Your heels catch on your sheets, even though you moisturise every night",
      body: [
        "You rub the cream in. In the morning your heels still feel like sandpaper. It can feel like the cream is sitting on top instead of going in.",
        "That's because it is. Hard heel skin is made of old, dead cells packed tightly together. Cream softens the surface, but it can't get through a thick layer to the living skin underneath.",
      ],
      key: "You're moisturising the dead layer, not your skin.",
    },
    {
      title: "Scrubbing helps for a day, then the roughness is back by midweek",
      body: [
        "A pumice stone or foot file takes the top off, and your heels feel smooth for an evening.",
        "But the dead cells further down are still stuck together. Scrubbing hard can also leave the surface uneven, so it feels rough again even sooner.",
      ],
      key: "Scrubbing only reaches the top. The rest of the layer stays put.",
    },
    {
      title: "Your feet spend the day in heat, dust and open shoes",
      body: [
        "Sandals, dry air and dusty roads all pull moisture out of the skin on your heels, and every step in an open shoe presses on the same spot.",
        "Your skin responds the way it's meant to: it builds a thicker, harder layer to protect itself.",
      ],
      key: "Your heels make hard skin faster than everyday care can remove it.",
    },
    {
      title: "You're on your feet for most of the day",
      body: [
        "Standing at work, walking to the kombi, running around after the children. Hard skin builds wherever there's pressure, and your heels take most of it.",
        "That's normal. It isn't a sign that you don't look after yourself.",
      ],
      key: "Hard skin isn't neglect. It's your heels doing their job.",
    },
    {
      title: "Pedicures work, but the result doesn't last",
      body: [
        "A good pedicure feels amazing. Then a couple of weeks later the hard skin starts building back, and booking another one costs time and money.",
        "Scraping removes what's there today. Then it starts building again, and you're back in the chair.",
      ],
      key: "A result that only lasts until your next appointment.",
    },
    {
      title: "You've been fixing the roughness, not removing the layer",
      body: [
        "Cream, scrubs and pedicures all deal with how your heels feel this week. None of them lifts away the whole dead layer in one go, so you end up repeating them every few days.",
      ],
      key: "Remove the layer first. Then cream finally has something to work on.",
    },
  ],
  midCta: {
    title: "Recognise three or more of these?",
    body: "There's a reason your heels keep going back to rough, and a way to deal with it that doesn't involve scrubbing harder.",
  },
  bridge: {
    kicker: "What's really going on",
    title: "It's not dryness. It's a build-up.",
    paras: [
      "Your skin renews itself all the time. New cells form underneath, and old ones are meant to shed from the surface.",
      "On your heels, pressure, heat and dry air make old cells pile up faster than they shed. They stay stuck together and form a hard layer that keeps getting thicker.",
      "Cream softens the top of that layer. Scrubbing takes the top off. Neither one loosens what holds the whole layer together, so the hard skin keeps coming back.",
    ],
    pull: "So the fix isn't a thicker cream or a harder scrub. It's loosening the whole dead layer at once, then looking after the soft skin underneath.",
  },
  solution: {
    title: "The approach that deals with the whole layer",
    intro: [
      "That's what an exfoliating foot peel is for. Instead of scraping hard skin off, it loosens it so it lifts away by itself.",
      "Silkpedi is a peel you do at home, and it takes one relaxing hour.",
    ],
    steps: [
      { title: "Slip the booties on", body: "Wear them for about an hour with your feet up, then rinse." },
      { title: "Let it work", body: "Over the next few days the dead layer loosens and comes away in the shower." },
      { title: "Soft, smooth heels", body: "In about 7–10 days, the softer skin underneath is what's left." },
    ],
    inside: AHA_INSIDE,
    insight: "Peel first, then moisturise. Once the dead layer is gone, your cream reaches skin that can actually use it.",
    upkeep: "It isn't something you do every day. When hard skin starts building back, one treatment every 4–6 weeks keeps on top of it.",
  },
  expect: [
    { day: "DAY 1", title: "One hour, feet up", body: "Wear the booties, rinse, carry on. Nothing shows yet." },
    { day: "DAYS 3–5", title: "The peeling starts", body: "This part isn't pretty. Socks and closed shoes help, and a warm soak speeds it along." },
    { day: "DAYS 7–10", title: "Soft, smooth heels", body: "The last flakes are gone, and now your cream works on fresh skin." },
  ],
  faqs: [
    { q: "Does it hurt?", a: "No. There's no cutting, sanding or heat. Most people feel nothing at all while the booties are on." },
    { q: "How long until I see a difference?", a: "Peeling usually starts around day 3 to 5 and is finished by day 7 to 10. Soaking your feet in warm water for 15–20 minutes a day from day 2 helps it along." },
    { q: "Is it messy?", a: "During the peeling days the old skin comes away in flakes. Wearing socks around the house and letting it lift away in the shower keeps things tidy." },
    { q: "How often do I need to do it?", a: "When the hard skin starts building back. We suggest every 4–6 weeks, which matches how quickly skin renews." },
    DELIVERY_FAQ,
  ],
  closing: {
    title: "Your heels aren't stubborn.",
    accent: "They're carrying a layer nobody has removed.",
    body: "Not with more cream, and not with harder scrubbing. Loosen the whole layer once, look after the skin underneath, and rough heels stop being something you think about.",
  },
  ctaHref: "/?via=rough-heels",
  ctaLabel: "See how Silkpedi works",
};

export const AFTER_50: Listicle = {
  docTitle: "5 Signs Your Feet Need a Different Kind of Care After 50 | Silkpedi",
  kicker: "Foot care after 50 · 4 min read",
  headline: "5 signs your feet need a different kind of care",
  headlineAccent: "after 50.",
  dek: "If looking after your feet has quietly become harder, it's not because you've stopped trying. What worked at 30 was made for a different body.",
  heroImage: hero50,
  heroAlt: "An older couple laughing on the couch while she wears the Silkpedi peel booties",
  intro: [
    "Maybe you noticed it on the stairs, or putting your shoes on, or the first time you didn't want anyone to see your feet.",
    "It's easy to think you just need a better cream. Usually, you don't.",
    "Three things change as we get older: skin holds less moisture, hard skin builds faster than it wears away, and your feet get harder to reach. Most foot care still expects you to bend, balance and scrub. Here are the signs it's time for something different.",
  ],
  items: [
    {
      title: "You cream your heels every night, and they still feel hard",
      body: [
        "Skin holds less moisture as the years go on, so it makes sense to reach for a richer cream. But the hardness isn't only dryness.",
        "It's a layer of old, dead skin sitting on top. Cream softens the surface, but it can't get through to the skin underneath.",
      ],
      key: "Moisturiser can't reach skin that's buried under a dead layer.",
    },
    {
      title: "Reaching your feet is harder than it used to be",
      body: [
        "Bending over the bath with a pumice stone, balancing on one leg, holding the position long enough to do a proper job. With stiff hips or a sore back, it turns into a chore you keep putting off.",
        "And the longer it waits, the thicker the hard skin gets.",
      ],
      key: "If foot care means bending and balancing, it stops getting done.",
    },
    {
      title: "The hard skin comes back faster than it used to",
      body: [
        "As we age, skin renews itself more slowly, so old cells hang around for longer. Add a few decades of walking and standing, and heels build hard skin quickly.",
        "You scrub, it looks better for a few days, and then it's back.",
      ],
      key: "Scrubbing only takes off the top. The rest of the layer stays put.",
    },
    {
      title: "You've started choosing shoes to hide your feet",
      body: [
        "Closed shoes when it's hot. Feet tucked under the chair. Saying no to a day at the pool.",
        "It's a small thing, but it adds up. Your feet are meant to carry you, not to be something you hide.",
      ],
      key: "You shouldn't have to think about your feet at all.",
    },
    {
      title: "A pedicure helps, but it's a trip, a cost, and it doesn't last",
      body: [
        "A pedicure is a treat. But getting there, paying each time, and watching the hard skin come back within a couple of weeks makes it hard to keep up.",
        "And not everyone is comfortable with someone scraping at their heels.",
      ],
      key: "Good foot care shouldn't depend on an appointment.",
    },
  ],
  midCta: {
    title: "Recognise three or more of these?",
    body: "There's a simpler way to get soft feet, and you can do it sitting in your own chair.",
  },
  bridge: {
    kicker: "Why the usual advice stops working",
    title: "It's not your effort. It's the method.",
    paras: [
      "Almost every foot-care habit we grew up with works the same way: you take the hard skin off by force. Scrub, file, scrape.",
      "That works when you can bend easily and your skin sheds quickly. After 50, both of those change. The hard skin builds faster, and removing it gets harder to do.",
    ],
    pull: "So what you need isn't more effort. It's a method that removes the hard skin for you while you sit down.",
  },
  solution: {
    title: "Soft feet again, without bending or scraping",
    intro: [
      "An exfoliating foot peel works the other way round. Instead of you scrubbing the hard skin off, it loosens the skin so it lifts away by itself.",
      "Silkpedi is a peel you do at home, sitting down.",
    ],
    steps: [
      { title: "Sit down", body: "Slip the booties on in your chair. No bath, no standing on one leg." },
      { title: "Relax for an hour", body: "Have your tea, watch your programme, then rinse. That's the whole treatment." },
      { title: "Let it work", body: "The old skin lifts away in the shower over the next days. In about 7–10 days, soft skin is what's left." },
    ],
    inside: AHA_INSIDE,
    insight: "Once the old layer is gone, your cream finally reaches skin that can use it.",
    upkeep: "When hard skin starts building back, a treatment every 4–6 weeks keeps on top of it.",
  },
  aside: {
    title: "Buying it for a parent or partner?",
    body: "It's an easy gift to give. There's nothing to learn and nothing embarrassing about it: put the booties on together, have a cup of tea, and the hard part is done.",
  },
  expect: [
    { day: "DAY 1", title: "One hour in your chair", body: "Booties on, feet up, then rinse. Nothing shows yet." },
    { day: "DAYS 3–5", title: "The peeling starts", body: "Wear socks around the house and let the old skin come away in the shower." },
    { day: "DAYS 7–10", title: "Soft, comfortable feet", body: "The last flakes are gone and your feet feel soft and even." },
  ],
  faqs: [
    {
      q: "Is it too strong for older, thinner skin?",
      a: "Silkpedi doesn't cut, sand or burn anything. Gentle fruit-derived acids loosen the dead outer layer so it lifts away naturally. There's no pain and no heat, and most people feel nothing while the booties are on.",
    },
    {
      q: "Do I have to bend down or scrub?",
      a: "No. You put the booties on sitting down, and the peel does the work. The foot file in the 2- and 3-pack is optional, for tidying up loose flakes at the end.",
    },
    {
      q: "I have diabetes or poor circulation. Can I use it?",
      a: "Please check with your doctor or clinic first, and don't use Silkpedi on open cuts, wounds, sores or infected skin. If you're unsure, message us on WhatsApp and we'll talk it through with you honestly.",
    },
    { q: "How long until I see a difference?", a: "Peeling usually starts around day 3 to 5 and is finished by day 7 to 10." },
    DELIVERY_FAQ,
  ],
  closing: {
    title: "Your feet have carried you this far.",
    accent: "Give them one hour back.",
    body: "No bending, no scraping, no appointment. One hour in your chair, and soft, comfortable feet in about 7–10 days.",
  },
  ctaHref: "/soft-feet-after-50?via=after-50",
  ctaLabel: "See how it works",
};
