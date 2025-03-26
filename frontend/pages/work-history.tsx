import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'
import useUser from '@/lib/useUser'

export default function WorkHistoryPage() {
  const { user, loading } = useUser()
  const [entries, setEntries] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    const fetchHistories = async () => {
      const { data } = await supabase.from('work_histories').select('*').eq('user_id', user.id)
      setEntries(data || [])
    }
    fetchHistories()
  }, [user])

  const addEntry = async () => {
    await supabase.from('work_histories').insert([
      {
        user_id: user.id,
        company: '株式会社サンプル',
        title: 'エンジニア',
        start_date: '2020-01',
        end_date: '2022-01'
      }
    ])
    const { data } = await supabase.from('work_histories').select('*').eq('user_id', user.id)
    setEntries(data || [])
  }

  if (loading) return <p>読み込み中...</p>
  if (!user) return <p>ログインしてください</p>

  return (
    <div>
      <h1>職歴</h1>
      <p>{user.email} さんの職歴</p>
      <button onClick={addEntry}>職歴を追加</button>
      <ul>
        {entries.map((entry, idx) => (
          <li key={idx}>
            {entry.company} - {entry.title} ({entry.start_date} ~ {entry.end_date})
          </li>
        ))}
      </ul>
      <button onClick={async () => {
        await supabase.auth.signOut()
        window.location.href = '/login'
      }}>ログアウト</button>
    </div>
  )
}
