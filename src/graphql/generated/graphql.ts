/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /**
   * A signed eight-byte integer. The upper big integer values are greater than the
   * max value for a JavaScript number. Therefore all big integers will be output as
   * strings and not numbers.
   */
  BigInt: { input: any; output: any; }
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: { input: any; output: any; }
  /**
   * A point in time as described by the [ISO
   * 8601](https://en.wikipedia.org/wiki/ISO_8601) and, if it has a timezone, [RFC
   * 3339](https://datatracker.ietf.org/doc/html/rfc3339) standards. Input values
   * that do not conform to both ISO 8601 and RFC 3339 may be coerced, which may lead
   * to unexpected results.
   */
  Datetime: { input: any; output: any; }
  /** Represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  /** A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122). */
  UUID: { input: any; output: any; }
};

export type AllegianceEnum =
  | 'Alliance'
  | 'Empire'
  | 'Federation'
  | 'Guardians'
  | 'Independent'
  | 'PilotsFederation'
  | 'Pirate'
  | 'Thargoids';

export type EconomyEnum =
  | 'Agriculture'
  | 'Colony'
  | 'Damaged'
  | 'Engineer'
  | 'Extraction'
  | 'HighTech'
  | 'Industrial'
  | 'Military'
  | 'Prison'
  | 'PrivateEnterprise'
  | 'Refinery'
  | 'Repair'
  | 'Rescue'
  | 'Service'
  | 'Terraforming'
  | 'Tourism';

export type Faction = Node & {
  __typename?: 'Faction';
  allegiance: AllegianceEnum;
  createdAt: Scalars['Datetime']['output'];
  /** Reads and enables pagination through a set of `FactionConflict`. */
  factionConflicts: FactionConflictConnection;
  /** Reads and enables pagination through a set of `FactionConflict`. */
  factionConflictsByOpponentFactionId: FactionConflictConnection;
  /** Reads and enables pagination through a set of `FactionState`. */
  factionStates: FactionStateConnection;
  government: FactionGovernmentEnum;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads and enables pagination through a set of `SystemFaction`. */
  systemFactions: SystemFactionConnection;
  /** Reads and enables pagination through a set of `System`. */
  systemsByControllingFactionId: SystemConnection;
  updatedAt: Scalars['Datetime']['output'];
};


export type FactionFactionConflictsArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<FactionConflictCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FactionConflictOrderBy>>;
};


export type FactionFactionConflictsByOpponentFactionIdArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<FactionConflictCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FactionConflictOrderBy>>;
};


export type FactionFactionStatesArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<FactionStateCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FactionStateOrderBy>>;
};


export type FactionSystemFactionsArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<SystemFactionCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SystemFactionOrderBy>>;
};


export type FactionSystemsByControllingFactionIdArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<SystemCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SystemOrderBy>>;
};

/** A condition to be used against `Faction` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type FactionCondition = {
  /** Checks for equality with the object’s `id` field. */
  id: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name: InputMaybe<Scalars['String']['input']>;
};

export type FactionConflict = Node & {
  __typename?: 'FactionConflict';
  createdAt: Scalars['Datetime']['output'];
  /** Reads a single `Faction` that is related to this `FactionConflict`. */
  faction: Maybe<Faction>;
  factionId: Scalars['UUID']['output'];
  factionStake: Maybe<Scalars['String']['output']>;
  /** Reads a single `Station` that is related to this `FactionConflict`. */
  factionStakeStation: Maybe<Station>;
  factionStakeStationId: Maybe<Scalars['UUID']['output']>;
  factionWonDays: Scalars['Int']['output'];
  id: Scalars['UUID']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads a single `Faction` that is related to this `FactionConflict`. */
  opponentFaction: Maybe<Faction>;
  opponentFactionId: Maybe<Scalars['UUID']['output']>;
  opponentStake: Maybe<Scalars['String']['output']>;
  /** Reads a single `Station` that is related to this `FactionConflict`. */
  opponentStakeStation: Maybe<Station>;
  opponentStakeStationId: Maybe<Scalars['UUID']['output']>;
  opponentWonDays: Scalars['Int']['output'];
  status: FactionConflictStatusEnum;
  /** Reads a single `System` that is related to this `FactionConflict`. */
  system: Maybe<System>;
  systemId: Scalars['UUID']['output'];
  type: FactionConflictTypeEnum;
  updatedAt: Scalars['Datetime']['output'];
};

/**
 * A condition to be used against `FactionConflict` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type FactionConflictCondition = {
  /** Checks for equality with the object’s `factionId` field. */
  factionId: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `opponentFactionId` field. */
  opponentFactionId: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `systemId` field. */
  systemId: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `FactionConflict` values. */
export type FactionConflictConnection = {
  __typename?: 'FactionConflictConnection';
  /** A list of edges which contains the `FactionConflict` and cursor to aid in pagination. */
  edges: Array<Maybe<FactionConflictEdge>>;
  /** A list of `FactionConflict` objects. */
  nodes: Array<Maybe<FactionConflict>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `FactionConflict` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `FactionConflict` edge in the connection. */
export type FactionConflictEdge = {
  __typename?: 'FactionConflictEdge';
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars['Cursor']['output']>;
  /** The `FactionConflict` at the end of the edge. */
  node: Maybe<FactionConflict>;
};

/** Methods to use when ordering `FactionConflict`. */
export type FactionConflictOrderBy =
  | 'FACTION_ID_ASC'
  | 'FACTION_ID_DESC'
  | 'ID_ASC'
  | 'ID_DESC'
  | 'NATURAL'
  | 'OPPONENT_FACTION_ID_ASC'
  | 'OPPONENT_FACTION_ID_DESC'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'SYSTEM_ID_ASC'
  | 'SYSTEM_ID_DESC';

export type FactionConflictStatusEnum =
  | 'Active'
  | 'Concluded'
  | 'Pending';

export type FactionConflictTypeEnum =
  | 'CivilWar'
  | 'Election'
  | 'War';

/** A connection to a list of `Faction` values. */
export type FactionConnection = {
  __typename?: 'FactionConnection';
  /** A list of edges which contains the `Faction` and cursor to aid in pagination. */
  edges: Array<Maybe<FactionEdge>>;
  /** A list of `Faction` objects. */
  nodes: Array<Maybe<Faction>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Faction` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Faction` edge in the connection. */
export type FactionEdge = {
  __typename?: 'FactionEdge';
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars['Cursor']['output']>;
  /** The `Faction` at the end of the edge. */
  node: Maybe<Faction>;
};

export type FactionGovernmentEnum =
  | 'Anarchy'
  | 'Communism'
  | 'Confederacy'
  | 'Cooperative'
  | 'Corporate'
  | 'Democracy'
  | 'Dictatorship'
  | 'Feudal'
  | 'Imperial'
  | 'Patronage'
  | 'Prison'
  | 'PrisonColony'
  | 'Theocracy'
  | 'Workshop';

export type FactionHappinessEnum =
  | 'Despondent'
  | 'Discontented'
  | 'Elated'
  | 'Happy'
  | 'Unhappy';

/** Methods to use when ordering `Faction`. */
export type FactionOrderBy =
  | 'ID_ASC'
  | 'ID_DESC'
  | 'NAME_ASC'
  | 'NAME_DESC'
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC';

export type FactionState = Node & {
  __typename?: 'FactionState';
  activeStates: Array<Maybe<FactionStateEnum>>;
  activeStatesRaw: Scalars['JSON']['output'];
  createdAt: Scalars['Datetime']['output'];
  /** Reads a single `Faction` that is related to this `FactionState`. */
  faction: Maybe<Faction>;
  factionId: Scalars['UUID']['output'];
  happiness: Maybe<FactionHappinessEnum>;
  id: Scalars['UUID']['output'];
  influence: Scalars['Float']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  pendingStates: Array<Maybe<FactionStateEnum>>;
  pendingStatesRaw: Scalars['JSON']['output'];
  recoveringStates: Array<Maybe<FactionStateEnum>>;
  recoveringStatesRaw: Scalars['JSON']['output'];
  /** Reads a single `System` that is related to this `FactionState`. */
  system: Maybe<System>;
  systemId: Scalars['UUID']['output'];
  updatedAt: Scalars['Datetime']['output'];
};

/**
 * A condition to be used against `FactionState` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type FactionStateCondition = {
  /** Checks for equality with the object’s `factionId` field. */
  factionId: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `systemId` field. */
  systemId: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `FactionState` values. */
export type FactionStateConnection = {
  __typename?: 'FactionStateConnection';
  /** A list of edges which contains the `FactionState` and cursor to aid in pagination. */
  edges: Array<Maybe<FactionStateEdge>>;
  /** A list of `FactionState` objects. */
  nodes: Array<Maybe<FactionState>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `FactionState` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `FactionState` edge in the connection. */
export type FactionStateEdge = {
  __typename?: 'FactionStateEdge';
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars['Cursor']['output']>;
  /** The `FactionState` at the end of the edge. */
  node: Maybe<FactionState>;
};

export type FactionStateEnum =
  | 'Blight'
  | 'Boom'
  | 'Bust'
  | 'CivilLiberty'
  | 'CivilUnrest'
  | 'CivilWar'
  | 'ColdWar'
  | 'Colonisation'
  | 'Drought'
  | 'Election'
  | 'Expansion'
  | 'Famine'
  | 'HistoricEvent'
  | 'Incursion'
  | 'Infested'
  | 'InfrastructureFailure'
  | 'Investment'
  | 'Lockdown'
  | 'NaturalDisaster'
  | 'Outbreak'
  | 'PirateAttack'
  | 'PublicHoliday'
  | 'Retreat'
  | 'Revolution'
  | 'TechnologicalLeap'
  | 'TerroristAttack'
  | 'TradeWar'
  | 'War';

/** Methods to use when ordering `FactionState`. */
export type FactionStateOrderBy =
  | 'FACTION_ID_ASC'
  | 'FACTION_ID_DESC'
  | 'ID_ASC'
  | 'ID_DESC'
  | 'INFLUENCE_ASC'
  | 'INFLUENCE_DESC'
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'SYSTEM_ID_ASC'
  | 'SYSTEM_ID_DESC';

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor: Maybe<Scalars['Cursor']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor: Maybe<Scalars['Cursor']['output']>;
};

export type PowerplayConflict = Node & {
  __typename?: 'PowerplayConflict';
  conflictProgress: Scalars['Float']['output'];
  createdAt: Scalars['Datetime']['output'];
  id: Scalars['UUID']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads a single `PowerplayPower` that is related to this `PowerplayConflict`. */
  power: Maybe<PowerplayPower>;
  powerId: Scalars['UUID']['output'];
  /** Reads a single `System` that is related to this `PowerplayConflict`. */
  system: Maybe<System>;
  systemId: Scalars['UUID']['output'];
  updatedAt: Scalars['Datetime']['output'];
};

/**
 * A condition to be used against `PowerplayConflict` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type PowerplayConflictCondition = {
  /** Checks for equality with the object’s `id` field. */
  id: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `powerId` field. */
  powerId: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `systemId` field. */
  systemId: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `PowerplayConflict` values. */
export type PowerplayConflictConnection = {
  __typename?: 'PowerplayConflictConnection';
  /** A list of edges which contains the `PowerplayConflict` and cursor to aid in pagination. */
  edges: Array<Maybe<PowerplayConflictEdge>>;
  /** A list of `PowerplayConflict` objects. */
  nodes: Array<Maybe<PowerplayConflict>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PowerplayConflict` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `PowerplayConflict` edge in the connection. */
export type PowerplayConflictEdge = {
  __typename?: 'PowerplayConflictEdge';
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars['Cursor']['output']>;
  /** The `PowerplayConflict` at the end of the edge. */
  node: Maybe<PowerplayConflict>;
};

/** Methods to use when ordering `PowerplayConflict`. */
export type PowerplayConflictOrderBy =
  | 'ID_ASC'
  | 'ID_DESC'
  | 'NATURAL'
  | 'POWER_ID_ASC'
  | 'POWER_ID_DESC'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'SYSTEM_ID_ASC'
  | 'SYSTEM_ID_DESC';

export type PowerplayPower = Node & {
  __typename?: 'PowerplayPower';
  createdAt: Scalars['Datetime']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads and enables pagination through a set of `PowerplayConflict`. */
  powerplayConflictsByPowerId: PowerplayConflictConnection;
  /** Reads and enables pagination through a set of `SystemPowerplayPower`. */
  systemPowerplayPowersByPowerId: SystemPowerplayPowerConnection;
  /** Reads and enables pagination through a set of `System`. */
  systemsByControllingPowerId: SystemConnection;
  updatedAt: Scalars['Datetime']['output'];
};


export type PowerplayPowerPowerplayConflictsByPowerIdArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<PowerplayConflictCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PowerplayConflictOrderBy>>;
};


export type PowerplayPowerSystemPowerplayPowersByPowerIdArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<SystemPowerplayPowerCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SystemPowerplayPowerOrderBy>>;
};


export type PowerplayPowerSystemsByControllingPowerIdArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<SystemCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SystemOrderBy>>;
};

/**
 * A condition to be used against `PowerplayPower` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type PowerplayPowerCondition = {
  /** Checks for equality with the object’s `id` field. */
  id: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `PowerplayPower` values. */
export type PowerplayPowerConnection = {
  __typename?: 'PowerplayPowerConnection';
  /** A list of edges which contains the `PowerplayPower` and cursor to aid in pagination. */
  edges: Array<Maybe<PowerplayPowerEdge>>;
  /** A list of `PowerplayPower` objects. */
  nodes: Array<Maybe<PowerplayPower>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PowerplayPower` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `PowerplayPower` edge in the connection. */
export type PowerplayPowerEdge = {
  __typename?: 'PowerplayPowerEdge';
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars['Cursor']['output']>;
  /** The `PowerplayPower` at the end of the edge. */
  node: Maybe<PowerplayPower>;
};

/** Methods to use when ordering `PowerplayPower`. */
export type PowerplayPowerOrderBy =
  | 'ID_ASC'
  | 'ID_DESC'
  | 'NAME_ASC'
  | 'NAME_DESC'
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC';

export type PowerplayStateEnum =
  | 'Exploited'
  | 'Fortified'
  | 'Stronghold'
  | 'Unoccupied';

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  /** Get a single `Faction`. */
  faction: Maybe<Faction>;
  /** Get a single `Faction`. */
  factionByName: Maybe<Faction>;
  /** Reads a single `Faction` using its globally unique `ID`. */
  factionByNodeId: Maybe<Faction>;
  /** Get a single `FactionConflict`. */
  factionConflict: Maybe<FactionConflict>;
  /** Get a single `FactionConflict`. */
  factionConflictByFactionIdAndSystemIdAndOpponentFactionId: Maybe<FactionConflict>;
  /** Reads a single `FactionConflict` using its globally unique `ID`. */
  factionConflictByNodeId: Maybe<FactionConflict>;
  /** Reads and enables pagination through a set of `FactionConflict`. */
  factionConflicts: Maybe<FactionConflictConnection>;
  /** Get a single `FactionState`. */
  factionState: Maybe<FactionState>;
  /** Get a single `FactionState`. */
  factionStateByFactionIdAndSystemId: Maybe<FactionState>;
  /** Reads a single `FactionState` using its globally unique `ID`. */
  factionStateByNodeId: Maybe<FactionState>;
  /** Reads and enables pagination through a set of `FactionState`. */
  factionStates: Maybe<FactionStateConnection>;
  /** Reads and enables pagination through a set of `Faction`. */
  factions: Maybe<FactionConnection>;
  /** Fetches an object given its globally unique `ID`. */
  node: Maybe<Node>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID']['output'];
  /** Get a single `PowerplayConflict`. */
  powerplayConflict: Maybe<PowerplayConflict>;
  /** Reads a single `PowerplayConflict` using its globally unique `ID`. */
  powerplayConflictByNodeId: Maybe<PowerplayConflict>;
  /** Get a single `PowerplayConflict`. */
  powerplayConflictBySystemIdAndPowerId: Maybe<PowerplayConflict>;
  /** Reads and enables pagination through a set of `PowerplayConflict`. */
  powerplayConflicts: Maybe<PowerplayConflictConnection>;
  /** Get a single `PowerplayPower`. */
  powerplayPower: Maybe<PowerplayPower>;
  /** Get a single `PowerplayPower`. */
  powerplayPowerByName: Maybe<PowerplayPower>;
  /** Reads a single `PowerplayPower` using its globally unique `ID`. */
  powerplayPowerByNodeId: Maybe<PowerplayPower>;
  /** Reads and enables pagination through a set of `PowerplayPower`. */
  powerplayPowers: Maybe<PowerplayPowerConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** Get a single `Station`. */
  station: Maybe<Station>;
  /** Get a single `Station`. */
  stationByMarketId: Maybe<Station>;
  /** Reads a single `Station` using its globally unique `ID`. */
  stationByNodeId: Maybe<Station>;
  /** Get a single `Station`. */
  stationBySystemIdAndName: Maybe<Station>;
  /** Reads and enables pagination through a set of `Station`. */
  stations: Maybe<StationConnection>;
  /** Get a single `System`. */
  system: Maybe<System>;
  /** Reads a single `System` using its globally unique `ID`. */
  systemByNodeId: Maybe<System>;
  /** Get a single `System`. */
  systemBySystemAddress: Maybe<System>;
  /** Get a single `SystemFaction`. */
  systemFaction: Maybe<SystemFaction>;
  /** Reads a single `SystemFaction` using its globally unique `ID`. */
  systemFactionByNodeId: Maybe<SystemFaction>;
  /** Reads and enables pagination through a set of `SystemFaction`. */
  systemFactions: Maybe<SystemFactionConnection>;
  /** Reads and enables pagination through a set of `System`. */
  systems: Maybe<SystemConnection>;
};


/** The root query type which gives access points into the data universe. */
export type QueryFactionArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFactionByNameArgs = {
  name: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFactionByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFactionConflictArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFactionConflictByFactionIdAndSystemIdAndOpponentFactionIdArgs = {
  factionId: Scalars['UUID']['input'];
  opponentFactionId: Scalars['UUID']['input'];
  systemId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFactionConflictByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFactionConflictsArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<FactionConflictCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FactionConflictOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryFactionStateArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFactionStateByFactionIdAndSystemIdArgs = {
  factionId: Scalars['UUID']['input'];
  systemId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFactionStateByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFactionStatesArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<FactionStateCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FactionStateOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryFactionsArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<FactionCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FactionOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPowerplayConflictArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPowerplayConflictByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPowerplayConflictBySystemIdAndPowerIdArgs = {
  powerId: Scalars['UUID']['input'];
  systemId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPowerplayConflictsArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<PowerplayConflictCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PowerplayConflictOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPowerplayPowerArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPowerplayPowerByNameArgs = {
  name: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPowerplayPowerByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPowerplayPowersArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<PowerplayPowerCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PowerplayPowerOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryStationArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryStationByMarketIdArgs = {
  marketId: Scalars['BigInt']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryStationByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryStationBySystemIdAndNameArgs = {
  name: Scalars['String']['input'];
  systemId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryStationsArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<StationCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<StationOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySystemArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySystemByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySystemBySystemAddressArgs = {
  systemAddress: Scalars['BigInt']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySystemFactionArgs = {
  factionId: Scalars['UUID']['input'];
  systemId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySystemFactionByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySystemFactionsArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<SystemFactionCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SystemFactionOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySystemsArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<SystemCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SystemOrderBy>>;
};

export type Station = Node & {
  __typename?: 'Station';
  allegiance: Maybe<AllegianceEnum>;
  /** Reads a single `Faction` that is related to this `Station`. */
  controllingFaction: Maybe<Faction>;
  controllingFactionId: Scalars['UUID']['output'];
  createdAt: Scalars['Datetime']['output'];
  distanceFromStar: Scalars['Float']['output'];
  economies: Scalars['JSON']['output'];
  economy: Maybe<EconomyEnum>;
  government: Maybe<FactionGovernmentEnum>;
  id: Scalars['UUID']['output'];
  landingPadsLarge: Scalars['Int']['output'];
  landingPadsMedium: Scalars['Int']['output'];
  landingPadsSmall: Scalars['Int']['output'];
  marketId: Maybe<Scalars['BigInt']['output']>;
  name: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  services: Scalars['JSON']['output'];
  stationType: Maybe<StationTypeEnum>;
  /** Reads a single `System` that is related to this `Station`. */
  system: Maybe<System>;
  systemId: Scalars['UUID']['output'];
  updatedAt: Scalars['Datetime']['output'];
};

/** A condition to be used against `Station` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type StationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `marketId` field. */
  marketId: InputMaybe<Scalars['BigInt']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `systemId` field. */
  systemId: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Station` values. */
export type StationConnection = {
  __typename?: 'StationConnection';
  /** A list of edges which contains the `Station` and cursor to aid in pagination. */
  edges: Array<Maybe<StationEdge>>;
  /** A list of `Station` objects. */
  nodes: Array<Maybe<Station>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Station` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Station` edge in the connection. */
export type StationEdge = {
  __typename?: 'StationEdge';
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars['Cursor']['output']>;
  /** The `Station` at the end of the edge. */
  node: Maybe<Station>;
};

/** Methods to use when ordering `Station`. */
export type StationOrderBy =
  | 'ID_ASC'
  | 'ID_DESC'
  | 'MARKET_ID_ASC'
  | 'MARKET_ID_DESC'
  | 'NAME_ASC'
  | 'NAME_DESC'
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'SYSTEM_ID_ASC'
  | 'SYSTEM_ID_DESC';

export type StationTypeEnum =
  | 'AsteroidBase'
  | 'Coriolis'
  | 'Dodec'
  | 'MegaShip'
  | 'Ocellus'
  | 'OnFootSettlement'
  | 'Orbis'
  | 'Outpost'
  | 'PlanetaryOutpost'
  | 'PlanetaryPort';

export type System = Node & {
  __typename?: 'System';
  allegiance: Maybe<AllegianceEnum>;
  /** Reads a single `Faction` that is related to this `System`. */
  controllingFaction: Maybe<Faction>;
  controllingFactionId: Maybe<Scalars['UUID']['output']>;
  /** Reads a single `PowerplayPower` that is related to this `System`. */
  controllingPower: Maybe<PowerplayPower>;
  controllingPowerId: Maybe<Scalars['UUID']['output']>;
  createdAt: Scalars['Datetime']['output'];
  economy: Maybe<EconomyEnum>;
  /** Reads and enables pagination through a set of `FactionConflict`. */
  factionConflicts: FactionConflictConnection;
  /** Reads and enables pagination through a set of `FactionState`. */
  factionStates: FactionStateConnection;
  government: Maybe<FactionGovernmentEnum>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  population: Scalars['BigInt']['output'];
  position: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  /** Reads and enables pagination through a set of `PowerplayConflict`. */
  powerplayConflicts: PowerplayConflictConnection;
  powerplayState: Maybe<PowerplayStateEnum>;
  powerplayStateControlProgress: Maybe<Scalars['Float']['output']>;
  powerplayStateReinforcement: Maybe<Scalars['Float']['output']>;
  powerplayStateUndermining: Maybe<Scalars['Float']['output']>;
  secondEconomy: Maybe<EconomyEnum>;
  security: Maybe<SystemSecurityEnum>;
  /** Reads and enables pagination through a set of `Station`. */
  stations: StationConnection;
  systemAddress: Scalars['BigInt']['output'];
  /** Reads and enables pagination through a set of `SystemFaction`. */
  systemFactions: SystemFactionConnection;
  /** Reads and enables pagination through a set of `SystemPowerplayPower`. */
  systemPowerplayPowers: SystemPowerplayPowerConnection;
  updatedAt: Scalars['Datetime']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
  z: Scalars['Float']['output'];
};


export type SystemFactionConflictsArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<FactionConflictCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FactionConflictOrderBy>>;
};


export type SystemFactionStatesArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<FactionStateCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FactionStateOrderBy>>;
};


export type SystemPowerplayConflictsArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<PowerplayConflictCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PowerplayConflictOrderBy>>;
};


export type SystemStationsArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<StationCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<StationOrderBy>>;
};


export type SystemSystemFactionsArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<SystemFactionCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SystemFactionOrderBy>>;
};


export type SystemSystemPowerplayPowersArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<SystemPowerplayPowerCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SystemPowerplayPowerOrderBy>>;
};

/** A condition to be used against `System` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type SystemCondition = {
  /** Checks for equality with the object’s `controllingFactionId` field. */
  controllingFactionId: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `controllingPowerId` field. */
  controllingPowerId: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `systemAddress` field. */
  systemAddress: InputMaybe<Scalars['BigInt']['input']>;
};

/** A connection to a list of `System` values. */
export type SystemConnection = {
  __typename?: 'SystemConnection';
  /** A list of edges which contains the `System` and cursor to aid in pagination. */
  edges: Array<Maybe<SystemEdge>>;
  /** A list of `System` objects. */
  nodes: Array<Maybe<System>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `System` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `System` edge in the connection. */
export type SystemEdge = {
  __typename?: 'SystemEdge';
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars['Cursor']['output']>;
  /** The `System` at the end of the edge. */
  node: Maybe<System>;
};

export type SystemFaction = Node & {
  __typename?: 'SystemFaction';
  createdAt: Scalars['Datetime']['output'];
  /** Reads a single `Faction` that is related to this `SystemFaction`. */
  faction: Maybe<Faction>;
  factionId: Scalars['UUID']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads a single `System` that is related to this `SystemFaction`. */
  system: Maybe<System>;
  systemId: Scalars['UUID']['output'];
  updatedAt: Scalars['Datetime']['output'];
};

/**
 * A condition to be used against `SystemFaction` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type SystemFactionCondition = {
  /** Checks for equality with the object’s `factionId` field. */
  factionId: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `systemId` field. */
  systemId: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `SystemFaction` values. */
export type SystemFactionConnection = {
  __typename?: 'SystemFactionConnection';
  /** A list of edges which contains the `SystemFaction` and cursor to aid in pagination. */
  edges: Array<Maybe<SystemFactionEdge>>;
  /** A list of `SystemFaction` objects. */
  nodes: Array<Maybe<SystemFaction>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SystemFaction` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `SystemFaction` edge in the connection. */
export type SystemFactionEdge = {
  __typename?: 'SystemFactionEdge';
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars['Cursor']['output']>;
  /** The `SystemFaction` at the end of the edge. */
  node: Maybe<SystemFaction>;
};

/** Methods to use when ordering `SystemFaction`. */
export type SystemFactionOrderBy =
  | 'FACTION_ID_ASC'
  | 'FACTION_ID_DESC'
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'SYSTEM_ID_ASC'
  | 'SYSTEM_ID_DESC';

/** Methods to use when ordering `System`. */
export type SystemOrderBy =
  | 'CONTROLLING_FACTION_ID_ASC'
  | 'CONTROLLING_FACTION_ID_DESC'
  | 'CONTROLLING_POWER_ID_ASC'
  | 'CONTROLLING_POWER_ID_DESC'
  | 'ID_ASC'
  | 'ID_DESC'
  | 'NAME_ASC'
  | 'NAME_DESC'
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'SYSTEM_ADDRESS_ASC'
  | 'SYSTEM_ADDRESS_DESC';

export type SystemPowerplayPower = {
  __typename?: 'SystemPowerplayPower';
  /** Reads a single `PowerplayPower` that is related to this `SystemPowerplayPower`. */
  power: Maybe<PowerplayPower>;
  powerId: Scalars['UUID']['output'];
  /** Reads a single `System` that is related to this `SystemPowerplayPower`. */
  system: Maybe<System>;
  systemId: Scalars['UUID']['output'];
};

/**
 * A condition to be used against `SystemPowerplayPower` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type SystemPowerplayPowerCondition = {
  /** Checks for equality with the object’s `powerId` field. */
  powerId: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `systemId` field. */
  systemId: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `SystemPowerplayPower` values. */
export type SystemPowerplayPowerConnection = {
  __typename?: 'SystemPowerplayPowerConnection';
  /** A list of edges which contains the `SystemPowerplayPower` and cursor to aid in pagination. */
  edges: Array<Maybe<SystemPowerplayPowerEdge>>;
  /** A list of `SystemPowerplayPower` objects. */
  nodes: Array<Maybe<SystemPowerplayPower>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SystemPowerplayPower` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `SystemPowerplayPower` edge in the connection. */
export type SystemPowerplayPowerEdge = {
  __typename?: 'SystemPowerplayPowerEdge';
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars['Cursor']['output']>;
  /** The `SystemPowerplayPower` at the end of the edge. */
  node: Maybe<SystemPowerplayPower>;
};

/** Methods to use when ordering `SystemPowerplayPower`. */
export type SystemPowerplayPowerOrderBy =
  | 'NATURAL'
  | 'POWER_ID_ASC'
  | 'POWER_ID_DESC'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'SYSTEM_ID_ASC'
  | 'SYSTEM_ID_DESC';

export type SystemSecurityEnum =
  | 'Anarchy'
  | 'High'
  | 'Low'
  | 'Medium';

export type ConflictDetailsQueryVariables = Exact<{
  factionId: Scalars['UUID']['input'];
  systemId: Scalars['UUID']['input'];
}>;


export type ConflictDetailsQuery = { __typename?: 'Query', factionConflicts: { __typename?: 'FactionConflictConnection', nodes: Array<{ __typename?: 'FactionConflict', factionWonDays: number, opponentWonDays: number, status: FactionConflictStatusEnum, type: FactionConflictTypeEnum, faction: { __typename?: 'Faction', name: string } | null, factionStakeStation: { __typename?: 'Station', name: string, stationType: StationTypeEnum | null } | null, opponentFaction: { __typename?: 'Faction', name: string } | null, opponentStakeStation: { __typename?: 'Station', name: string, stationType: StationTypeEnum | null } | null, system: { __typename?: 'System', name: string } | null } | null> } | null };

export type ConflictDetailsByOpponentQueryVariables = Exact<{
  factionId: Scalars['UUID']['input'];
  systemId: Scalars['UUID']['input'];
  opponentFactionId: Scalars['UUID']['input'];
}>;


export type ConflictDetailsByOpponentQuery = { __typename?: 'Query', factionConflictByFactionIdAndSystemIdAndOpponentFactionId: { __typename?: 'FactionConflict', factionWonDays: number, opponentWonDays: number, status: FactionConflictStatusEnum, type: FactionConflictTypeEnum, faction: { __typename?: 'Faction', name: string } | null, factionStakeStation: { __typename?: 'Station', name: string, stationType: StationTypeEnum | null } | null, opponentFaction: { __typename?: 'Faction', name: string } | null, opponentStakeStation: { __typename?: 'Station', name: string, stationType: StationTypeEnum | null } | null, system: { __typename?: 'System', name: string } | null } | null };

export type CopilotFactionByNameQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CopilotFactionByNameQuery = { __typename?: 'Query', factionByName: { __typename?: 'Faction', id: any, name: string, allegiance: AllegianceEnum, systemFactions: { __typename?: 'SystemFactionConnection', totalCount: number } } | null };

export type FactionByNameQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type FactionByNameQuery = { __typename?: 'Query', factionByName: { __typename?: 'Faction', id: any } | null };

export type FactionConflictsQueryVariables = Exact<{
  factionId: Scalars['UUID']['input'];
  first: Scalars['Int']['input'];
  after: InputMaybe<Scalars['Cursor']['input']>;
}>;


export type FactionConflictsQuery = { __typename?: 'Query', factionConflicts: { __typename?: 'FactionConflictConnection', edges: Array<{ __typename?: 'FactionConflictEdge', cursor: any | null, node: { __typename?: 'FactionConflict', factionWonDays: number, opponentWonDays: number, status: FactionConflictStatusEnum, type: FactionConflictTypeEnum, updatedAt: any, system: { __typename?: 'System', name: string } | null, faction: { __typename?: 'Faction', name: string } | null, factionStakeStation: { __typename?: 'Station', name: string, stationType: StationTypeEnum | null } | null, opponentFaction: { __typename?: 'Faction', name: string } | null, opponentStakeStation: { __typename?: 'Station', name: string, stationType: StationTypeEnum | null } | null } | null } | null>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor: any | null } } | null };

export type FactionStateNotificationDetailsQueryVariables = Exact<{
  factionId: Scalars['UUID']['input'];
  systemId: Scalars['UUID']['input'];
}>;


export type FactionStateNotificationDetailsQuery = { __typename?: 'Query', controller: { __typename?: 'FactionState', influence: number, faction: { __typename?: 'Faction', name: string } | null, system: { __typename?: 'System', name: string } | null } | null };

export type FactionSystemsQueryVariables = Exact<{
  factionId: Scalars['UUID']['input'];
  first: Scalars['Int']['input'];
  after: InputMaybe<Scalars['Cursor']['input']>;
}>;


export type FactionSystemsQuery = { __typename?: 'Query', faction: { __typename?: 'Faction', factionStates: { __typename?: 'FactionStateConnection', edges: Array<{ __typename?: 'FactionStateEdge', cursor: any | null, node: { __typename?: 'FactionState', influence: number, activeStates: Array<FactionStateEnum | null>, pendingStates: Array<FactionStateEnum | null>, system: { __typename?: 'System', name: string, updatedAt: any } | null } | null } | null>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor: any | null } } } | null };

export type PossibleExpansionOriginsQueryVariables = Exact<{
  factionId: Scalars['UUID']['input'];
}>;


export type PossibleExpansionOriginsQuery = { __typename?: 'Query', factionStates: { __typename?: 'FactionStateConnection', nodes: Array<{ __typename?: 'FactionState', influence: number, system: { __typename?: 'System', name: string } | null } | null> } | null };

export type ThreatDetailsQueryVariables = Exact<{
  factionId: Scalars['UUID']['input'];
  challengerFactionId: Scalars['UUID']['input'];
  systemId: Scalars['UUID']['input'];
}>;


export type ThreatDetailsQuery = { __typename?: 'Query', controller: { __typename?: 'FactionState', influence: number, faction: { __typename?: 'Faction', name: string } | null, system: { __typename?: 'System', name: string } | null } | null, challenger: { __typename?: 'FactionState', influence: number, faction: { __typename?: 'Faction', name: string } | null } | null };


export const ConflictDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ConflictDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"factionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"systemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factionConflicts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"condition"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"factionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"factionId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"systemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"systemId"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"faction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"factionStakeStation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"stationType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"factionWonDays"}},{"kind":"Field","name":{"kind":"Name","value":"opponentFaction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"opponentStakeStation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"stationType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"opponentWonDays"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"system"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<ConflictDetailsQuery, ConflictDetailsQueryVariables>;
export const ConflictDetailsByOpponentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ConflictDetailsByOpponent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"factionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"systemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"opponentFactionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factionConflictByFactionIdAndSystemIdAndOpponentFactionId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"factionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"factionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"systemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"systemId"}}},{"kind":"Argument","name":{"kind":"Name","value":"opponentFactionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"opponentFactionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"faction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"factionStakeStation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"stationType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"factionWonDays"}},{"kind":"Field","name":{"kind":"Name","value":"opponentFaction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"opponentStakeStation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"stationType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"opponentWonDays"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"system"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<ConflictDetailsByOpponentQuery, ConflictDetailsByOpponentQueryVariables>;
export const CopilotFactionByNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CopilotFactionByName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factionByName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"allegiance"}},{"kind":"Field","name":{"kind":"Name","value":"systemFactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]} as unknown as DocumentNode<CopilotFactionByNameQuery, CopilotFactionByNameQueryVariables>;
export const FactionByNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FactionByName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factionByName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<FactionByNameQuery, FactionByNameQueryVariables>;
export const FactionConflictsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FactionConflicts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"factionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factionConflicts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"condition"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"factionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"factionId"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"system"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"faction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"factionStakeStation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"stationType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"opponentFaction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"opponentStakeStation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"stationType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"factionWonDays"}},{"kind":"Field","name":{"kind":"Name","value":"opponentWonDays"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}}]} as unknown as DocumentNode<FactionConflictsQuery, FactionConflictsQueryVariables>;
export const FactionStateNotificationDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FactionStateNotificationDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"factionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"systemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"controller"},"name":{"kind":"Name","value":"factionStateByFactionIdAndSystemId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"factionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"factionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"systemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"systemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"influence"}},{"kind":"Field","name":{"kind":"Name","value":"faction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"system"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<FactionStateNotificationDetailsQuery, FactionStateNotificationDetailsQueryVariables>;
export const FactionSystemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FactionSystems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"factionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"faction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"factionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factionStates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"INFLUENCE_DESC"}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"influence"}},{"kind":"Field","name":{"kind":"Name","value":"system"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activeStates"}},{"kind":"Field","name":{"kind":"Name","value":"pendingStates"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FactionSystemsQuery, FactionSystemsQueryVariables>;
export const PossibleExpansionOriginsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PossibleExpansionOrigins"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"factionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factionStates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"condition"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"factionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"factionId"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"INFLUENCE_DESC"}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"influence"}},{"kind":"Field","name":{"kind":"Name","value":"system"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<PossibleExpansionOriginsQuery, PossibleExpansionOriginsQueryVariables>;
export const ThreatDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ThreatDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"factionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"challengerFactionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"systemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"controller"},"name":{"kind":"Name","value":"factionStateByFactionIdAndSystemId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"factionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"factionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"systemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"systemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"influence"}},{"kind":"Field","name":{"kind":"Name","value":"faction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"system"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"challenger"},"name":{"kind":"Name","value":"factionStateByFactionIdAndSystemId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"factionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"challengerFactionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"systemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"systemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"influence"}},{"kind":"Field","name":{"kind":"Name","value":"faction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ThreatDetailsQuery, ThreatDetailsQueryVariables>;