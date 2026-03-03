export const levels = [
  {
    id: 'beginner',
    label: 'Beginner',
    description: 'Warm up with simple questions to get started.',
    color: '#22c55e',
    questions: [
      {
        id: 1,
        question: 'What does HTML stand for?',
        options: [
          'Hyperlinks and Text Markup Language',
          'Hyper Text Markup Language',
          'Home Tool Markup Language',
          'Hyper Tool Multi Language',
        ],
        answerIndex: 1,
        difficulty: 'easy',
      },
      {
        id: 2,
        question: 'Which tag is used to include JavaScript in HTML?',
        options: ['<code>', '<javascript>', '<script>', '<js>'],
        answerIndex: 2,
        difficulty: 'easy',
      },
      {
        id: 3,
        question: 'Which CSS property controls the text size?',
        options: ['font-style', 'text-size', 'font-size', 'text-style'],
        answerIndex: 2,
        difficulty: 'easy',
      },
    ],
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    description: 'Step it up with more challenging questions.',
    color: '#f97316',
    questions: [
      {
        id: 4,
        question: 'In React, which hook is used to manage state in a function component?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        answerIndex: 1,
        difficulty: 'medium',
      },
      {
        id: 5,
        question: 'What is the default HTTP method used by HTML forms?',
        options: ['GET', 'POST', 'PUT', 'PATCH'],
        answerIndex: 0,
        difficulty: 'medium',
      },
      {
        id: 6,
        question: 'Which array method returns a new array with only elements that pass a test?',
        options: ['map', 'filter', 'forEach', 'reduce'],
        answerIndex: 1,
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'advanced',
    label: 'Advanced',
    description: 'Prove your skills with tough questions.',
    color: '#6366f1',
    questions: [
      {
        id: 7,
        question: 'What does the “key” prop help React identify?',
        options: [
          'Which elements are clickable',
          'Which elements are expensive to render',
          'Which elements have changed, are added, or are removed',
          'Which elements should be cached',
        ],
        answerIndex: 2,
        difficulty: 'hard',
      },
      {
        id: 8,
        question: 'Which HTTP status code means “Unauthorized”?',
        options: ['200', '301', '401', '500'],
        answerIndex: 2,
        difficulty: 'hard',
      },
      {
        id: 9,
        question: 'In JavaScript, which statement is true about closures?',
        options: [
          'They only exist in classes',
          'They allow a function to access variables from its outer scope',
          'They are only available in strict mode',
          'They are deprecated in modern JavaScript',
        ],
        answerIndex: 1,
        difficulty: 'hard',
      },
    ],
  },
]

// TODO: load levels from an API or database instead of hard-coded data.
// TODO: support custom levels created by users.

