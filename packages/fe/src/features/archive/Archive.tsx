import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getArchivedEvents } from "../../api/events";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useAuth } from "../../contexts/useAuth";
import ListItem from "../homepage/components/ListItem";

// yesterday as 'YYYY-MM-DD' in local time: the archive only holds past events
function yesterday() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function parsePage(value: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default function Archive() {
  const { isAuthenticated } = useAuth();
  // filters live in the url, so back/forward and shared links keep them
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parsePage(searchParams.get("page"));
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  const { data, error, isFetching } = useQuery({
    queryKey: ["getArchivedEvents", page, from, to],
    queryFn: () => getArchivedEvents({ page, from, to }),
    keepPreviousData: true,
  });

  // replace: true keeps typing in a filter from flooding the browser history
  function updateParams(changes: Record<string, string>, replace = false) {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) =>
      value ? next.set(key, value) : next.delete(key),
    );
    setSearchParams(next, { replace });
  }

  // a new filter starts again from the first page
  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateParams({ [e.target.name]: e.target.value, page: "" }, true);
  }

  const totalPages = data?.totalPages ?? 1;
  const events = (data?.items || []).map((event) => (
    <ListItem
      key={event.id}
      isAuthenticated={!!isAuthenticated}
      event={event}
      showYear
    ></ListItem>
  ));

  return (
    <>
      <p className="text-sm mb-4">archive</p>
      <div className="text-sm flex w-full mx-auto max-w-sm flex-col items-center gap-3 mb-6">
        <div className="flex w-full gap-4">
          <label className="flex-1 min-w-0 text-left">
            from
            <Input
              name="from"
              type="date"
              value={from}
              max={to || yesterday()}
              onChange={handleDateChange}
            ></Input>
          </label>
          <label className="flex-1 min-w-0 text-left">
            to
            <Input
              name="to"
              type="date"
              value={to}
              min={from || undefined}
              max={yesterday()}
              onChange={handleDateChange}
            ></Input>
          </label>
        </div>
        {(from || to) && (
          <Button onClick={() => setSearchParams({})}>clear</Button>
        )}
      </div>

      {error instanceof Error && (
        <p className="text-xs mb-3">{error.message}</p>
      )}
      {data && events.length === 0 && (
        <p className="text-sm">no events found</p>
      )}
      <div className="text-center">
        <div className="text-left inline-block">{events}</div>
      </div>

      {/* page > 1 keeps a way back from an out-of-range page in the url */}
      {(totalPages > 1 || page > 1) && (
        <div className="text-sm mt-4">
          <Button
            disabled={page <= 1 || isFetching}
            onClick={() => updateParams({ page: String(page - 1) })}
          >
            prev
          </Button>
          <span className="mx-2">
            page {page} of {totalPages}
          </span>
          <Button
            disabled={page >= totalPages || isFetching}
            onClick={() => updateParams({ page: String(page + 1) })}
          >
            next
          </Button>
        </div>
      )}
    </>
  );
}
