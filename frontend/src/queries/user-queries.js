export const GET_ALL_USERS = `
  query {
    getAllUsers {
      name
      email
    }
  }
`;
export const GET_USER_BY_ID = `
  query GetUserByID($userId: ID){
    getUserById(id: $userId) {
      name
    }
  }
`;