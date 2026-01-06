// hooks/useGraphQL.js
import { useState, useEffect } from "react";
import { client } from "../api/graphql-client";

export function useGraphQL(query, variables = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNow = () => {
    setLoading(true)
    client
      .request(query, variables)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  //   useEffect(() => {
  //     client
  //       .request(query, variables)
  //       .then(setData)
  //       .catch((err) => setError(err.message))
  //       .finally(() => setLoading(false));
  //   }, [query, JSON.stringify(variables)]);

  return { data, loading, error, fetchNow };
}
