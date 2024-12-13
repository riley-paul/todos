import React from "react";
import UserAvatar from "./user-avatar";
import PendingInvites from "./pending-invites";
import { Container, Flex, Text } from "@radix-ui/themes";
import { CheckCircleIcon } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 500,
        height: "4rem",
        backgroundColor: "var(--color-panel-translucent)",
        borderBottom: "1px solid var(--gray-7)",
      }}
    >
      <Container size="2" asChild>
        <Flex align="center" height="100%">
          <Flex gap="4" justify="between" height="100%" align="center" px="4">
            <Flex align="center" gap="2">
              <CheckCircleIcon size="1.5rem" color="var(--accent-9)" />
              <Text size="6" weight="bold">
                Todos
              </Text>
            </Flex>
            <Flex gap="4">
              <PendingInvites />
              <UserAvatar />
            </Flex>
          </Flex>
        </Flex>
      </Container>
    </header>
  );
};

export default Header;
