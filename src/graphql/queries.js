import { gql } from "@apollo/client";

export const UPDATE_CONVERSATION = gql`
  query UpdateConversation($input: UpdateConversationInput!) {
    updateConversation(input: $input)
  }
`;
