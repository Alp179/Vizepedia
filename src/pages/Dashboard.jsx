/* eslint-disable react/prop-types */

import { useUser } from "../features/authentication/useUser";

import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Spinner from "../ui/Spinner";
import Wellcome from "./Wellcome";

function Dashboard() {
  // Örnek olarak, burada 'userId' değerini elde ediyoruz.
  // Bu değeri nasıl elde ettiğinize bağlı olarak kodunuzu buraya göre ayarlayın.
  const { isLoading, answers } = useUser();

  console.log("Answers:", answers);

  if (isLoading) {
    return <Spinner />;
  }

  // `answers` içindeki `answer` sütununu kontrol et
  const isAnswerFilled = answers.length;
  console.log(answers);
  return (
    <div>
      {isAnswerFilled > 0 ? (
        <Row type="horizontal">
          <Heading as="h1">Dashboard</Heading>
          <p>TEST</p>
        </Row>
      ) : (
        <Wellcome />
      )}
    </div>
  );
}

export default Dashboard;
