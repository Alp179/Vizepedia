import MainPageHeader from "../ui/MainPageHeader";
import styled from "styled-components";
import Footer from "../ui/Footer";
import SlideShow from "../ui/SlideShow";
import VisaInvitationGenerator from "../ui/VisaInvitationGenerator";

const Fullpage = styled.div`
margin: 0;
  min-height: 100vh;
  height: 100%;
  min-width: 100vw;
  width: 100%;
  background: var(--color-grey-1);
`;

const DavetiyeContainer = styled.div`
 padding-top: 120px;
`;

function Davetiye() {
  return (
    <Fullpage>
      <MainPageHeader />
      <DavetiyeContainer>
        <VisaInvitationGenerator />
      </DavetiyeContainer>
      <SlideShow />
      <Footer />
    </Fullpage>
  );
}

export default Davetiye;
