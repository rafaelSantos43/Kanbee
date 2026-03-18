// app/index.tsx
import { useSessionStore } from '@/store/useSessionStore'
import { Redirect } from 'expo-router'

export default function Index() {
  const { authenticated, user } = useSessionStore()

  if (authenticated && user?.id) {
    return <Redirect href='/(main)/(board)/' />
  }

  return <Redirect href='/(auth)' />
}
