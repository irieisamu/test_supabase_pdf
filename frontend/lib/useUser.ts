// lib/useUser.ts
import { useEffect, useState } from 'react'
import supabase from './supabase'

export default function useUser() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) setUser(data.user)
      setLoading(false)
    }

    fetchUser()
  }, [])

  return { user, loading }
}
