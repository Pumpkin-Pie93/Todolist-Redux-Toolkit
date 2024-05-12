import axios from "axios"

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "0f802d37-c47b-49e0-a140-1a6b7b8a207f",
    // "API-KEY": "1cdd9f77-c60e-4af5-b194-659e4ebd5d41",
    Authorization: "Bearer 4ce73afc-ab46-40e5-9a95-56d931ab18f9",
  },
})
