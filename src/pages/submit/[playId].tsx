/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { PlayForm } from '../../components/Form/CreateUpdatePlay'
import { isUserModeratorOrAbove } from '../../utils/auth'

const Home: NextPage = () => {
  const { data: session } = useSession()

  const { query } = useRouter()
  if (typeof query.playId !== 'string') return <p>Bad ID</p>

  if (!session || (session && !isUserModeratorOrAbove(session.user.role))) {
    return <p>Not authorised</p>
  }

  return <PlayForm playId={query.playId} />
}

export default Home
