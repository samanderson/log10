"use client";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { split, HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { Chat } from "./chat";

export const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  new GraphQLWsLink(createClient({ url: "ws://localhost:4000/graphql" })),
  new HttpLink({ uri: "http://localhost:4000/graphql" })
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <Chat />
    </ApolloProvider>
  );
}
