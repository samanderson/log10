import { gql } from "apollo-server-express";

export const typeDefs = gql`
  enum Role {
    system
    assistant
    user
  }

  input MessageInput {
    id: ID!
    role: Role!
    content: String!
  }

  input UpdateConversationInput {
    conversationID: ID!
    allMessages: [MessageInput!]!
  }

  type MessageUpdate {
    id: ID!
    content: String!
    done: Boolean!
  }

  type Query {
    updateConversation(input: UpdateConversationInput!): ID!
  }

  type Subscription {
    assistantMessageUpdate(conversationID: ID!): MessageUpdate!
  }
`;
