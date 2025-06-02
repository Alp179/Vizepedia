import MainPageHeader from "../ui/MainPageHeader";
import styled from "styled-components";
import Footer from "../ui/Footer";
import SlideShow from "../ui/SlideShow";

const Fullpage = styled.div`
  height: 100vh;
  width: 100vw;
  background: var(--color-grey-1);
`;

function Davetiye() {
  return (
    <Fullpage>
      <MainPageHeader />
      <SlideShow />
      <Footer />
    </Fullpage>
  );
}

export default Davetiye;
