import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.bensiebert.saveworld",
  appName: "SaveWorld",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    LiveUpdates: {
      appId: "95cf375d",
      channel: "Production",
      autoUpdateMethod: "background",
      maxVersions: 4,
    },
  },
};

export default config;
