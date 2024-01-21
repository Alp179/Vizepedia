import DocRow from "../features/doc-details/DocRow";
import { useDocNames } from "../features/doc-details/useDocNames";
import Spinner from "./Spinner";
import Table from "./Table";

function AllDocs() {
  const { isLoading, docNames } = useDocNames();

  if (isLoading) return <Spinner />;

  return (
    <Table>
      <Table.Header>
        <div>Tüm Belgeler</div>
      </Table.Header>
      <Table.Body
        data={docNames}
        render={(doc) => <DocRow docName={doc.docName} key={doc.id} />}
      />
    </Table>
  );
}

export default AllDocs;
