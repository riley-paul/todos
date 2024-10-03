import PageHeader from "@/components/page-header";
import React from "react";

const ListCreate: React.FC = () => {
  return (
    <div className="grid gap-5">
      <PageHeader title="Create list" backLink="/" />
      Add a new list
    </div>
  );
};

export default ListCreate;
