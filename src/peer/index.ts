import Peer from 'peerjs';
import createDebugger from 'debug';

import { ID } from './id';
import { User, create, is, Message } from './standard';

export * from './standard';

const debug = createDebugger('vs:communication/web-rtc');

interface CleanupCallback {
  (): void;
}

function deleteItem<T = unknown>(haystack: T[], needle: T): T[] {
  const index = haystack.indexOf(needle);

  if (index >= 0) {
    return haystack.splice(index, 1);
  }

  return haystack;
}

function callCallbacks(cbs: Array<(...args: any[]) => any>, ...args: any[]) {
  cbs.forEach(cb => {
    try {
      cb(...args);
    } catch (error) {
      debug(error);
    }
  });
}

export function createChannel(asController: boolean | User['role'] = false) {
  const role = asController === true ? 'admin' : asController || 'audience';
  const id = role === 'admin' ? ID.deviceFixed : ID.device;

  const user: User = {
    id,
    name: role,
    email: id + '@' + window.location.hostname,
    role: role,
  };

  function createHandlers(): Array<(...args: any[]) => any> {
    return [];
  }
  const listeners = {
    onPeerJoin: createHandlers(),
    onPeerLeave: createHandlers(),
    onPeerError: createHandlers(),
    onMessage: createHandlers(),
    onIncomingCall: createHandlers(),
    onMissedCall: createHandlers(),
    onCallEnd: createHandlers(),
  };

  let isReady = false;
  const postReadyCbs: Array<() => void> = [];
  const peer = new Peer(id);

  function doWhenReady(fn: () => void) {
    if (isReady) fn();
    else postReadyCbs.push(fn);
  }

  function doWhenReadyPromise<T = unknown>(fn: () => T | Promise<T>): Promise<T> {
    return new Promise(resolve => {
      if (isReady) resolve(fn());
      else postReadyCbs.push(() => resolve(fn()));
    });
  }

  peer.on('open', () => {
    debug(`Channel open: ${id} (${user.name})`);
    isReady = true;

    const cbs = postReadyCbs.slice();

    postReadyCbs.length = 0;

    cbs.forEach(fn => fn());
  });

  const dataConnections: Record<string, Peer.DataConnection> = {};
  const mediaConnections: Record<string, Peer.MediaConnection> = {};
  const answeredCalls: Record<string, boolean> = {};
  function setupDataConnection(connection: Peer.DataConnection, asReceiver: boolean = true) {
    let remoteUser: User = asReceiver ? connection.metadata : null;
    if (!connection.metadata || !connection.metadata.id) {
      connection.close();
      return;
    }

    const id = asReceiver ? remoteUser.id : connection.label;

    connection.on('open', () => {
      debug(`connection open:`, remoteUser);
      dataConnections[id] = connection;
      // Receiver should send ID.
      if (asReceiver) {
        connection.send(create.identity(user));
        callCallbacks(listeners.onPeerJoin, remoteUser);
      }
    });

    connection.on('close', () => {
      debug(`connection close ::`, remoteUser);
      delete dataConnections[id];
      callCallbacks(listeners.onPeerLeave, remoteUser);
    });

    connection.on('error', error => {
      debug(`connection error ::`, remoteUser, error);
      delete dataConnections[id];
      callCallbacks(listeners.onPeerError, remoteUser, error);
    });

    connection.on('data', data => {
      debug(`connection data >>`, remoteUser, data);
      if (is.identity(data)) {
        remoteUser = data.payload;
        callCallbacks(listeners.onPeerJoin, remoteUser);
      } else {
        callCallbacks(listeners.onMessage, remoteUser, data);
      }
    });
  }

  function setupMediaConnection(connection: Peer.MediaConnection, remoteId: string | null = null) {
    const user: User = connection.metadata;

    user.status = 'online';

    if (!user || !user.id) {
      connection.close();
      return;
    }

    const id = remoteId ? remoteId : user.id;

    if (mediaConnections[id]) {
      mediaConnections[id].close();
    }

    mediaConnections[id] = connection;

    if (!remoteId) {
      debug(`call ::`, user);
      callCallbacks(listeners.onIncomingCall, user);
    }

    connection.on('close', () => {
      debug(`call close ::`, user);
      callCallbacks(answeredCalls[id] ? listeners.onCallEnd : listeners.onMissedCall, user);
      delete mediaConnections[id];
    });

    connection.on('error', error => {
      debug(`call error ::`, user, error);
      callCallbacks(listeners.onPeerError, user, error);
    });
  }

  peer.on('connection', setupDataConnection);
  peer.on('call', setupMediaConnection);
  peer.on('error', error => {
    debug('error', error);
  });

  function createHandlerAPI<T extends (...args: any[]) => any>(source: Array<(...args: any[]) => any>) {
    return (fn: T): CleanupCallback => {
      source.push(fn);

      return () => deleteItem(source, fn);
    };
  }

  return {
    get id() {
      return user.id;
    },

    get secret() {
      return ID.secret;
    },

    set secret(value: string) {
      ID.secret = value;
    },

    get me() {
      return user;
    },

    setName(name: string) {
      user.name = name;
    },

    setRole(role: User['role']) {
      user.role = role;
    },

    setEmail(email: string) {
      user.email = email;
    },
    connect(id: string): Promise<User> {
      return doWhenReadyPromise<User>(() => {
        return new Promise<User>(resolve => {
          const connection = peer.connect(id, { metadata: user, label: id });

          setupDataConnection(connection, false);

          connection.on('data', data => {
            if (is.identity(data)) {
              resolve(data.payload);
            }
          });
        });
      });
    },
    disconnect(id: string) {
      return doWhenReady(() => {
        const connection = dataConnections[id];

        if (connection) {
          connection.close();
        } else {
          console.log(dataConnections);
        }
      });
    },
    sendMessage(id: string, type: string | Message, payload?: unknown) {
      return doWhenReadyPromise(async () => {
        const connection = dataConnections[id] || (await this.connect(id));
        const message = typeof type === 'string' ? { type, payload } : type;
        debug(`send ::`, message);
        connection.send(message);
      });
    },
    broadcast(type: string | Message, payload?: unknown) {
      return doWhenReadyPromise(async () => {
        Object.values(dataConnections).forEach(connection => {
          const message = typeof type === 'string' ? { type, payload } : type;
          debug(`send ::`, message);
          connection.send(message);
        });
      });
    },
    startCall(id: string, stream: MediaStream, meta: unknown = {}): Promise<MediaStream> {
      return doWhenReadyPromise(() => {
        return new Promise(resolve => {
          const connection = peer.call(id, stream, { metadata: { ...meta, ...user } });

          if (connection) {
            connection.on('stream', stream => resolve(stream));
            setupMediaConnection(connection, id);
          } else {
            callCallbacks(listeners.onPeerError, new Error('Cannot start call as no stream was provided'));
          }
        });
      });
    },
    endCall(id: string) {
      return doWhenReady(() => {
        const connection = mediaConnections[id];

        if (connection) {
          connection.close();
        }
      });
    },
    answerCall(id: string, stream?: MediaStream): Promise<MediaStream> {
      return doWhenReadyPromise(() => {
        return new Promise(resolve => {
          const connection = mediaConnections[id];

          if (connection) {
            connection.on('stream', stream => resolve(stream));
            connection.answer(stream);
          } else {
            callCallbacks(listeners.onPeerError, new Error('No incoming call to answer'));
          }
        });
      });
    },
    onPeerJoin: createHandlerAPI<(user: User) => void>(listeners.onPeerJoin),
    onPeerLeave: createHandlerAPI<(user: User) => void>(listeners.onPeerLeave),
    onPeerError: createHandlerAPI<(user: User, error: Error) => void>(listeners.onPeerError),
    onMessage: createHandlerAPI<(user: User, data: Message) => void>(listeners.onMessage),
    onIncomingCall: createHandlerAPI<(user: User) => void>(listeners.onIncomingCall),
    onMissedCall: createHandlerAPI<(user: User) => void>(listeners.onMissedCall),
    onCallEnd: createHandlerAPI<(user: User) => void>(listeners.onCallEnd),
  };
}

export type Channel = ReturnType<typeof createChannel>;
