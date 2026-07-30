// gama3d/net — authoritative multiplayer: prediction, reconciliation,
// interpolation, and transports you can test without a socket.
//
// A separate entry point, like `gama3d/editor` and `gama3d/rapier`: a
// single-player game should not carry netcode it never runs.
export {
  NET_PROTOCOL,
  jsonCodec,
  diffState,
  blendState,
  blendAngle,
  type NetState,
  type NetEntitySnapshot,
  type ClientMessage,
  type ServerMessage,
  type Codec,
  type NetApply,
} from './net/protocol';
export {
  Link,
  LoopbackTransport,
  WebSocketTransport,
  BroadcastChannelTransport,
  type Transport,
  type LinkConditions,
} from './net/transport';
export {
  NetServer,
  type NetServerOptions,
  type NetConnection,
} from './net/NetServer';
export {
  NetClient,
  type NetClientOptions,
  type NetView,
} from './net/NetClient';
