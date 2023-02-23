import { type NextPage } from "next";
import { Play } from "../components/Play";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const { data: plays } = api.play.getAllApproved.useQuery();
  
  return (
    <main>
      <div className="divide-y">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-9 sm:leading-10 md:leading-14 tracking-tight">
            Latest Plays
          </h1>
        </div>
        <ul className="divide-y">
          {!plays && 'Loading plays...'}
          {plays && !plays.length && 'No plays found'}
          {plays && plays.map((play, idx) => (<Play key={idx} play={play} />))}
        </ul>
      </div>
    </main>
  )
};

export default Home;