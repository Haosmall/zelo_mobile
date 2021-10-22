import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {conversationApi, messageApi} from '../api';
import {messageType} from '../constants';
import commonFuc from '../utils/commonFuc';
import dateUtils from '../utils/dateUtils';

const KEY = 'message';

export const fetchConversations = createAsyncThunk(
  `${KEY}/fetchConversations`,
  async (params, thunkApi) => {
    const conversations = await conversationApi.fetchConversations();
    return conversations;
  },
);
export const fetchMessages = createAsyncThunk(
  `${KEY}/fetchMessages`,
  async (params, thunkApi) => {
    const {conversationId, apiParams, isSendMessage = false} = params;
    const messages = await messageApi.fetchMessage(conversationId, apiParams);
    return {messages, conversationId, isSendMessage};
  },
);

const messageSlice = createSlice({
  name: KEY,
  initialState: {
    isLoading: false,
    conversations: [],
    messagePages: {},
    messages: [],
    currentConversationId: '',
    currentConversation: {},
    currentVote: {},
  },

  reducers: {
    // thay doi state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setCurrentVote: (state, action) => {
      state.currentVote = action.payload;
    },

    clearMessagePages: (state, action) => {
      state.messagePages = {};
      state.messages = [];
      state.currentConversationId = '';
      state.currentConversation = {};
      state.currentVote = {};
    },

    updateCurrentConversation: (state, action) => {
      const {conversationId} = action.payload;
      const index = state.conversations.findIndex(
        conversationEle => conversationEle._id === conversationId,
      );
      state.currentConversation = state.conversations[index];
    },

    addMessage: (state, action) => {
      const {conversationId, message} = action.payload;

      if (message.type === messageType.VOTE) {
        const currentMessages = state.messages;
        const newMessages = currentMessages.map(messageEle =>
          messageEle._id === message._id ? message : messageEle,
        );
        state.messages = newMessages;
        return;
      }
      // tìm conversation
      const index = state.conversations.findIndex(
        conversationEle => conversationEle._id === conversationId,
      );
      const seachConversation = state.conversations[index];

      seachConversation.numberUnread = seachConversation.numberUnread + 1;
      seachConversation.lastMessage = {
        ...message,
        createdAt: dateUtils.toTime(message.createdAt),
      };
      // xóa conversation đó ra
      const conversationTempt = state.conversations.filter(
        conversationEle => conversationEle._id !== conversationId,
      );

      if (conversationId === state.currentConversationId) {
        const length = state.messages.length;

        if (length) {
          const messagesReverse = state.messages.reverse();
          const lastMessage = messagesReverse[length - 1];
          if (lastMessage._id !== message._id) {
            messagesReverse.push(message);
            state.messages = messagesReverse.reverse();
          }
        } else {
          state.messages.push(message);
        }
        seachConversation.numberUnread = 0;
      }

      state.conversations = [seachConversation, ...conversationTempt];
    },

    deleteMessage: (state, action) => {
      const {conversationId, id} = action.payload;
      const conversations = state.conversations;
      const messages = state.messages.reverse();

      // tìm conversation
      const index = conversations.findIndex(
        conversationEle => conversationEle._id === conversationId,
      );
      if (index > -1) {
        const seachConversation = conversations[index];
        const lastMessage = seachConversation.lastMessage;

        if (lastMessage._id === id) {
          const newConversations = [...conversations];
          const newLastMessage = {...lastMessage, isDeleted: true};
          newConversations[index].lastMessage = newLastMessage;
          state.conversations = newConversations;
        }
      }
      if (conversationId === state.currentConversationId) {
        // tìm messages
        const index = messages.findIndex(messageEle => messageEle._id === id);
        if (index > -1) {
          const seachMessage = messages[index];
          const newMessage = [...messages];

          newMessage[index] = {...seachMessage, isDeleted: true};
          state.messages = newMessage.reverse();
        }
      }
    },

    deleteMessageOnlyMe: (state, action) => {
      const messageId = action.payload;
      const messages = state.messages.reverse();

      // xóa messages đó ra
      const newMessages = messages.filter(
        messageEle => messageEle._id !== messageId,
      );
      state.messages = newMessages.reverse();
    },
    addReaction: (state, action) => {
      const {conversationId, messageId, user, type} = action.payload;

      if (conversationId === state.currentConversationId) {
        const messages = state.messages.reverse();
        // tìm messages
        const index = messages.findIndex(
          messageEle => messageEle._id === messageId,
        );
        if (index > -1) {
          const seachMessage = messages[index];
          const newMessage = [...messages];
          const oldReacts = seachMessage.reacts;

          // tìm user
          const userIndex = oldReacts.findIndex(
            reactEle => reactEle.user._id === user._id,
          );
          const newReact = {user, type: +type};
          let newReacts = oldReacts;

          if (userIndex === -1) {
            newReacts = [...oldReacts, newReact];
          } else {
            newReacts[userIndex] = newReact;
          }

          newMessage[index] = {...seachMessage, reacts: newReacts};
          state.messages = [];
          state.messages = newMessage.reverse();
        }
      }
    },

    renameConversation: (state, action) => {
      const {conversationId, conversationName, message} = action.payload;
      // tìm conversation
      const index = state.conversations.findIndex(
        conversationEle => conversationEle._id === conversationId,
      );
      const seachConversation = state.conversations[index];

      console.log({conversationId, conversationName, message});

      seachConversation.numberUnread = seachConversation.numberUnread + 1;
      seachConversation.lastMessage = {
        ...message,
        createdAt: dateUtils.toTime(message.createdAt),
      };
      seachConversation.name = conversationName;
      // xóa conversation đó ra
      const conversationTempt = state.conversations.filter(
        conversationEle => conversationEle._id !== conversationId,
      );

      if (conversationId === state.currentConversationId) {
        const length = state.messages.length;

        if (length) {
          const messagesReverse = state.messages.reverse();
          const lastMessage = messagesReverse[length - 1];
          if (lastMessage._id !== message._id) {
            messagesReverse.push(message);
            state.messages = messagesReverse.reverse();
          }
        } else {
          state.messages.push(message);
        }
        seachConversation.numberUnread = 0;
      }

      state.currentConversation = seachConversation;
      state.conversations = [seachConversation, ...conversationTempt];
    },
  },
  // xu ly api roi thay doi state
  extraReducers: {
    // Đang xử lý
    [fetchConversations.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchConversations.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.conversations = action.payload;
    },
    // Xử lý khi bị lỗi
    [fetchConversations.rejected]: (state, action) => {
      state.isLoading = false;
    },

    // Đang xử lý
    [fetchMessages.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchMessages.fulfilled]: (state, action) => {
      state.isLoading = false;
      const {messages, conversationId, isSendMessage} = action.payload;

      // xét currentConversationId
      const conversationIndex = state.conversations.findIndex(
        conversationEle => conversationEle._id === conversationId,
      );

      state.conversations[conversationIndex] = {
        ...state.conversations[conversationIndex],
        numberUnread: 0,
      };

      state.currentConversationId = conversationId;
      state.messagePages = messages;
      if (isSendMessage) {
        console.log('fext mess send');
        state.messages = messages.data.reverse();
      } else {
        console.log('fext mess heare');
        const temp = [...messages.data, ...state.messages.reverse()];
        state.messages = commonFuc.getUniqueListBy(temp, '_id').reverse();
      }
    },
    // Xử lý khi bị lỗi
    [fetchMessages.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});

const {reducer, actions} = messageSlice;
export const {
  setLoading,
  updateCurrentConversation,
  clearMessagePages,
  addMessage,
  deleteMessageOnlyMe,
  deleteMessage,
  addReaction,
  renameConversation,
  setCurrentVote,
} = actions;
export default reducer;
