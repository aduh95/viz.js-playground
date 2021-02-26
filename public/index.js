import hydrate from "preact-iso/hydrate";
import App from "./App.js";
export { App };

hydrate(<App id="app_root" />);

export async function prerender(data) {
  const { default: prerender } = await import("preact-iso/prerender");
  return await prerender(<App {...data} prerender={true} />);
}
