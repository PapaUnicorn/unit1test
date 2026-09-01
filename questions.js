// Question bank for Unit 1 Test, grouped into sections.
// Each section can carry a reading passage that is shown above its questions.
//
// Boolean (True/False) question:
//   { question: "...", type: "boolean", correctAnswer: true }
// Multiple choice question:
//   { question: "...", type: "choice", options: ["A", "B", "C", "D"], correctIndex: 0 }
// Matching question (each correct pair is worth 1 point):
//   { question: "...", type: "matching", pairs: [{ left: "...", right: "..." }, ...] }
// Word-bank fill-in-the-blank question (each correct blank is worth 1 point):
//   {
//     question: "...", type: "wordbank",
//     wordBank: ["word1", "word2", ...],           // one entry per blank, no distractors
//     items: [
//       { prompt: "Question text", template: ["I live in a ", { blank: 0 }, "."] }
//     ],
//     answers: ["word1", ...]                       // answers[blank id] = correct word
//   }
// Crossword question, rendered as boxed-letter entries per clue (each clue is worth 1 point):
//   {
//     question: "...", type: "crossword",
//     across: [{ number: 2, clue: "...", answer: "..." }, ...],
//     down: [{ number: 1, clue: "...", answer: "..." }, ...]
//   }

const TEST_SECTIONS = [
  {
    title: "Part 1: Reading — True or False",
    passageTitle: "We need your help… because refugees need our help",
    passage:
`Paragraph 1:
Most people in the world don't move far from the place where they lived as children. Maybe they go to the next village, or to a big city to find work. But the number of people who leave their country because they choose to or because they have to is growing—272 million in 2019. A person who moves to a different country is called a migrant.

Paragraph 2:
There are lots of reasons why migrants try to start new lives far from home. Five percent of the world's 3.3 billion workers are economic migrants, people who travel to find jobs. However, others have to move because it is dangerous in their countries. These people are refugees, and there are about 35 million around the world. Many are escaping¹ from wars, but even more—over 21 million—are climate refugees,² people escaping very hot or wet weather. Others don't feel safe just because of who they are—for example, because of the color of their skin or for what they believe.

Paragraph 3:
The journey to a new country can be dangerous because many travelers have little money, no place to stay, and no one to look after them. More than 50,000 people died in the last ten years while they were migrating. And when they arrive in a new place, the people of the country are not always friendly. It is hard to get a job there or meet people away from their homes, people and loved ones.

Paragraph 4:
We look after refugees in camps around the world. For just $10.00 a month you can help us help them.

¹To escape means to get free and run from something.
²A climate refugee is someone who must leave their home because the weather is now too hot or there is too much rain where they live.`,
    questions: [
      {
        question: "There are more migrants now than in the past.",
        type: "boolean",
        correctAnswer: true
      },
      {
        question: "A migrant is any person who moves to a different country because they need to.",
        type: "boolean",
        correctAnswer: false
      },
      {
        question: "A refugee is a migrant who cannot stay in their country for some reason.",
        type: "boolean",
        correctAnswer: true
      },
      {
        question: "Most refugees have to leave their homes because of war.",
        type: "boolean",
        correctAnswer: false
      },
      {
        question: "It is easy to get a new job for a migrant in their new country.",
        type: "boolean",
        correctAnswer: false
      },
      {
        question: "The writer wants readers to help by working in refugee camps.",
        type: "boolean",
        correctAnswer: false
      }
    ]
  },
  {
    title: "Part 2: Matching",
    questions: [
      {
        question: "Match the number to what it describes.",
        type: "matching",
        pairs: [
          { left: "The percentage of workers who are economic migrants", right: "5" },
          { left: "The number of refugees in the world", right: "35,000,000" },
          { left: "The number of migrants who died on the journey", right: "50,000" },
          { left: "The number of migrants in 2019", right: "272,000,000" },
          { left: "The number of people in the world who work", right: "3,300,000,000" }
        ]
      }
    ]
  },
  {
    title: "Part 3: Complete the Notes",
    questions: [
      {
        question: "Read the notes from a person reflecting on ideas and information. Complete the notes with the correct words.",
        type: "wordbank",
        wordBank: ["city", "countries", "economic", "friendly", "jobs", "money", "same"],
        items: [
          {
            prompt: "1. Where do you live?",
            template: ["I live in a ", { blank: 0 }, "."]
          },
          {
            prompt: "2. How many different places have you lived in your life?",
            template: ["I live in the ", { blank: 1 }, " place I did since I was a child."]
          },
          {
            prompt: "3. Do many migrants live in your city? Where are they from?",
            template: ["Many people from lots of different ", { blank: 2 }, " live here."]
          },
          {
            prompt: "4. Why did they move?",
            template: [
              "Most of them are ", { blank: 3 }, " migrants. They come because there are lots of ",
              { blank: 4 }, " here."
            ]
          },
          {
            prompt: "5. What makes life easy for them in your country?",
            template: ["It is easy to get work so they can make ", { blank: 5 }, "."]
          },
          {
            prompt: "6. What makes it difficult?",
            template: ["Many people are not ", { blank: 6 }, " towards them and call them bad names."]
          }
        ],
        answers: ["city", "same", "countries", "economic", "jobs", "money", "friendly"]
      }
    ]
  },
  {
    title: "Part 4: Crossword",
    questions: [
      {
        question: "Complete the crossword using the clues below.",
        type: "crossword",
        across: [
          { number: 2, clue: "the land that is away from towns and cities", answer: "countryside" },
          { number: 4, clue: "not the same", answer: "different" },
          { number: 6, clue: "big", answer: "huge" },
          { number: 8, clue: "the Earth—the planet where we live with all the animals and plants", answer: "world" },
          { number: 9, clue: "a person's work that they do to make money", answer: "job" },
          { number: 10, clue: "a building where you pay to sleep in a room", answer: "hotel" }
        ],
        down: [
          { number: 1, clue: "a place like China, Mexico, or Kenya, for example", answer: "country" },
          { number: 3, clue: "a place where you pay to eat a meal", answer: "restaurant" },
          { number: 5, clue: "the place on your body where your eyes, nose, and mouth are", answer: "face" },
          { number: 7, clue: "to become bigger and bigger", answer: "grow" }
        ]
      }
    ]
  },
  {
    title: "Part 5: Social Media Vocabulary",
    questions: [
      {
        question: "Complete the notes with the correct words.",
        type: "wordbank",
        wordBank: ["feed", "follow", "hashtags", "profile", "trending", "update"],
        items: [
          {
            prompt: "",
            template: [
              "Do you want more people to ", { blank: 0, number: 1 },
              " you online? Here are some basic things you can do to grow in popularity. Look at your personal ",
              { blank: 1, number: 2 },
              ". Does it tell people who you really are and what you do? No? Then the first thing to do is ",
              { blank: 2, number: 3 },
              " it with new and exciting news about you. The next question: do you use ",
              { blank: 3, number: 4 },
              ", so that people who are interested in the same topic will see your posts in their ",
              { blank: 4, number: 5 },
              "? Finally, to get lots of followers, look at what is ",
              { blank: 5, number: 6 },
              ", and share things about that topic."
            ]
          }
        ],
        answers: ["follow", "profile", "update", "hashtags", "feed", "trending"]
      }
    ]
  }
];

function flattenSections(sections) {
  const list = [];
  sections.forEach(section => {
    section.questions.forEach(q => {
      const base = {
        sectionTitle: section.title,
        passageTitle: section.passageTitle || null,
        passage: section.passage || null,
        question: q.question
      };

      if (q.type === "matching") {
        list.push({
          ...base,
          type: "matching",
          pairs: q.pairs,
          maxPoints: q.pairs.length
        });
        return;
      }

      if (q.type === "wordbank") {
        list.push({
          ...base,
          type: "wordbank",
          wordBank: q.wordBank,
          items: q.items,
          answers: q.answers,
          maxPoints: q.answers.length
        });
        return;
      }

      if (q.type === "crossword") {
        const clueList = [
          ...q.across.map(c => ({ ...c, direction: "across", key: `across-${c.number}` })),
          ...q.down.map(c => ({ ...c, direction: "down", key: `down-${c.number}` }))
        ];
        list.push({
          ...base,
          type: "crossword",
          clueList,
          maxPoints: clueList.length
        });
        return;
      }

      const isBoolean = q.type === "boolean";
      list.push({
        ...base,
        type: isBoolean ? "boolean" : "choice",
        options: isBoolean ? ["True", "False"] : q.options,
        correctIndex: isBoolean ? (q.correctAnswer ? 0 : 1) : q.correctIndex,
        maxPoints: 1
      });
    });
  });
  return list;
}

const QUESTIONS = flattenSections(TEST_SECTIONS);
const TOTAL_POSSIBLE_POINTS = QUESTIONS.reduce((sum, q) => sum + q.maxPoints, 0);
