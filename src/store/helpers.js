import { mapState, mapActions, mapGetters } from 'vuex';

/**
 * @typedef {import('./modules/streams').Call} Call
 * @typedef {import('./modules/users').Person} Person
 * @typedef {import('../peer').User} User
 * @typedef {import('../peer').Channel} Channel
 * @typedef {import('../surfaces').SurfaceName} SurfaceName
 */

export const root = {
  /**
   * @type {{ setup(channel: Channel): Promise<void>, channel(): Promise<Channel | null> }}
   */
  methods: mapActions(['setup', 'channel']),
};

export const control = {
  /**
   * @type {{ currentSlide(): number, totalSlides(): number }}
   */
  computed: mapState('control', ['currentSlide', 'totalSlides']),
  /**
   * @type {{ next(): Promise<void>, previous(): Promise<void>, setTotalSlides(count: number): Promise<void>, setCurrentSlide(index: number): Promise<void> }}
   */
  methods: mapActions('control', ['next', 'previous', 'setCurrentSlide', 'setTotalSlides']),
};

export const surface = {
  /**
   * @type {{ surface(): SurfaceName }}
   */
  computed: mapState('surface', ['surface']),
  /**
   * @type {{ setSurface(surface: SurfaceName): Promise<void> }}
   */
  methods: mapActions('surface', ['setSurface']),
};

export const users = {
  /**
   * @type {{ users(): Array<Person>, onlineUsers(): Array<Person> }}
   */
  computed: {
    ...mapState('users', ['users']),
    ...mapGetters('users', ['onlineUsers']),
  },
};

export const remotes = {
  /**
   * @type {{ remotes(): string[], remoteId(): string }}
   */
  computed: mapState('connections', ['remotes', 'remoteId']),
  /**
   * @type {{ setActiveRemote(id: string | null): Promise<void> }}
   */
  methods: mapActions('connections', ['setActiveRemote']),
};

export const streams = {
  /**
   * @type {{ incomingCalls(): Call[] }}
   */
  computed: mapGetters('streams', ['incomingCalls']),
  /**
   * @type {{ call(payload: { user: User, stream: MediaStream }), acceptCall(payload: { user: User, stream?: MediaStream }), getCallStream(id: string): MediaStream | undefined }}
   */
  methods: mapActions('streams', ['call', 'getCallStream', 'acceptCall']),
};
