/**
 * QuizForge Parser
 * Parses .txt files in the QuizForge format into quiz question objects.
 *
 * Format:
 *   Question text
 *   = Correct answer
 *   - Wrong answer 1
 *   - Wrong answer 2
 *   (blank line separates questions)
 */

export function parseQuizFile(text) {
  const errors = []
  const questions = []

  if (!text || text.trim().length === 0) {
    return { questions: [], errors: ['File is empty.'] }
  }

  // Normalize line endings
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const blocks = normalized.split(/\n{2,}/).map(b => b.trim()).filter(Boolean)

  if (blocks.length === 0) {
    return { questions: [], errors: ['No question blocks found. Separate questions with a blank line.'] }
  }

  blocks.forEach((block, blockIndex) => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean)

    if (lines.length === 0) return

    const result = parseBlock(lines, blockIndex + 1)
    if (result.error) {
      errors.push(result.error)
    } else {
      questions.push(result.question)
    }
  })

  return { questions, errors }
}

function parseBlock(lines, blockNum) {
  const questionLines = []
  let correctAnswer = null
  const incorrectAnswers = []

  for (const line of lines) {
    if (line.startsWith('=')) {
      const answer = line.slice(1).trim()
      if (!answer) {
        return { error: `Block ${blockNum}: Correct answer marker "=" found but no answer text.` }
      }
      if (correctAnswer !== null) {
        return { error: `Block ${blockNum}: Multiple correct answers (=) found. Only one is allowed.` }
      }
      correctAnswer = answer
    } else if (line.startsWith('*') || line.startsWith('-')) {
      const answer = line.slice(1).trim()
      if (!answer) {
        return { error: `Block ${blockNum}: Incorrect answer marker found but no answer text.` }
      }
      incorrectAnswers.push(answer)
    } else {
      questionLines.push(line)
    }
  }

  // Validation
  if (questionLines.length === 0) {
    return { error: `Block ${blockNum}: No question text found. Questions must appear before answer markers.` }
  }

  if (correctAnswer === null) {
    return { error: `Block ${blockNum}: No correct answer found. Add a line starting with "=" for the correct answer.` }
  }

  if (incorrectAnswers.length === 0) {
    return { error: `Block ${blockNum}: No incorrect answers found. Add lines starting with "-" or "*" for wrong answers.` }
  }

  if (incorrectAnswers.length < 1) {
    return { error: `Block ${blockNum}: At least 1 incorrect answer is required.` }
  }

  const questionText = questionLines.join(' ')

  return {
    question: {
      id: crypto.randomUUID(),
      question: questionText,
      correct_answer: correctAnswer,
      incorrect_answers: incorrectAnswers,
      all_answers: shuffleArray([correctAnswer, ...incorrectAnswers]),
    }
  }
}

export function shuffleArray(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function generateQuizFromQuestions(questions, title, description = '') {
  return {
    id: crypto.randomUUID(),
    title: title || 'Untitled Quiz',
    description,
    questions,
    question_count: questions.length,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export function validateQuizFormat(text) {
  const { questions, errors } = parseQuizFile(text)
  return {
    isValid: questions.length > 0 && errors.length === 0,
    questions,
    errors,
    stats: {
      questionCount: questions.length,
      errorCount: errors.length,
    }
  }
}

export const EXAMPLE_QUIZ_TEXT = `What is the capital of France?
= Paris
- London
- Berlin
- Madrid

What is 2 + 2?
= 4
- 3
- 5
- 6

Which planet is known as the Red Planet?
= Mars
- Venus
- Jupiter
- Saturn

What is the largest ocean on Earth?
= Pacific Ocean
- Atlantic Ocean
- Indian Ocean
- Arctic Ocean

Who painted the Mona Lisa?
= Leonardo da Vinci
- Michelangelo
- Raphael
- Vincent van Gogh`
