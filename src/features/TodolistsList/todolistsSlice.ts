import { todolistsAPI, TodolistType } from "api/todolists-api";
import { Dispatch } from "redux";
import { appActions, RequestStatusType } from "app/appSlice";
import { handleServerNetworkError } from "utils/error-utils";
import { AppDispatch, AppThunk } from "app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
      // return state.filter((tl) => tl.id != action.payload.id);
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      // return [{ ...action.todolist, filter: "all", entityStatus: "idle" }, ...state]
      // state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
      const newTodolist: TodolistDomainType = { ...action.payload.todolist, filter: "all", entityStatus: "idle" }; // можно аншифтнуть сразу объект нового тодуса и тогда не нужна типизация
      state.unshift(newTodolist);
    },
    setTodolists: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {
      // state = action.payload.todolists.map(el=> ({...el,filter: "all", entityStatus: "idle"}))
      action.payload.todolists.forEach((tl) => {
        state.push({ ...tl, filter: "all", entityStatus: "idle" });
      });
    },
    changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      // return state.map((tl) => (tl.id === action.id ? { ...tl, title: action.title } : tl))
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index !== -1) {
        state[index].title = action.payload.title;
      }
    },
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index !== -1) {
        state[index].filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index !== -1) {
        state[index].entityStatus = action.payload.entityStatus;
      }
    },
  },
});

export const todolistsReducer = slice.reducer;
export const todolistActions = slice.actions;
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({ type: "SET-TODOLISTS", todolists }) as const;

// thunks
export const fetchTodolistsTC = (): AppThunk => {
  return (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistsAPI
      .getTodolists()
      .then((res) => {
        dispatch(todolistActions.setTodolists({ todolists: res.data }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
};
export const removeTodolistTC = (todolistId: string): AppThunk => {
  return (dispatch) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(appActions.setAppStatus({ status: "loading" }));
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    // dispatch(changeTodolistEntityStatusAC(todolistId, "loading"));
    dispatch(todolistActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: "loading" }));
    todolistsAPI.deleteTodolist(todolistId).then((res) => {
      //      dispatch(removeTodolistAC(todolistId));
      dispatch(todolistActions.removeTodolist({ id: todolistId }));
      //скажем глобально приложению, что асинхронная операция завершена
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    });
  };
};
export const addTodolistTC = (title: string): AppThunk => {
  return (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistsAPI.createTodolist(title).then((res) => {
      // dispatch(addTodolistAC(res.data.data.item));
      dispatch(todolistActions.addTodolist({ todolist: res.data.data.item }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    });
  };
};
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
  return (dispatch) => {
    todolistsAPI.updateTodolist(id, title).then((res) => {
      //dispatch(changeTodolistTitleAC(id, title));
      dispatch(todolistActions.changeTodolistTitle({ id, title }));
    });
  };
};

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
