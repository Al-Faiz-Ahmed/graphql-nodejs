export const GET_TODOS = `
  query {
    getTodos {
      id
      title
      completed
      user {
        name
        email
      }
    }
  }
`;