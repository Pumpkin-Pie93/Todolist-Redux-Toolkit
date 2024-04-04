// import { setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType } from "app/app-reducer";
import { ResponseType } from "api/todolists-api";
import { Dispatch } from "redux";
import { AppDispatch } from "app/store";
import { appActions } from "app/appSlice";

export const handleServerAppError = <D>(
  data: ResponseType<D>,
  dispatch: Dispatch,
  // dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>,
) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setAppError({ error: "Some error occurred" }));
  }
  dispatch(appActions.setAppError({ error: "failed" }));
};

export const handleServerNetworkError = (error: { message: string }, dispatch: AppDispatch) => {
  dispatch(appActions.setAppError(error.message ? { error: error.message } : { error: "Some error occurred" }));
  dispatch(appActions.setAppError({ error: "failed" }));
};
