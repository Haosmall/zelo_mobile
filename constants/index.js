// export const REACT_APP_API_URL = 'http://tienganhpro.xyz/api';
// export const REACT_APP_SOCKET_URL = 'http://tienganhpro.xyz';
export const REACT_APP_API_URL = 'http://192.168.1.7:3001';
export const REACT_APP_SOCKET_URL = 'http://192.168.1.7:3001';
export const DEFAULT_PAGE = 0;
export const DEFAULT_PAGE_SIZE = 20;
export const REACTIONS = ['♥️', '👍', '😄', '😲', '😭', '😡'];
export const DEFAULT_COVER_IMAGE =
  'https://res.cloudinary.com/depjgf4uu/image/upload/v1633711296/wallhaven-8ok7vk_fsct6y.jpg';
export const NO_INTERNET_IMAGE =
  'https://res.cloudinary.com/depjgf4uu/image/upload/v1633875955/no-internet_sgdpzu.png';
export const EMPTY_IMAGE =
  'https://res.cloudinary.com/depjgf4uu/image/upload/v1633875942/empty_nvkxrb.png';

export const messageType = {
  ALL: 'ALL',
  TEXT: 'TEXT',
  HTML: 'HTML',
  NOTIFY: 'NOTIFY',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  FILE: 'FILE',
  VOTE: 'VOTE',
};
export const friendType = {
  FRIEND: 'FRIEND',
  FOLLOWER: 'FOLLOWER',
  YOU_FOLLOW: 'YOU_FOLLOW',
  NOT_FRIEND: 'NOT_FRIEND',
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
