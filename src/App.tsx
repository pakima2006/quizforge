import { useEffect } from 'react'
import { supabase } from './utils/supabase'

function App() {

  useEffect(() => {
    testSupabase()
  }, [])

  async function testSupabase() {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')

    console.log('DATA:', data)
    console.log('ERROR:', error)
  }

  return (
    <h1>QuizForge работает</h1>
  )
}

export default App