import Banner from "./_components/banner";
import Bento from "./_components/bento";
import Flows from "./_components/flows";
import Latest from "./_components/latest";
import Review from "./_components/review";
import Support from "./_components/support";

export default function HomePage() {
  return (
    <div className="overflow-x-clip">
      <Banner />
      <Support />
      <Flows />
      <Bento />
      <Latest />
      <Review />
    </div>
  );
}
