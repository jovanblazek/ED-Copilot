/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query ConflictDetails($factionId: UUID!, $systemId: UUID!) {\n  factionConflicts(\n    condition: {factionId: $factionId, systemId: $systemId}\n    first: 1\n  ) {\n    nodes {\n      faction {\n        name\n      }\n      factionStakeStation {\n        name\n        stationType\n      }\n      factionWonDays\n      opponentFaction {\n        name\n      }\n      opponentStakeStation {\n        name\n        stationType\n      }\n      opponentWonDays\n      status\n      system {\n        name\n      }\n      type\n    }\n  }\n}": typeof types.ConflictDetailsDocument,
    "query ConflictDetailsByOpponent($factionId: UUID!, $systemId: UUID!, $opponentFactionId: UUID!) {\n  factionConflictByFactionIdAndSystemIdAndOpponentFactionId(\n    factionId: $factionId\n    systemId: $systemId\n    opponentFactionId: $opponentFactionId\n  ) {\n    faction {\n      name\n    }\n    factionStakeStation {\n      name\n      stationType\n    }\n    factionWonDays\n    opponentFaction {\n      name\n    }\n    opponentStakeStation {\n      name\n      stationType\n    }\n    opponentWonDays\n    status\n    system {\n      name\n    }\n    type\n  }\n}": typeof types.ConflictDetailsByOpponentDocument,
    "query CopilotFactionByName($name: String!) {\n  factionByName(name: $name) {\n    id\n    name\n    allegiance\n    systemFactions {\n      totalCount\n    }\n  }\n}": typeof types.CopilotFactionByNameDocument,
    "query FactionByName($name: String!) {\n  factionByName(name: $name) {\n    id\n  }\n}": typeof types.FactionByNameDocument,
    "query FactionConflicts($factionId: UUID!, $first: Int!, $after: Cursor) {\n  factionConflicts(\n    condition: {factionId: $factionId}\n    first: $first\n    after: $after\n  ) {\n    edges {\n      cursor\n      node {\n        system {\n          name\n        }\n        faction {\n          name\n        }\n        factionStakeStation {\n          name\n          stationType\n        }\n        opponentFaction {\n          name\n        }\n        opponentStakeStation {\n          name\n          stationType\n        }\n        factionWonDays\n        opponentWonDays\n        status\n        type\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}": typeof types.FactionConflictsDocument,
    "query FactionStateNotificationDetails($factionId: UUID!, $systemId: UUID!) {\n  controller: factionStateByFactionIdAndSystemId(\n    factionId: $factionId\n    systemId: $systemId\n  ) {\n    influence\n    faction {\n      name\n    }\n    system {\n      name\n    }\n  }\n}": typeof types.FactionStateNotificationDetailsDocument,
    "query FactionSystems($factionId: UUID!, $first: Int!, $after: Cursor) {\n  faction(id: $factionId) {\n    factionStates(orderBy: INFLUENCE_DESC, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          influence\n          system {\n            name\n            updatedAt\n          }\n          activeStates\n          pendingStates\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n}": typeof types.FactionSystemsDocument,
    "query PossibleExpansionOrigins($factionId: UUID!) {\n  factionStates(\n    condition: {factionId: $factionId}\n    orderBy: INFLUENCE_DESC\n    first: 10\n  ) {\n    nodes {\n      influence\n      system {\n        name\n      }\n    }\n  }\n}": typeof types.PossibleExpansionOriginsDocument,
    "query ThreatDetails($factionId: UUID!, $challengerFactionId: UUID!, $systemId: UUID!) {\n  controller: factionStateByFactionIdAndSystemId(\n    factionId: $factionId\n    systemId: $systemId\n  ) {\n    influence\n    faction {\n      name\n    }\n    system {\n      name\n    }\n  }\n  challenger: factionStateByFactionIdAndSystemId(\n    factionId: $challengerFactionId\n    systemId: $systemId\n  ) {\n    influence\n    faction {\n      name\n    }\n  }\n}": typeof types.ThreatDetailsDocument,
};
const documents: Documents = {
    "query ConflictDetails($factionId: UUID!, $systemId: UUID!) {\n  factionConflicts(\n    condition: {factionId: $factionId, systemId: $systemId}\n    first: 1\n  ) {\n    nodes {\n      faction {\n        name\n      }\n      factionStakeStation {\n        name\n        stationType\n      }\n      factionWonDays\n      opponentFaction {\n        name\n      }\n      opponentStakeStation {\n        name\n        stationType\n      }\n      opponentWonDays\n      status\n      system {\n        name\n      }\n      type\n    }\n  }\n}": types.ConflictDetailsDocument,
    "query ConflictDetailsByOpponent($factionId: UUID!, $systemId: UUID!, $opponentFactionId: UUID!) {\n  factionConflictByFactionIdAndSystemIdAndOpponentFactionId(\n    factionId: $factionId\n    systemId: $systemId\n    opponentFactionId: $opponentFactionId\n  ) {\n    faction {\n      name\n    }\n    factionStakeStation {\n      name\n      stationType\n    }\n    factionWonDays\n    opponentFaction {\n      name\n    }\n    opponentStakeStation {\n      name\n      stationType\n    }\n    opponentWonDays\n    status\n    system {\n      name\n    }\n    type\n  }\n}": types.ConflictDetailsByOpponentDocument,
    "query CopilotFactionByName($name: String!) {\n  factionByName(name: $name) {\n    id\n    name\n    allegiance\n    systemFactions {\n      totalCount\n    }\n  }\n}": types.CopilotFactionByNameDocument,
    "query FactionByName($name: String!) {\n  factionByName(name: $name) {\n    id\n  }\n}": types.FactionByNameDocument,
    "query FactionConflicts($factionId: UUID!, $first: Int!, $after: Cursor) {\n  factionConflicts(\n    condition: {factionId: $factionId}\n    first: $first\n    after: $after\n  ) {\n    edges {\n      cursor\n      node {\n        system {\n          name\n        }\n        faction {\n          name\n        }\n        factionStakeStation {\n          name\n          stationType\n        }\n        opponentFaction {\n          name\n        }\n        opponentStakeStation {\n          name\n          stationType\n        }\n        factionWonDays\n        opponentWonDays\n        status\n        type\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}": types.FactionConflictsDocument,
    "query FactionStateNotificationDetails($factionId: UUID!, $systemId: UUID!) {\n  controller: factionStateByFactionIdAndSystemId(\n    factionId: $factionId\n    systemId: $systemId\n  ) {\n    influence\n    faction {\n      name\n    }\n    system {\n      name\n    }\n  }\n}": types.FactionStateNotificationDetailsDocument,
    "query FactionSystems($factionId: UUID!, $first: Int!, $after: Cursor) {\n  faction(id: $factionId) {\n    factionStates(orderBy: INFLUENCE_DESC, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          influence\n          system {\n            name\n            updatedAt\n          }\n          activeStates\n          pendingStates\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n}": types.FactionSystemsDocument,
    "query PossibleExpansionOrigins($factionId: UUID!) {\n  factionStates(\n    condition: {factionId: $factionId}\n    orderBy: INFLUENCE_DESC\n    first: 10\n  ) {\n    nodes {\n      influence\n      system {\n        name\n      }\n    }\n  }\n}": types.PossibleExpansionOriginsDocument,
    "query ThreatDetails($factionId: UUID!, $challengerFactionId: UUID!, $systemId: UUID!) {\n  controller: factionStateByFactionIdAndSystemId(\n    factionId: $factionId\n    systemId: $systemId\n  ) {\n    influence\n    faction {\n      name\n    }\n    system {\n      name\n    }\n  }\n  challenger: factionStateByFactionIdAndSystemId(\n    factionId: $challengerFactionId\n    systemId: $systemId\n  ) {\n    influence\n    faction {\n      name\n    }\n  }\n}": types.ThreatDetailsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ConflictDetails($factionId: UUID!, $systemId: UUID!) {\n  factionConflicts(\n    condition: {factionId: $factionId, systemId: $systemId}\n    first: 1\n  ) {\n    nodes {\n      faction {\n        name\n      }\n      factionStakeStation {\n        name\n        stationType\n      }\n      factionWonDays\n      opponentFaction {\n        name\n      }\n      opponentStakeStation {\n        name\n        stationType\n      }\n      opponentWonDays\n      status\n      system {\n        name\n      }\n      type\n    }\n  }\n}"): (typeof documents)["query ConflictDetails($factionId: UUID!, $systemId: UUID!) {\n  factionConflicts(\n    condition: {factionId: $factionId, systemId: $systemId}\n    first: 1\n  ) {\n    nodes {\n      faction {\n        name\n      }\n      factionStakeStation {\n        name\n        stationType\n      }\n      factionWonDays\n      opponentFaction {\n        name\n      }\n      opponentStakeStation {\n        name\n        stationType\n      }\n      opponentWonDays\n      status\n      system {\n        name\n      }\n      type\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ConflictDetailsByOpponent($factionId: UUID!, $systemId: UUID!, $opponentFactionId: UUID!) {\n  factionConflictByFactionIdAndSystemIdAndOpponentFactionId(\n    factionId: $factionId\n    systemId: $systemId\n    opponentFactionId: $opponentFactionId\n  ) {\n    faction {\n      name\n    }\n    factionStakeStation {\n      name\n      stationType\n    }\n    factionWonDays\n    opponentFaction {\n      name\n    }\n    opponentStakeStation {\n      name\n      stationType\n    }\n    opponentWonDays\n    status\n    system {\n      name\n    }\n    type\n  }\n}"): (typeof documents)["query ConflictDetailsByOpponent($factionId: UUID!, $systemId: UUID!, $opponentFactionId: UUID!) {\n  factionConflictByFactionIdAndSystemIdAndOpponentFactionId(\n    factionId: $factionId\n    systemId: $systemId\n    opponentFactionId: $opponentFactionId\n  ) {\n    faction {\n      name\n    }\n    factionStakeStation {\n      name\n      stationType\n    }\n    factionWonDays\n    opponentFaction {\n      name\n    }\n    opponentStakeStation {\n      name\n      stationType\n    }\n    opponentWonDays\n    status\n    system {\n      name\n    }\n    type\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query CopilotFactionByName($name: String!) {\n  factionByName(name: $name) {\n    id\n    name\n    allegiance\n    systemFactions {\n      totalCount\n    }\n  }\n}"): (typeof documents)["query CopilotFactionByName($name: String!) {\n  factionByName(name: $name) {\n    id\n    name\n    allegiance\n    systemFactions {\n      totalCount\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FactionByName($name: String!) {\n  factionByName(name: $name) {\n    id\n  }\n}"): (typeof documents)["query FactionByName($name: String!) {\n  factionByName(name: $name) {\n    id\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FactionConflicts($factionId: UUID!, $first: Int!, $after: Cursor) {\n  factionConflicts(\n    condition: {factionId: $factionId}\n    first: $first\n    after: $after\n  ) {\n    edges {\n      cursor\n      node {\n        system {\n          name\n        }\n        faction {\n          name\n        }\n        factionStakeStation {\n          name\n          stationType\n        }\n        opponentFaction {\n          name\n        }\n        opponentStakeStation {\n          name\n          stationType\n        }\n        factionWonDays\n        opponentWonDays\n        status\n        type\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}"): (typeof documents)["query FactionConflicts($factionId: UUID!, $first: Int!, $after: Cursor) {\n  factionConflicts(\n    condition: {factionId: $factionId}\n    first: $first\n    after: $after\n  ) {\n    edges {\n      cursor\n      node {\n        system {\n          name\n        }\n        faction {\n          name\n        }\n        factionStakeStation {\n          name\n          stationType\n        }\n        opponentFaction {\n          name\n        }\n        opponentStakeStation {\n          name\n          stationType\n        }\n        factionWonDays\n        opponentWonDays\n        status\n        type\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FactionStateNotificationDetails($factionId: UUID!, $systemId: UUID!) {\n  controller: factionStateByFactionIdAndSystemId(\n    factionId: $factionId\n    systemId: $systemId\n  ) {\n    influence\n    faction {\n      name\n    }\n    system {\n      name\n    }\n  }\n}"): (typeof documents)["query FactionStateNotificationDetails($factionId: UUID!, $systemId: UUID!) {\n  controller: factionStateByFactionIdAndSystemId(\n    factionId: $factionId\n    systemId: $systemId\n  ) {\n    influence\n    faction {\n      name\n    }\n    system {\n      name\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FactionSystems($factionId: UUID!, $first: Int!, $after: Cursor) {\n  faction(id: $factionId) {\n    factionStates(orderBy: INFLUENCE_DESC, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          influence\n          system {\n            name\n            updatedAt\n          }\n          activeStates\n          pendingStates\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n}"): (typeof documents)["query FactionSystems($factionId: UUID!, $first: Int!, $after: Cursor) {\n  faction(id: $factionId) {\n    factionStates(orderBy: INFLUENCE_DESC, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          influence\n          system {\n            name\n            updatedAt\n          }\n          activeStates\n          pendingStates\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query PossibleExpansionOrigins($factionId: UUID!) {\n  factionStates(\n    condition: {factionId: $factionId}\n    orderBy: INFLUENCE_DESC\n    first: 10\n  ) {\n    nodes {\n      influence\n      system {\n        name\n      }\n    }\n  }\n}"): (typeof documents)["query PossibleExpansionOrigins($factionId: UUID!) {\n  factionStates(\n    condition: {factionId: $factionId}\n    orderBy: INFLUENCE_DESC\n    first: 10\n  ) {\n    nodes {\n      influence\n      system {\n        name\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ThreatDetails($factionId: UUID!, $challengerFactionId: UUID!, $systemId: UUID!) {\n  controller: factionStateByFactionIdAndSystemId(\n    factionId: $factionId\n    systemId: $systemId\n  ) {\n    influence\n    faction {\n      name\n    }\n    system {\n      name\n    }\n  }\n  challenger: factionStateByFactionIdAndSystemId(\n    factionId: $challengerFactionId\n    systemId: $systemId\n  ) {\n    influence\n    faction {\n      name\n    }\n  }\n}"): (typeof documents)["query ThreatDetails($factionId: UUID!, $challengerFactionId: UUID!, $systemId: UUID!) {\n  controller: factionStateByFactionIdAndSystemId(\n    factionId: $factionId\n    systemId: $systemId\n  ) {\n    influence\n    faction {\n      name\n    }\n    system {\n      name\n    }\n  }\n  challenger: factionStateByFactionIdAndSystemId(\n    factionId: $challengerFactionId\n    systemId: $systemId\n  ) {\n    influence\n    faction {\n      name\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;