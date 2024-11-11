import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import UserList from "./UserList";
export default function App() {
  return (
    <Provider store={store}>
      <UserList />
    </Provider>
  );
}
