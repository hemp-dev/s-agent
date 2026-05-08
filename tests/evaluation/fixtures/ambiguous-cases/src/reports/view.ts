export function readOnlyView(dispatch: (event: { type: string }) => void): string {
  dispatch({ type: "LOCAL_UI_REFRESH" });
  return "view";
}
