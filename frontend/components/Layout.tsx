// components/Layout.tsx
import useUser from '@/lib/useUser'
import supabase from '@/lib/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser()
  const [name, setName] = useState('')

  useEffect(() => {
    const fetchName = async () => {
      if (user) {
        const { data } = await supabase.from('profiles').select('name').eq('id', user.id).single()
        setName(data?.name || '')
      }
    }
    fetchName()
  }, [user])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ヘッダー */}
      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>My App</div>
          <div>
            {loading ? (
              '読み込み中...'
            ) : user ? (
              <>
                こんにちは、{name || user.email} さん　
                <button onClick={handleLogout}>ログアウト</button>
              </>
            ) : (
              <Link href="/login">ログイン</Link>
            )}
          </div>
        </nav>
      </header>

      {/* メイン */}
      <main style={{ flex: 1, padding: '2rem' }}>{children}</main>

      {/* フッター */}
      <footer style={{ padding: '1rem', borderTop: '1px solid #ccc', textAlign: 'center' }}>
        <Link href="/">Home</Link> |{' '}
        <Link href="/profile">プロフィール</Link> |{' '}
        <Link href="/work-history">職歴</Link> |{' '}
        <Link href="/login">ログイン</Link>
      </footer>
    </div>
  )
}
