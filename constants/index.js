export const REACT_APP_NODEJS_API_URL = 'http://192.168.1.9:3001';
export const DEFAULT_PAGE = 0;
export const DEFAULT_PAGE_SIZE = 20;
export const REACTIONS = ['♥️', '👍', '😄', '😲', '😭', '😡'];
export const messageType = {
  ALL: 'ALL',
  TEXT: 'TEXT',
  HTML: 'HTML',
  NOTIFY: 'NOTIFY',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  FILE: 'FILE',
};
export const DEFAULT_MESSAGE_MODAL_VISIBLE = {
  isVisible: false,
  isRecall: false,
  isMyMessage: false,
  messageId: '',
  messageContent: '',
};
export const DEFAULT_REACTION_MODAL_VISIBLE = {
  isVisible: false,
  messageId: '',
  reacts: [],
};
export const DEFAULT_RENAME_CONVERSATION_MODAL = {
  isVisible: false,
  conversationName: '',
  type: false,
};
export const DEFAULT_PIN_MESSAGE_MODAL = {
  isVisible: false,
  isError: false,
};
export const DEFAULT_ADD_VOTE_MODAL = {
  isVisible: false,
};
