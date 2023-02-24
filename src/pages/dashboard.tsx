import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { Play } from "../components/Play";
import { api } from "../utils/api";
import { isUserModeratorOrAbove } from "../utils/auth";

const Home: NextPage = () => {
  const { data: session } = useSession()

  if (session && !isUserModeratorOrAbove(session.user.role)) {
    return <p>Not authorised</p>;
  }

  const { data: plays } = api.play.getAllUnapproved.useQuery();
  
  return (
    <main>
      <div className="divide-y">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-9 sm:leading-10 md:leading-14 tracking-tight">
            Unapproved Play Queue
          </h1>
        </div>
        <ul className="divide-y">
          {!plays && 'Loading plays...'}
          {plays && !plays.length && 'No plays found'}
          {plays && plays.map((play, idx) => (<Play key={idx} play={play} youtubeEmbed={'inline'} />))}
        </ul>
      </div>
    </main>
  )

}

export default Home