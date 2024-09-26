import React from "react";
import { useParams } from "react-router-dom";

const EditList: React.FC = () => {
  const { listId } = useParams();
  return <div>Edit list {listId}</div>;
};

export default EditList;
