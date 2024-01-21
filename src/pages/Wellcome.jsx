import Header from "../ui/Header";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Wellcome() {
  return (
    <>
      <Header />
      <Row type="horizontal">
        <Heading as="h1">Sorular ekranı</Heading>
        <p>TEST</p>
      </Row>
    </>
  );
}

export default Wellcome;
