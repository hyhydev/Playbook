import { StarIcon as StarIconSolid } from '@heroicons/react/20/solid'
import { FireIcon, StarIcon as StarIconOutline } from '@heroicons/react/24/outline'
import type { Play as PlayType } from '@prisma/client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { api } from '../utils/api'
import { Tag } from './Tag'

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}

interface PlayCardProps {
  play: PlayType
}

export const PlayCard = ({ play }: PlayCardProps) => {
  const { data: session } = useSession()
  const playId = play.id
  const userId = play.userId

  const { data: user } = api.user.getById.useQuery(play.userId)

  const bookmark = api.bookmark.get.useQuery({ userId: session?.user.id || '', playId })

  const createBookmark = api.bookmark.create.useMutation({
    onSuccess: () => bookmark.refetch(),
  })
  const deleteBookmark = api.bookmark.delete.useMutation({
    onSuccess: () => bookmark.refetch(),
  })

  return (
    <div className='space-y-2'>
      <div>
        <h2 className='text-2xl font-bold leading-8 tracking-tight'>
          <p className='text-base font-medium leading-6 text-gray-500'>
            <time dateTime={formatDate(play.createdAt)}>{formatDate(play.createdAt)}</time>
          </p>
          <div className='flex items-center gap-4'>
            {session &&
              (bookmark.data ? (
                <button
                  onClick={() => deleteBookmark.mutate({ userId: session.user.id, playId })}
                  className='text-yellow-400'
                >
                  <StarIconSolid className='h-7 w-7' />
                </button>
              ) : (
                <button
                  onClick={() => session && createBookmark.mutate({ userId: session.user.id, playId })}
                  className='text-yellow-400'
                >
                  <StarIconOutline className='h-7 w-7' />
                </button>
              ))}
            <Link href={{ pathname: '/play/[playId]', query: { playId } }}>{play.name}</Link>
            <p className='text-sm text-gray-400'>
              by <Link href={{ pathname: '/user/[userId]', query: { userId } }}>{user?.name}</Link>
            </p>
          </div>
        </h2>
        <div className='flex flex-wrap gap-2'>
          {[play.character, play.type, play.speed, play.stage, play.environment]
            .filter((tag) => tag !== 'All')
            .map((tag, idx) => (
              <Tag key={idx} text={tag} />
            ))}
          <div>
            {Array(play.difficulty)
              .fill(0)
              .map((e, i) => (
                <button key={`fire-${i}`} className='text-red-400'>
                  <FireIcon className='h-4 w-4' />
                </button>
              ))}
          </div>
        </div>
      </div>
      <div className='prose max-w-none text-gray-500'>{play.description}</div>
    </div>
  )
}
