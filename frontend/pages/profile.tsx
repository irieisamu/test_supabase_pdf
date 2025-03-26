import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'
import useUser from '@/lib/useUser'

export default function ProfilePage() {
  const { user, loading } = useUser()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setName(data.name)
        setAge(data.age)
      }
    }
    fetchData()
  }, [user])

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    console.log('user.id:', user?.id)
    const { error } = await supabase.from('profiles').upsert({ id: user?.id, name, age })
    if (error) {
      console.error('保存エラー:', error)
      alert('保存に失敗しました')
    } else {
      alert('保存しました！')
    }
  }

  if (loading) return <p>読み込み中...</p>
  if (!user) return <p>ログインしてください</p>

  const handlePdf = async () => {
    // Supabaseの職歴データも取得
    const { data: { user } } = await supabase.auth.getUser()
  
    if (!user) {
      alert('ログイン情報が取得できませんでした')
      return
    }
    
    const { data: workHistory } = await supabase
      .from('work_histories')
      .select('*')
      .eq('user_id', user.id)
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        age,
        work_history: workHistory || []
      })
    })
  
    if (!response.ok) {
      alert('PDF生成に失敗しました')
      return
    }
  
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    window.open(url) // 新しいタブでPDF表示
  }  

  return (
    <>
      <h1>プロフィール</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="名前" />
      <input value={age} onChange={e => setAge(e.target.value)} placeholder="年齢" />
      <button onClick={handleSave}>保存</button>
      <button onClick={handlePdf}>PDF出力</button>
    </>
  )
}
