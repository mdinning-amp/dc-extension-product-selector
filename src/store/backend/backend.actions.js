import { getBackend } from "../../backends/backends";
import { setCatalog } from "../catalog/catalog.actions";

export const SET_BACKEND = 'SET_BACKEND';
export const INIT_BACKEND = 'INIT_BACKEND';

export const initBackend = () => (dispatch, getState) => {
  const { params } = getState();
  const backend = getBackend(params);

  dispatch(setBackend(backend));
  dispatch(setCatalog(backend.defaultCatalog(params)));

  return backend;
};

export const setBackend = value => ({
  type: SET_BACKEND,
  value
});
