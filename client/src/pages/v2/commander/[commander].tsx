import {
  QueryParamKind,
  parseQuery,
  useQueryParams,
} from "@reverecre/next-query-params";
import Head from "next/head";
import { useRouter } from "next/router";
import { PropsWithChildren, useMemo } from "react";
import { graphql, useFragment, usePreloadedQuery } from "react-relay/hooks";
import { RelayProps, withRelay } from "relay-nextjs";
import { Banner } from "../../../components/banner/banner";
import { Navigation } from "../../../components/nav";
import { Table, TableColumnConfig } from "../../../components/table";
import { getClientEnvironment } from "../../../lib/client/relay_client_environment";
import {
  Commander_CommanderQuery,
  EntrySortBy,
} from "../../../queries/__generated__/Commander_CommanderQuery.graphql";
import { Commander_EntryTableData$key } from "../../../queries/__generated__/Commander_EntryTableData.graphql";
import { SortDirection } from "../../../queries/__generated__/commanders_CommandersQuery.graphql";

const ENTRIES_TABLE_COLUMN_CONFIG: TableColumnConfig[] = [
  {
    id: "name",
    displayName: "Player Name",
    sortVariable: "NAME",
  },
  { id: "standing", displayName: "Standing", sortVariable: "STANDING" },
  { id: "wins", displayName: "Wins", sortVariable: "WINS" },
  { id: "losses", displayName: "Losses", sortVariable: "LOSSES" },
  { id: "draws", displayName: "Draws", sortVariable: "DRAWS" },
  {
    id: "winRate",
    displayName: "Win Rate",
    sortVariable: "WINRATE",
  },
  { id: "tournament", displayName: "Tournament", sortVariable: "DATE" },
];

function EntriesTable(props: { entries: Commander_EntryTableData$key }) {
  const entries = useFragment(
    graphql`
      fragment Commander_EntryTableData on Entry @relay(plural: true) {
        player {
          name
        }

        tournament {
          name
        }

        id
        decklist
        standing
        wins
        losses
        draws
        winRate
      }
    `,
    props.entries,
  );

  return (
    <Table
      layout="WLD"
      columns={ENTRIES_TABLE_COLUMN_CONFIG}
      data={entries.map((e) => {
        return {
          id: e.id,
          name: e.player?.name ?? "Unknown Player",
          href: e.decklist ?? undefined,
          metadata: {
            standing: e.standing,
            wins: e.wins,
            losses: e.losses,
            draws: e.draws,
            winRate:
              new Intl.NumberFormat("en", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format((e.winRate ?? 0) * 100) + "%",
            tournament: e.tournament.name,
          },
        };
      })}
    />
  );
}

function CommandersPageShell({ children }: PropsWithChildren<{}>) {
  const router = useRouter();
  const [queryParams, updateQueryParams] = useQueryParams({
    minSize: QueryParamKind.STRING,
    maxSize: QueryParamKind.STRING,
    minDate: QueryParamKind.STRING,
    maxDate: QueryParamKind.STRING,
    minStanding: QueryParamKind.STRING,
    maxStanding: QueryParamKind.STRING,
    minWins: QueryParamKind.STRING,
    maxWins: QueryParamKind.STRING,
    minLosses: QueryParamKind.STRING,
    maxLosses: QueryParamKind.STRING,
    minDraws: QueryParamKind.STRING,
    maxDraws: QueryParamKind.STRING,
  });

  const oneYearAgo = useMemo(() => {
    const now = new Date();
    now.setUTCFullYear(now.getUTCFullYear() - 1);
    return now.toISOString().split("T")[0];
  }, []);

  return (
    <div className="flex h-screen w-screen bg-secondary">
      <Navigation />
      <div className="flex flex-grow flex-col overflow-auto">
        <Banner
          title={router.query.commander as string}
          backHref="/v2"
          filters={[
            {
              displayName: "Standing",
              label: "Standing",
              variableName: [
                {
                  variableName: "minStanding",
                  label: "is greater than (≥)",
                  shortLabel: "≥",
                  currentValue: queryParams.minStanding,
                },
                {
                  variableName: "maxStanding",
                  label: "is less than (≤)",
                  shortLabel: "≤",
                  currentValue: queryParams.maxStanding,
                },
              ],
              inputType: "number",
            },
            {
              displayName: "Tournament Size",
              label: "Tournament Size",
              variableName: [
                {
                  variableName: "minSize",
                  label: "is greater than (≥)",
                  shortLabel: "≥",
                  currentValue:
                    queryParams.minSize == null && queryParams.maxSize == null
                      ? "60"
                      : queryParams.minSize,
                },
                {
                  variableName: "maxSize",
                  label: "is less than (≤)",
                  shortLabel: "≤",
                  currentValue: queryParams.maxSize,
                },
              ],
              inputType: "number",
            },
            {
              displayName: "Tournament Date",
              variableName: [
                {
                  variableName: "minDate",
                  label: "is after (≥)",
                  shortLabel: "≥",
                  currentValue:
                    queryParams.minDate == null && queryParams.maxDate == null
                      ? oneYearAgo
                      : queryParams.minDate,
                },
                {
                  variableName: "maxDate",
                  label: "is before (≤)",
                  shortLabel: "≤",
                  currentValue: queryParams.maxDate,
                },
              ],
              inputType: "date",
            },
            {
              displayName: "Wins",
              label: "Wins",
              variableName: [
                {
                  variableName: "minWins",
                  label: "is greater than (≥)",
                  shortLabel: "≥",
                  currentValue: queryParams.minWins,
                },
                {
                  variableName: "maxWins",
                  label: "is less than (≤)",
                  shortLabel: "≤",
                  currentValue: queryParams.maxWins,
                },
              ],
              inputType: "number",
            },
            {
              displayName: "Losses",
              label: "Losses",
              variableName: [
                {
                  variableName: "minLosses",
                  label: "is greater than (≥)",
                  shortLabel: "≥",
                  currentValue: queryParams.minLosses,
                },
                {
                  variableName: "maxLosses",
                  label: "is less than (≤)",
                  shortLabel: "≤",
                  currentValue: queryParams.maxLosses,
                },
              ],
              inputType: "number",
            },
            {
              displayName: "Draws",
              label: "Draws",
              variableName: [
                {
                  variableName: "minDraws",
                  label: "is greater than (≥)",
                  shortLabel: "≥",
                  currentValue: queryParams.minDraws,
                },
                {
                  variableName: "maxDraws",
                  label: "is less than (≤)",
                  shortLabel: "≤",
                  currentValue: queryParams.maxDraws,
                },
              ],
              inputType: "number",
            },
          ]}
          onFilterChange={(nextValues) => {
            updateQueryParams(nextValues as any);
          }}
        />

        <main className="w-full bg-secondary px-2 py-4 text-white md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

const CommanderQuery = graphql`
  query Commander_CommanderQuery(
    $filters: EntryFilters
    $sortBy: EntrySortBy
    $sortDir: SortDirection
    $commander: String!
  ) {
    commander(name: $commander) {
      entries(filters: $filters, sortBy: $sortBy, sortDir: $sortDir) {
        ...Commander_EntryTableData
      }
    }
  }
`;

function CommanderPage({
  preloadedQuery,
}: RelayProps<{}, Commander_CommanderQuery>) {
  const { commander } = usePreloadedQuery(CommanderQuery, preloadedQuery);

  return (
    <>
      <Head>
        <title>EDH Top16</title>
      </Head>
      <CommandersPageShell>
        <EntriesTable entries={commander.entries} />
      </CommandersPageShell>
    </>
  );
}

export default withRelay(CommanderPage, CommanderQuery, {
  fallback: (
    <CommandersPageShell>
      <Table columns={ENTRIES_TABLE_COLUMN_CONFIG} />
    </CommandersPageShell>
  ),
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async (ctx) => {
    const { createServerEnvironment } = await import(
      "../../../lib/server/relay_server_environment"
    );

    return createServerEnvironment();
  },
  variablesFromContext: (ctx) => {
    let { sortBy, sortDir, commander, ...filters } = parseQuery(ctx.query, {
      sortBy: QueryParamKind.STRING,
      sortDir: QueryParamKind.STRING,
      commander: QueryParamKind.STRING_REQUIRED,
      minSize: QueryParamKind.NUMBER,
      maxSize: QueryParamKind.NUMBER,
      minDate: QueryParamKind.STRING,
      maxDate: QueryParamKind.STRING,
      minStanding: QueryParamKind.NUMBER,
      maxStanding: QueryParamKind.NUMBER,
      minWins: QueryParamKind.NUMBER,
      maxWins: QueryParamKind.NUMBER,
      minLosses: QueryParamKind.NUMBER,
      maxLosses: QueryParamKind.NUMBER,
      minDraws: QueryParamKind.NUMBER,
      maxDraws: QueryParamKind.NUMBER,
    });

    if (filters.minSize == null && filters.maxSize == null) {
      filters = { ...filters, minSize: 60 };
    }

    if (filters.minDate == null && filters.maxDate == null) {
      const now = new Date();
      now.setUTCFullYear(now.getUTCFullYear() - 1);
      filters = { ...filters, minDate: now.toISOString().split("T")[0] };
    }

    if (
      (sortBy != null && !isSortBy(sortBy)) ||
      (sortDir != null && !isSortDir(sortDir))
    ) {
      return { filters, commander };
    }

    return { ...filters, sortBy, sortDir, commander };
  },
});

function isSortBy(s: string): s is EntrySortBy {
  return ["STANDING", "WINS", "LOSSES", "DRAWS", "WINRATE", "DATE"].includes(s);
}

function isSortDir(s: string): s is SortDirection {
  return ["ASC", "DESC"].includes(s);
}