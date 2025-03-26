import { useState } from 'react'
import supabase from '@/lib/supabase'
import useUser from '@/lib/useUser'

export default function LoginPage() {
  const { user } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else window.location.href = '/profile'
  }

  if (user) return <p>ログイン済みです</p>

  return (
    <div>
      <h1>ログイン</h1>
      <input placeholder="メール" onChange={e => setEmail(e.target.value)} />
      <input placeholder="パスワード" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>ログイン</button>
    </div>
  )
}
