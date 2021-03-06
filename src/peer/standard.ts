export interface Message<T extends string = string, P = unknown> {
  type: T;
  payload: P;
}

export interface User {
  /**
   * Unique device ID.
   */
  id: string;

  /**
   * User's email address.
   */
  email: string;

  /**
   * Display name.
   */
  name: string;

  /**
   * User role.
   */
  role: 'admin' | 'audience' | 'remote' | 'slideshow';

  status?: 'online' | 'offline';
}

const enum Action {
  REQUEST = '@vs/request',
  APPROVE = '@vs/approve',
  IDENTITY = '@vs/identity',
  VUEX_ACTION = '@vs/vuex/action',
  DISCONNECT = '@vs/disconnect',
  QUESTION = '@vs/question/ask',
  QUESTION_RESPONSE = '@vs/question/response',
  QUESTION_CLOSE = '@vs/question/close',
}

export interface Question {
  id: number;
  text: string;
  options: string[];
}

export interface QuestionMessage extends Message {
  type: Action.QUESTION;
  payload: Question;
}

export interface QuestionCloseMessage extends Message {
  type: Action.QUESTION_CLOSE;
  payload: null;
}

export interface QuestionResponseMessage extends Message {
  type: Action.QUESTION_RESPONSE;
  payload: {
    id: number;
    response: unknown;
  };
}

export interface RequestMessage extends Message {
  type: Action.REQUEST;
  payload: {
    resource: string;
    secret?: string;
    [key: string]: unknown;
  };
}

export interface ApproveMessage extends Message {
  type: Action.APPROVE;
  payload: string;
}

export interface DisconnectMessage extends Message {
  type: Action.DISCONNECT;
  payload: string;
}

export interface IdentityMessage extends Message {
  type: Action.IDENTITY;
  payload: User;
}

export interface VuexActionMessage extends Message {
  type: Action.VUEX_ACTION;
  payload: Message;
}

function createMessage<T extends string, P>(action: T, payload: P): Message<T, P> {
  return { type: action, payload: payload };
}

export const create = {
  request(resource: string, payload?: Record<string, unknown>): RequestMessage {
    return createMessage(Action.REQUEST, { ...payload, resource });
  },

  approve(resource: string): ApproveMessage {
    return createMessage(Action.APPROVE, resource);
  },

  disconnect(resource: string): DisconnectMessage {
    return createMessage(Action.DISCONNECT, resource);
  },

  identity(user: User): IdentityMessage {
    return createMessage(Action.IDENTITY, user);
  },

  vuexAction(payload: Message): VuexActionMessage {
    return createMessage(Action.VUEX_ACTION, payload);
  },

  question(question: Question): QuestionMessage {
    return createMessage(Action.QUESTION, question);
  },

  questionClose(): QuestionCloseMessage {
    return createMessage(Action.QUESTION_CLOSE, null);
  },

  questionResponse(questionId: number, response: unknown): QuestionResponseMessage {
    return createMessage(Action.QUESTION_RESPONSE, { id: questionId, response });
  },
};

function isMessage(message: unknown, type: Action) {
  return message && typeof message === 'object' && (message as any).type === type;
}

export const is = {
  request(message: unknown): message is RequestMessage {
    return isMessage(message, Action.REQUEST);
  },

  approve(message: unknown): message is RequestMessage {
    return isMessage(message, Action.APPROVE);
  },

  disconnect(message: unknown): message is DisconnectMessage {
    return isMessage(message, Action.DISCONNECT);
  },

  identity(message: unknown): message is IdentityMessage {
    return isMessage(message, Action.IDENTITY);
  },

  vuexAction(message: unknown): message is VuexActionMessage {
    return isMessage(message, Action.VUEX_ACTION);
  },

  question(message: unknown): message is QuestionMessage {
    return isMessage(message, Action.QUESTION);
  },

  questionClose(message: unknown): message is QuestionCloseMessage {
    return isMessage(message, Action.QUESTION_CLOSE);
  },

  questionResponse(message: unknown): message is QuestionResponseMessage {
    return isMessage(message, Action.QUESTION_RESPONSE);
  },
};
