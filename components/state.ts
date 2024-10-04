
export interface State {
  data: FormData[];
  modalVisible: boolean;
  startDate: Date | null;
  endDate: Date | null;
  showStartPicker: boolean;
  showEndPicker: boolean;
  refreshing: boolean;
}

export type Action =
  | { type: 'SET_MODAL_VISIBLE'; payload: boolean }
  | { type: 'SET_START_DATE'; payload: Date | null }
  | { type: 'SET_END_DATE'; payload: Date | null }
  | { type: 'SET_SHOW_START_PICKER'; payload: boolean }
  | { type: 'SET_SHOW_END_PICKER'; payload: boolean }
  | { type: 'SET_REFRESHING'; payload: boolean }
  | { type: 'SET_DATA'; payload: FormData[] };

export const initialState: State = {
  data: [],
  modalVisible: false,
  startDate: null,
  endDate: null,
  showStartPicker: false,
  showEndPicker: false,
  refreshing: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_MODAL_VISIBLE':
      return { ...state, modalVisible: action.payload };
    case 'SET_START_DATE':
      return { ...state, startDate: action.payload };
    case 'SET_END_DATE':
      return { ...state, endDate: action.payload };
    case 'SET_SHOW_START_PICKER':
      return { ...state, showStartPicker: action.payload };
    case 'SET_SHOW_END_PICKER':
      return { ...state, showEndPicker: action.payload };
    case 'SET_REFRESHING':
      return { ...state, refreshing: action.payload };
    case 'SET_DATA':
      return { ...state, data: action.payload };
    default:
      return state;
  }
};
