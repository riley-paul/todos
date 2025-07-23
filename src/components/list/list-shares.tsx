import type { ListSelect } from "@/lib/types";
import React from "react";
import { Separator, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { qListShares } from "@/lib/client/queries";
import ListUser from "./list-user";

type Props = { list: ListSelect };

const ListShares: React.FC<Props> = ({ list }) => {
  const { data: listShares = [] } = useQuery(qListShares(list.id));

  return (
    <div className="min-h-12 overflow-y-auto rounded-3 border bg-gray-3">
      <div className="grid">
        {listShares.map((share, index) => (
          <>
            {index > 0 && (
              <div className="px-3">
                <Separator size="4" />
              </div>
            )}
            <ListUser key={share.id} listUser={share} />
          </>
        ))}
        {listShares.length === 0 && (
          <Text size="2" color="gray" align="center" className="p-6">
            No shares
          </Text>
        )}
      </div>
    </div>
  );
};

export default ListShares;
