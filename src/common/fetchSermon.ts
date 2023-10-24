import axios from 'axios';
import {Endpoints} from '../stores/apiStore';
import {strings} from '../strings';
import {ApiSermon} from '../types/apiStoreTypes';

export const fetchSermon = async (id: string): Promise<ApiSermon> => {
  const response = await axios
    .get(`${strings.url}${Endpoints.title}/${id}`)
    .then(r => r.data);

  return response;
};
