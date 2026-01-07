import { gql } from "@apollo/client";
import { useQuery,useLazyQuery } from "@apollo/client/react";
import { useMemo } from "react";

/**
 * Custom hook to handle GraphQL queries
 * @param {string} queryString - The GraphQL query as a string
 * @param {object} variables - The variables for the query
 */
const useApollo = (queryString, variables = {}) => {
    console.log(variables)
  // 1. Convert string to GraphQL AST
  // we memoize this so it only re-parses if the string actually changes
    const query = useMemo(() => {
      return gql`${queryString}`;
    }, [queryString]);

//   const query = () => {
//     return gql`
//       ${queryString}
//     `;
//   };
  // 2. Use the standard Apollo hook
  const [fetchUsers, { called, loading, data,error }] = useLazyQuery(query, {
   
   // Prevents the query from running on initial render
    // fetchPolicy: "cache-first", // Optional: customize how subsequent refetches behave
    // Recommended for production: ensures 'loading' becomes true
    
    // again when fetchFunction (refetch) is called.
    // notifyOnNetworkStatusChange: true,
  });

  // 3. Return the standard interface
  return {
    data,
    loading,
    error,
    refetch : fetchUsers,
  };
};

export { useApollo };
