import type { DrillItem } from '../components/ClassicDrill'

export const XFORM_DRILLS: DrillItem[] = [
  {
    id: 'vshift',
    prompt: 'g(x) = f(x) + 3. What move?',
    options: [
      { id: 'up', label: 'Vertical shift up 3' },
      { id: 'right', label: 'Horizontal shift right 3' },
      { id: 'stretch', label: 'Vertical stretch by 3' },
    ],
    answer: 'up',
    teach: 'Adding outside the function slides the graph up. f(x)+k, k>0 → up.',
  },
  {
    id: 'hshift',
    prompt: 'g(x) = f(x − 2). What move?',
    options: [
      { id: 'left', label: 'Shift left 2' },
      { id: 'right', label: 'Shift right 2' },
      { id: 'down', label: 'Shift down 2' },
    ],
    answer: 'right',
    teach: 'Inside the function, the sign flips: x − 2 is right 2. (x + 2) would be left.',
  },
  {
    id: 'rx',
    prompt: 'g(x) = −f(x). Reflect over which axis?',
    options: [
      { id: 'x', label: 'x-axis (flip the outputs)' },
      { id: 'y', label: 'y-axis (flip the inputs)' },
      { id: 'origin', label: 'No reflection — that is a shift' },
    ],
    answer: 'x',
    teach: 'A minus outside, −f(x), reflects over the x-axis.',
  },
  {
    id: 'stretch',
    prompt: 'g(x) = 2f(x). What happens to heights?',
    options: [
      { id: 's2', label: 'Vertical stretch by 2' },
      { id: 'c2', label: 'Vertical compress by 1/2' },
      { id: 'h2', label: 'Horizontal stretch by 2' },
    ],
    answer: 's2',
    teach: 'A multiplier outside |a|>1 stretches away from the x-axis. 2f(x) doubles every y.',
  },
  {
    id: 'ry',
    prompt: 'g(x) = f(−x). Reflect over which axis?',
    options: [
      { id: 'y', label: 'y-axis' },
      { id: 'x', label: 'x-axis' },
      { id: 'none', label: 'It only stretches' },
    ],
    answer: 'y',
    teach: 'A minus inside, f(−x), reflects over the y-axis.',
  },
]

export const PIECE_DRILLS: DrillItem[] = [
  {
    id: 'f2',
    prompt: 'f(x) = x + 1 if x < 2, and f(x) = 5 if x ≥ 2. What is f(2)?',
    options: [
      { id: '5', label: '5' },
      { id: '3', label: '3' },
      { id: 'undef', label: 'undefined' },
    ],
    answer: '5',
    teach: 'x = 2 uses the closed piece x ≥ 2, so f(2) = 5. The other piece is open at 2.',
  },
  {
    id: 'f0',
    prompt: 'Same f. What is f(0)?',
    options: [
      { id: '1', label: '1' },
      { id: '5', label: '5' },
      { id: '0', label: '0' },
    ],
    answer: '1',
    teach: '0 < 2, so the first piece: 0 + 1 = 1.',
  },
  {
    id: 'endpoint',
    prompt: 'A graph shows a hollow dot at (3, 4) and a filled dot at (3, 1). f(3) is…',
    options: [
      { id: '1', label: '1 — filled (closed) endpoint' },
      { id: '4', label: '4 — hollow always wins' },
      { id: 'both', label: 'both, so undefined' },
    ],
    answer: '1',
    teach: 'Closed endpoint (filled) is the value. Hollow means that piece does not include the point.',
  },
  {
    id: 'soccer',
    prompt:
      'A striker sprints 20 m in 4 s, then jogs 10 m in 5 s. Piecewise speed: which rule is on (4, 9]?',
    options: [
      { id: 'jog', label: '10/5 = 2 m/s (the jog piece)' },
      { id: 'sprint', label: '20/4 = 5 m/s on the whole [0, 9]' },
      { id: 'avg', label: 'Only the total 30/9 m/s exists' },
    ],
    answer: 'jog',
    teach: 'Each interval has its own rule. On (4, 9] the jog is 2 m/s. Average over [0, 9] is a different question (AROC).',
  },
  {
    id: 'eval',
    prompt: 'h(x) = −x if x ≤ 0, h(x) = x² if x > 0. h(−2) + h(3) =',
    options: [
      { id: '11', label: '2 + 9 = 11' },
      { id: '5', label: '−2 + 9 = 7' },
      { id: 'neg', label: '−2 + 3 = 1' },
    ],
    answer: '11',
    teach: '−2 uses −x → −(−2) = 2. 3 uses x² → 9. Sum 11. Pick the piece from the input, then evaluate.',
  },
]

export const CLAIM_DRILLS: DrillItem[] = [
  {
    id: 'abraham',
    prompt: 'Abraham (Avraham / Ibrahim) is central in Judaism because…',
    options: [
      { id: 'cov', label: 'Covenant: one God, a people, a land promise in the Torah' },
      { id: 'emp', label: 'He was the first Roman emperor' },
      { id: 'qur', label: 'He wrote the Quran in Hebrew' },
    ],
    answer: 'cov',
    teach: 'Genesis frames a covenant with Abraham. That is the Jewish starting claim — not later empires or later scriptures.',
  },
  {
    id: 'torah',
    prompt: 'The Torah, in this unit, means…',
    options: [
      { id: 'five', label: 'The Five Books — core of the Hebrew Bible' },
      { id: 'nt', label: 'The New Testament gospels' },
      { id: 'hadith', label: 'Hadith collections' },
    ],
    answer: 'five',
    teach: 'Torah = Teaching / Law, classically the five books. Gospels and Hadith belong to other canons.',
  },
  {
    id: 'jesus',
    prompt: 'Christianity keeps Jewish scripture and adds the claim that…',
    options: [
      { id: 'messiah', label: 'Jesus is the Messiah / Son, and the New Testament records that' },
      { id: 'deny', label: 'Abraham never existed, so start over' },
      { id: 'rome', label: 'Only Roman gods still count' },
    ],
    answer: 'messiah',
    teach: 'Christians read the Hebrew Bible as Old Testament and add Jesus + New Testament. They do not throw Abraham out.',
  },
  {
    id: 'testaments',
    prompt: '“Old Testament” and “New Testament” is whose library language?',
    options: [
      { id: 'chr', label: 'Christian — Jewish communities do not call their Bible “old”' },
      { id: 'jew', label: 'Jewish — it is the official Talmud name' },
      { id: 'isl', label: 'Islamic — it is a Quran chapter title' },
    ],
    answer: 'chr',
    teach: 'Testament language is Christian framing. Jews say Tanakh / Hebrew Bible. Muslims have Quran, not “testaments.”',
  },
]

export const UR_DRILLS: DrillItem[] = [
  {
    id: 'shock',
    prompt: 'Why was “one God” at Ur a shock in its neighborhood?',
    options: [
      { id: 'pantheon', label: 'Cities around Ur ran pantheons — many gods, often tied to a city' },
      { id: 'atheism', label: 'Everyone nearby was already atheist' },
      { id: 'greece', label: 'Ur was a Greek colony of Zeus' },
    ],
    answer: 'pantheon',
    teach: 'Mesopotamian cities had temples and many gods. A single, exclusive God is the disruption the unit tracks.',
  },
  {
    id: 'where',
    prompt: 'Ur sits in which world?',
    options: [
      { id: 'meso', label: 'Southern Mesopotamia (today’s Iraq), not the Nile or Greece' },
      { id: 'nile', label: 'On the Nile next to Memphis' },
      { id: 'rome', label: 'Inside the Roman Forum' },
    ],
    answer: 'meso',
    teach: 'Pin Ur on the Tigris–Euphrates world. Egypt and Greece are other pantheon maps, not Abraham’s starting city.',
  },
  {
    id: 'notnasa',
    prompt: 'Reading Ur vs a pantheon city, the move is…',
    options: [
      { id: 'compare', label: 'Compare claims: exclusive God vs many gods with city temples' },
      { id: 'orbit', label: 'Measure orbital periods like a NASA brief' },
      { id: 'deny', label: 'Assume every old city believed the same thing' },
    ],
    answer: 'compare',
    teach: 'History here is claim vs claim on a map, not spaceflight chrome. Same dirt, different gods.',
  },
]

export const ISLAM_DRILLS: DrillItem[] = [
  {
    id: 'share',
    prompt: 'Islam shares which core with Judaism and Christianity?',
    options: [
      { id: 'one', label: 'One God, Abraham as a founding figure, prophets, revealed text' },
      { id: 'trinity', label: 'The Trinity as required doctrine' },
      { id: 'torahonly', label: 'The Torah as the final sealed book' },
    ],
    answer: 'one',
    teach: 'Shared: tawhid / monotheism, Ibrahim, prophecy, scripture. Not shared: Trinity, or “Torah is the last word.”',
  },
  {
    id: 'change',
    prompt: 'A change Islam insists on relative to Christianity is…',
    options: [
      { id: 'prophet', label: 'Jesus is a prophet, not the Son; Muhammad is the final prophet; Quran is the final book' },
      { id: 'poly', label: 'Many gods are restored' },
      { id: 'drop', label: 'Abraham is dropped from the story' },
    ],
    answer: 'prophet',
    teach: 'Islam keeps Jesus in the line as a prophet, rejects sonship, and names Muhammad + Quran as the seal.',
  },
  {
    id: 'lang',
    prompt: 'The Quran, in Muslim claim, is…',
    options: [
      { id: 'ar', label: 'God’s speech in Arabic, not a “New Testament 2”' },
      { id: 'lat', label: 'A Latin sequel to the gospels' },
      { id: 'tal', label: 'A commentary on the Talmud only' },
    ],
    answer: 'ar',
    teach: 'Muslims treat the Quran as recitation in Arabic — a new revelation, not a Christian volume number.',
  },
]

export const FORGE_DRILLS: DrillItem[] = [
  {
    id: 'mono',
    prompt: 'Glucose is a monomer for which polymer?',
    options: [
      { id: 'starch', label: 'Starch / cellulose (carbs)' },
      { id: 'dna', label: 'DNA only' },
      { id: 'fat', label: 'Triglycerides' },
    ],
    answer: 'starch',
    teach: 'Sugar monomers link into polysaccharides. DNA’s sugar is deoxyribose in nucleotides, not glucose chains.',
  },
  {
    id: 'aa',
    prompt: 'Amino acids build…',
    options: [
      { id: 'prot', label: 'Proteins (peptide bonds)' },
      { id: 'lip', label: 'Lipids' },
      { id: 'rna', label: 'RNA bases' },
    ],
    answer: 'prot',
    teach: 'Peptide bond: carboxyl of one amino acid + amino of the next. Lipids are not amino-acid polymers.',
  },
  {
    id: 'deh',
    prompt: 'Dehydration synthesis does what?',
    options: [
      { id: 'join', label: 'Joins monomers and releases water' },
      { id: 'split', label: 'Splits polymers by adding water' },
      { id: 'burn', label: 'Burns the molecule for ATP only' },
    ],
    answer: 'join',
    teach: 'Craft: remove H and OH (water) to link. Hydrolysis is the reverse — add water to break.',
  },
  {
    id: 'hyd',
    prompt: 'Hydrolysis is the salvage move because…',
    options: [
      { id: 'add', label: 'Water is added; the polymer bond breaks' },
      { id: 'dry', label: 'Water is removed; polymers grow' },
      { id: 'ion', label: 'Only ions are exchanged, no bonds' },
    ],
    answer: 'add',
    teach: 'Hydro = water, lysis = split. That is loot-break, not forge.',
  },
]

export const ID_DRILLS: DrillItem[] = [
  {
    id: 'carb',
    prompt: 'C:H:O near 1:2:1, ring sugars. Tag?',
    options: [
      { id: 'carb', label: 'Carbohydrate' },
      { id: 'prot', label: 'Protein' },
      { id: 'lip', label: 'Lipid' },
    ],
    answer: 'carb',
    teach: 'Carbs are hydrated carbon. That ratio plus rings is the giveaway.',
  },
  {
    id: 'prot',
    prompt: 'N in the backbone, peptide bonds, R-groups. Tag?',
    options: [
      { id: 'prot', label: 'Protein' },
      { id: 'nuc', label: 'Nucleic acid' },
      { id: 'carb', label: 'Carbohydrate' },
    ],
    answer: 'prot',
    teach: 'Nitrogen in a repeating N–C–C backbone is protein, not sugar.',
  },
  {
    id: 'lip',
    prompt: 'Long C–H tails, barely any oxygen, hates water. Tag?',
    options: [
      { id: 'lip', label: 'Lipid' },
      { id: 'carb', label: 'Carbohydrate' },
      { id: 'nuc', label: 'Nucleic acid' },
    ],
    answer: 'lip',
    teach: 'Hydrophobic tails. Lipids are not 1:2:1 and not polymers of amino acids.',
  },
  {
    id: 'nuc',
    prompt: 'Phosphate + sugar + base. Tag?',
    options: [
      { id: 'nuc', label: 'Nucleic acid' },
      { id: 'prot', label: 'Protein' },
      { id: 'lip', label: 'Lipid' },
    ],
    answer: 'nuc',
    teach: 'Nucleotide parts: phosphate, pentose, nitrogenous base. That is DNA/RNA loot.',
  },
]

export const GROUP_DRILLS: DrillItem[] = [
  {
    id: 'oh',
    prompt: '—OH (hydroxyl) on a carbon chain tends to…',
    options: [
      { id: 'water', label: 'Make the molecule more water-friendly (polar)' },
      { id: 'oil', label: 'Make it a pure oil with no polarity' },
      { id: 'base', label: 'Act as the DNA backbone phosphate' },
    ],
    answer: 'water',
    teach: 'Hydroxyl is polar. Alcohols mix with water better than a naked hydrocarbon.',
  },
  {
    id: 'cooh',
    prompt: '—COOH (carboxyl) is the acid move because…',
    options: [
      { id: 'h', label: 'It can donate H⁺ (amino acids, fatty acids)' },
      { id: 'n', label: 'It donates nitrogen' },
      { id: 'p', label: 'It is a phosphate' },
    ],
    answer: 'h',
    teach: 'Carboxyl = carbonyl + hydroxyl. It can lose the proton. That is the acid end of an amino acid.',
  },
  {
    id: 'nh2',
    prompt: '—NH₂ (amino) on an amino acid…',
    options: [
      { id: 'base', label: 'Can pick up H⁺ — the base end' },
      { id: 'sugar', label: 'Is the ring oxygen of glucose' },
      { id: 'fat', label: 'Is a fatty-acid tail' },
    ],
    answer: 'base',
    teach: 'Amino group is basic. Amino acid = amino + carboxyl + R on a central carbon.',
  },
  {
    id: 'po4',
    prompt: 'Phosphate (—PO₄) shows up hard in…',
    options: [
      { id: 'atp', label: 'ATP / DNA-RNA backbones — energy and information' },
      { id: 'starch', label: 'Starch rings only' },
      { id: 'ch', label: 'Methane' },
    ],
    answer: 'atp',
    teach: 'Phosphate is the charged mod: ATP transfers, nucleic acids string together.',
  },
]
