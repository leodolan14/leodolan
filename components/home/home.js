import { mountHero } from "../hero/hero.js";
import { mountProfile } from "../profile/profile.js";
import { mountHomeIntro } from "../home-intro/home-intro.js";
import { mountStats } from "../stats/stats.js";
import { initReveal } from "../../js/utils/reveal.js";

/**
 * Composes the home route from its constituent sections. Each section owns
 * its own markup/styles/behavior; this module only sequences the mount order.
 */
export async function mountHome(root) {
  await mountHero(root);
  await mountProfile(root);
  await mountHomeIntro(root);
  await mountStats(root);

  const disconnectReveal = initReveal(root);
  return () => {
    disconnectReveal();
  };
}
