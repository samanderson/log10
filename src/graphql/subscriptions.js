import { gql } from "@apollo/client";

export const ASSISTANT_MESSAGE_UPDATE = gql`
  subscription MessageUpdate($conversationID: ID!) {
    assistantMessageUpdate(conversationID: $conversationID) {
      id
      content
      done
    }
  }
`;
