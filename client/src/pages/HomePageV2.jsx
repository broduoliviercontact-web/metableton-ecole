/* HomePageV2 — temporary route /home-v2 for progressive integration testing.
   Assembles Open Design sub-components inside PublicLayout (Header + Footer).
   Does NOT replace the existing home page yet. */
import { Link } from 'react-router-dom';
import HomeHero from '../components/metableton-ui/home/HomeHero.jsx';
import SpectrumAnalyzer from '../components/metableton-ui/home/SpectrumAnalyzer.jsx';
import HomeModuleGrid from '../components/metableton-ui/home/HomeModuleGrid.jsx';
import MetabletonButton from '../components/metableton-ui/primitives/MetabletonButton.jsx';
import '../components/metableton-ui/tokens.css';
import '../components/metableton-ui/home/home-layout.css';

export default function HomePageV2() {
  return (
    <div className="metableton-theme">
      <div className="metableton-home-v2">
        <section className="metableton-home-v2-hero">
          <HomeHero
            ctaPrimary={
              <MetabletonButton variant="primary" as={Link} to="/catalog">
                Voir les cours
              </MetabletonButton>
            }
            ctaSecondary={
              <MetabletonButton as={Link} to="/catalog">
                Explorer le catalogue
              </MetabletonButton>
            }
          />
          <SpectrumAnalyzer />
        </section>

        <section className="metableton-home-v2-modules">
          <HomeModuleGrid />
        </section>
      </div>
    </div>
  );
}
