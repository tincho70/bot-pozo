import NDK from "@nostr-dev-kit/ndk";

const relays = process.env.RELAYS.split(",");

const ndk = new NDK({
  explicitRelayUrls: relays,
});

//await ndk.connect()

// Define el filtro de eventos
const filter = {
  kinds: [1], // Tipo de eventos a filtrar
  authors: ["npub1..."], // Filtra por autor, si lo deseas
};

const subscription = ndk.subscribe(filter);

subscription.on("event", (event) => {
  console.log("Evento en tiempo real:", event);
});

// Recuerda manejar la desconexión cuando ya no necesites suscribirte a eventos
