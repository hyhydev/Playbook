import { FireIcon } from '@heroicons/react/24/outline'
import type { Play as PlayType } from '@prisma/client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { api } from '../utils/api'
import { isUserModeratorOrAbove } from '../utils/auth'
import { Tag } from './Tag'

const YoutubeEmbed = ({ youtubeId }: { youtubeId: string }) => (
  <div className='video-responsive aspect-w-16 aspect-h-9'>
    <iframe
      src={`https://www.youtube.com/embed/${youtubeId}?modestbranding=1&autohide=1&showinfo=0&controls=0${
        youtubeId.includes('?') ? '' : `&playlist=${youtubeId.slice(-11)}&loop=1`
      }`}
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    />
  </div>
)

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}

interface PlayProps {
  play: PlayType
  youtubeEmbed: 'inline' | 'above' | 'none'
}

export const Play = ({ play, youtubeEmbed }: PlayProps) => {
  const [hidden, setHidden] = useState('')
  const id = play.id

  const { data: user } = api.user.getById.useQuery(play.userId)

  const { data: session } = useSession()
  const approvePlay = api.play.approveById.useMutation()
  const unapprovePlay = api.play.unapproveById.useMutation()
  const deletePlay = api.play.deleteById.useMutation()

  return (
    <li className={`py-12 ${hidden}`}>
      <article>
        <div className='space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0'>
          <div className='space-y-5 xl:col-span-2'>
            <div className='space-y-6'>
              <div>
                <h2 className='text-2xl font-bold leading-8 tracking-tight'>
                  <p className='text-base font-medium leading-6 text-gray-500'>
                    <time dateTime={formatDate(play.createdAt)}>{formatDate(play.createdAt)}</time>
                  </p>
                  <div className='flex items-center gap-4'>
                    <Link href={{ pathname: '/play/[id]', query: { id } }}>{play.name}</Link>
                    <p className='text-sm text-gray-400'>by {user?.name}</p>
                  </div>
                </h2>
                <div className='flex flex-wrap'>
                  {[play.character, play.type, play.speed, play.stage, play.environment]
                    .filter((tag) => tag !== 'All')
                    .map((tag, idx) => (
                      <Tag key={idx} text={tag} />
                    ))}
                </div>
              </div>
              <div className='prose max-w-none text-gray-500 dark:text-gray-400'>{play.description}</div>
            </div>
            <div>
              {Array(play.difficulty)
                .fill(0)
                .map((e, i) => (
                  <button key={`fire-${i}`} className='mb-3 text-red-500'>
                    <FireIcon className='h-8 w-8' />
                  </button>
                ))}
            </div>
          </div>
          {youtubeEmbed === 'inline' && (
            <div className='xl:col-span-1'>
              <YoutubeEmbed youtubeId={play.youtubeId} />
            </div>
          )}
        </div>
        {session && isUserModeratorOrAbove(session?.user.role) && (
          <>
            <button className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-cyan-200 group-hover:from-cyan-500 group-hover:to-blue-500 dark:text-white dark:focus:ring-cyan-800'>
              <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                Edit
              </span>
            </button>
            {play.approved ? (
              <button
                onClick={() => {
                  unapprovePlay.mutate(id)
                  setHidden('hidden')
                }}
                className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800'
              >
                <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                  Unapprove
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  approvePlay.mutate(id)
                  setHidden('hidden')
                }}
                className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800'
              >
                <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                  Approve
                </span>
              </button>
            )}
            {!play.approved && (
              <button
                onClick={() => {
                  deletePlay.mutate(id)
                  setHidden('hidden')
                }}
                className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-pink-200 group-hover:from-pink-500 group-hover:to-orange-400 dark:text-white dark:focus:ring-pink-800'
              >
                <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                  Delete
                </span>
              </button>
            )}
          </>
        )}
      </article>
    </li>
  )
}
